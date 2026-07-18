import { Request, Response } from "express";
import prisma from "../config/prisma";
import Zernio from "@zernio/node";
import axios from "axios";

const zernio = new Zernio({ apiKey: process.env.ZERNIO_API_KEY });

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

async function uploadMediaToZernio(mediaUrl: string, isVideo: boolean): Promise<string> {
  const urlPath = new URL(mediaUrl).pathname;
  const fileName = urlPath.split("/").pop() || (isVideo ? "video.mp4" : "image.jpg");
  const fileType = isVideo ? "video/mp4" : fileName.endsWith(".png") ? "image/png" : "image/jpeg";

  const presignResult: any = await zernio.media.getMediaPresignedUrl({
    body: { filename: fileName, contentType: fileType },
  });

  const uploadUrl = presignResult?.uploadUrl || presignResult?.data?.uploadUrl;
  const publicUrl = presignResult?.publicUrl || presignResult?.data?.publicUrl;
  if (!uploadUrl || !publicUrl) {
    throw new Error(`Presign response missing URLs: ${JSON.stringify(presignResult)}`);
  }

  const mediaResponse = await axios.get(mediaUrl, { responseType: "arraybuffer" });
  const fileBuffer = Buffer.from(mediaResponse.data);

  await axios.put(uploadUrl, fileBuffer, {
    headers: { "Content-Type": fileType },
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
  });

  return publicUrl;
}

async function getZernioAccountsMap(): Promise<Map<string, { accountId: string; platform: string }>> {
  const result: any = await zernio.accounts.listAccounts();
  // SDK may return { accounts }, { data: { accounts } }, or the array directly
  const accounts: any[] = result?.accounts || result?.data?.accounts || (Array.isArray(result) ? result : []);

  const map = new Map<string, { accountId: string; platform: string }>();
  for (const account of accounts) {
    const key = String(account.platform || "").toLowerCase();
    if (!map.has(key) && account.isActive) {
      map.set(key, { accountId: account._id, platform: account.platform });
    }
  }
  return map;
}

// IMPORTANT: This is a placeholder extractor. You MUST update the keys after
// logging one real response from `zernio.analytics.getAnalytics({ postId })`.
function extractZernioMetrics(z: any): { impressions: number; clicks: number; conversions: number } {
  const source = z?.data ?? z;

  const impressions = Number(source?.impressions ?? source?.metrics?.impressions ?? 0) || 0;
  const clicks = Number(source?.clicks ?? source?.metrics?.clicks ?? 0) || 0;

  // Conversions may not exist for organic post analytics on all platforms
  const conversions = Number(source?.conversions ?? source?.metrics?.conversions ?? 0) || 0;

  return { impressions, clicks, conversions };
}

// ─────────────────────────────────────────────────────────────────────────────
// Controllers
// ─────────────────────────────────────────────────────────────────────────────

// GET /social/connect-url
export const getConnectUrl = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).id;
    if (!userId) return res.status(401).json({ message: "Unauthorized", success: false });

    const { platform, profileId, redirectUrl } = req.query;
    if (!platform || !profileId) {
      return res.status(400).json({
        message: "platform and profileId query params are required",
        success: false,
      });
    }

    const result: any = await zernio.connect.getConnectUrl({
      platform: platform as string,
      profileId: profileId as string,
      ...(redirectUrl ? { redirectUrl: redirectUrl as string } : {}),
    });

    return res.status(200).json({
      success: true,
      authUrl: result?.authUrl || result?.data?.authUrl,
    });
  } catch (error: any) {
    console.error("Error getting connect URL:", error);
    return res.status(500).json({
      message: error.message || "Failed to get connect URL",
      success: false,
    });
  }
};

// GET /social/accounts
export const getConnectedAccounts = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).id;
    if (!userId) return res.status(401).json({ message: "Unauthorized", success: false });

    const { platform, profileId } = req.query;

    const result: any = await zernio.accounts.listAccounts({
      ...(platform ? { platform: platform as string } : {}),
      ...(profileId ? { profileId: profileId as string } : {}),
    });

    const accounts = result?.accounts || result?.data?.accounts || (Array.isArray(result) ? result : []);
    return res.status(200).json({ success: true, accounts });
  } catch (error: any) {
    console.error("Error listing accounts:", error);
    return res.status(500).json({
      message: error.message || "Failed to list connected accounts",
      success: false,
    });
  }
};

// POST /social/profiles
export const createZernioProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).id;
    if (!userId) return res.status(401).json({ message: "Unauthorized", success: false });

    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Profile name is required", success: false });

    const result: any = await zernio.profiles.createProfile({
      name,
      ...(description ? { description } : {}),
    });

    return res.status(201).json({
      success: true,
      profile: result?.profile || result?.data?.profile || result,
    });
  } catch (error: any) {
    console.error("Error creating Zernio profile:", error);
    return res.status(500).json({
      message: error.message || "Failed to create profile",
      success: false,
    });
  }
};

// POST /social/publish
export const publishAd = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).id;
    if (!userId) return res.status(401).json({ message: "Unauthorized", success: false });

    const { adId, platforms, accountIds, scheduledTime, timezone, content } = req.body;

    if (!adId || !platforms || !Array.isArray(platforms) || platforms.length === 0) {
      return res.status(400).json({ message: "Ad ID and platforms are required", success: false });
    }

    const ad = await (prisma as any).ad.findFirst({
      where: { id: Number(adId), businessProfile: { userId } },
      include: { businessProfile: true },
    });

    if (!ad) return res.status(404).json({ message: "Ad not found", success: false });

    const postContent = content || ad.content;
    const imageUrl: string | undefined = ad.imageUrl || undefined;
    const isVideo: boolean = ad.isVideo || false;

    // Resolve Zernio account IDs
    const zernioAccountsMap = await getZernioAccountsMap();
    const zernioPlatforms: Array<{ platform: string; accountId: string }> = [];
    const missingPlatforms: string[] = [];

    for (const platform of platforms) {
      const key = String(platform).toLowerCase();
      const explicit = accountIds?.[key];
      const resolved = zernioAccountsMap.get(key);

      if (explicit) {
        // Prefer Zernio's canonical platform casing if we know it
        zernioPlatforms.push({ platform: resolved?.platform || platform, accountId: explicit });
      } else if (resolved) {
        zernioPlatforms.push({ platform: resolved.platform, accountId: resolved.accountId });
      } else {
        missingPlatforms.push(key);
      }
    }

    if (zernioPlatforms.length === 0) {
      return res.status(400).json({
        message: `No connected Zernio accounts found for: ${missingPlatforms.join(
          ", "
        )}. Connect them first via /social/connect-url.`,
        success: false,
      });
    }

    // Upload media if present
    let mediaItems: Array<{ url: string; type: string }> | undefined;
    if (imageUrl) {
      try {
        const publicUrl = await uploadMediaToZernio(imageUrl, isVideo);
        mediaItems = [{ url: publicUrl, type: isVideo ? "video" : "image" }];
      } catch (uploadErr: any) {
        console.warn("⚠️ Media upload to Zernio failed:", uploadErr.message);

        // Instagram/TikTok/Pinterest require media — block those platforms
        const mediaRequiredPlatforms = ["instagram", "tiktok", "pinterest"];
        const needsMedia = zernioPlatforms.some((p) =>
          mediaRequiredPlatforms.includes(String(p.platform).toLowerCase())
        );

        if (needsMedia) {
          return res.status(400).json({
            message: `Media upload failed and some selected platforms (Instagram, TikTok, Pinterest) require media. Error: ${uploadErr.message}`,
            success: false,
          });
        }
        // For text-friendly platforms (twitter, facebook, linkedin), continue without media
      }
    }

    // Build Zernio post payload (SDK expects { body: { ... } })
    const postBody: any = { content: postContent, platforms: zernioPlatforms };
    if (mediaItems) postBody.mediaItems = mediaItems;

    if (scheduledTime) {
      postBody.scheduledFor = new Date(scheduledTime).toISOString();
      postBody.timezone = timezone || "UTC";
    } else {
      postBody.publishNow = true;
    }

    console.log("📤 Zernio createPost payload:", JSON.stringify({ body: postBody }, null, 2));

    const zernioResult: any = await zernio.posts.createPost({ body: postBody });
    const zernioPost = zernioResult?.post || zernioResult?.data?.post || zernioResult;

    const postStatus = scheduledTime ? "SCHEDULED" : "PUBLISHED";

    // Save to local DB
    const dbRecords = await Promise.all(
      zernioPlatforms.map(async (pf) => {
        // Robust platform matching (case-insensitive)
        const platformResult = zernioPost?.platforms?.find(
          (zp: any) => String(zp.platform).toLowerCase() === String(pf.platform).toLowerCase()
        );

        const record = await (prisma as any).publishedPost.create({
          data: {
            adId: Number(adId),

            // Store platform like "Facebook"/"Instagram"/etc (matches frontend)
            platform: pf.platform,

            content: postContent,
            scheduledTime: scheduledTime ? new Date(scheduledTime) : null,
            status: postStatus,
            publishedAt: postStatus === "PUBLISHED" ? new Date() : null,

            // Zernio post id (used for analytics lookups)
            externalPostId: zernioPost?._id || null,
          },
        });

        return {
          ...record,
          zernioPostId: zernioPost?._id,
          platformPostUrl: platformResult?.platformPostUrl || null,
        };
      })
    );

    return res.status(201).json({
      success: true,
      message: `${postStatus === "SCHEDULED" ? "Scheduled" : "Published"} to ${
        zernioPlatforms.length
      } platform(s)${missingPlatforms.length > 0 ? `. Missing accounts for: ${missingPlatforms.join(", ")}` : ""}`,
      zernioPostId: zernioPost?._id,
      publishedPosts: dbRecords,
      missingPlatforms: missingPlatforms.length > 0 ? missingPlatforms : undefined,
    });
  } catch (error: any) {
    console.error("Error publishing ad:", error);
    const errorMessage = error?.response?.data?.error || error.message || "Internal server error";
    return res.status(500).json({ message: errorMessage, success: false });
  }
};

// GET /social/posts
export const getPublishedPosts = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).id;
    if (!userId) return res.status(401).json({ message: "Unauthorized", success: false });

    const posts = await (prisma as any).publishedPost.findMany({
      where: { ad: { businessProfile: { userId } } },
      include: { ad: { include: { businessProfile: true } } },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error("Error fetching published posts:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

// GET /social/analytics
// This is the ONLY endpoint your Analytics UI page should call.
export const getAnalyticsSummary = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).id;
    if (!userId) return res.status(401).json({ message: "Unauthorized", success: false });

    const { days = "30" } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days as string, 10));

    const posts: any[] = await (prisma as any).publishedPost.findMany({
      where: {
        ad: { businessProfile: { userId } },
        createdAt: { gte: daysAgo },
        externalPostId: { not: null },
      },
      include: { ad: { include: { businessProfile: true } } },
      orderBy: { createdAt: "desc" },
    });

    const CONCURRENCY = 8;
    const results: Array<{ post: any; zernio: any; error?: string }> = [];

    for (let i = 0; i < posts.length; i += CONCURRENCY) {
      const chunk = posts.slice(i, i + CONCURRENCY);
      const chunkRes = await Promise.all(
        chunk.map(async (post) => {
          try {
            const z: any = await zernio.analytics.getAnalytics({ postId: post.externalPostId });
            const data = z?.data ?? z;
            return { post, zernio: data };
          } catch (e: any) {
            return { post, zernio: null, error: e?.message || "analytics fetch failed" };
          }
        })
      );
      results.push(...chunkRes);
    }

    let totalImpressions = 0;
    let totalClicks = 0;
    let totalConversions = 0;

    const platformBreakdown: Record<string, { impressions: number; clicks: number; conversions: number; posts: number }> =
      {};

    const adPerformance = results.map(({ post, zernio }) => {
      const m = extractZernioMetrics(zernio);

      totalImpressions += m.impressions;
      totalClicks += m.clicks;
      totalConversions += m.conversions;

      const platformKey = post.platform;

      if (!platformBreakdown[platformKey]) {
        platformBreakdown[platformKey] = { impressions: 0, clicks: 0, conversions: 0, posts: 0 };
      }
      platformBreakdown[platformKey].posts += 1;
      platformBreakdown[platformKey].impressions += m.impressions;
      platformBreakdown[platformKey].clicks += m.clicks;
      platformBreakdown[platformKey].conversions += m.conversions;

      const ctr = m.impressions > 0 ? ((m.clicks / m.impressions) * 100).toFixed(2) : "0";

      return {
        postId: post.id,
        adId: post.adId,
        platform: platformKey,
        externalPostId: post.externalPostId,
        content: (post.content || "").substring(0, 100),
        businessName: post.ad?.businessProfile?.businessName || "Unknown",
        status: post.status,
        publishedAt: post.createdAt,
        impressions: m.impressions,
        clicks: m.clicks,
        conversions: m.conversions,
        ctr,
      };
    });

    // Build trendData for the chart (group by day)
    const trendMap = new Map<string, { date: string; impressions: number; clicks: number; conversions: number }>();

    for (const { post, zernio } of results) {
      const m = extractZernioMetrics(zernio);
      const d = new Date(post.createdAt);

      const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      if (!trendMap.has(key)) {
        trendMap.set(key, { date: label, impressions: 0, clicks: 0, conversions: 0 });
      }
      const row = trendMap.get(key)!;
      row.impressions += m.impressions;
      row.clicks += m.clicks;
      row.conversions += m.conversions;
    }

    const trendData = Array.from(trendMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => v);

    const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0";
    const conversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : "0";

    return res.status(200).json({
      success: true,
      summary: {
        totalPosts: posts.length,
        totalImpressions,
        totalClicks,
        totalConversions,
        ctr,
        conversionRate,
      },
      platformBreakdown,
      adPerformance,
      trendData,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

/**
 * OPTIONAL: Only keep this if you want per-post drill-down.
 * Your Analytics UI page does NOT need to call this.
 *
 * GET /social/zernio-analytics/:externalPostId
 */
export const getZernioPostAnalytics = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).id;
    if (!userId) return res.status(401).json({ message: "Unauthorized", success: false });

    const { externalPostId } = req.params as any;
    if (!externalPostId) {
      return res.status(400).json({ message: "externalPostId is required", success: false });
    }

    const result: any = await zernio.analytics.getAnalytics({ postId: externalPostId });
    return res.status(200).json({ success: true, analytics: result?.data ?? result });
  } catch (error: any) {
    const statusCode = error?.response?.status || 500;
    const errorMessage = error?.response?.data?.error || error.message || "Failed to fetch analytics";
    console.error("Error fetching Zernio post analytics:", errorMessage);
    return res.status(statusCode).json({ message: errorMessage, success: false });
  }
};