import { Request, Response } from "express";
import prisma from "../config/prisma";
import Zernio from "@zernio/node";
import axios from "axios";

const zernio = new Zernio({ apiKey: process.env.ZERNIO_API_KEY });

// ─── Helper: upload media to Zernio via presigned URL ─────────────────────────

async function uploadMediaToZernio(mediaUrl: string, isVideo: boolean): Promise<string> {
  const urlPath = new URL(mediaUrl).pathname;
  const fileName = urlPath.split("/").pop() || (isVideo ? "video.mp4" : "image.jpg");
  const fileType = isVideo ? "video/mp4" : fileName.endsWith(".png") ? "image/png" : "image/jpeg";

  const presignResult: any = await zernio.media.getMediaPresignedUrl({ body: { filename: fileName, contentType: fileType } });
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

// ─── Helper: resolve platform names to Zernio account IDs ─────────────────────

async function getZernioAccountsMap(): Promise<Map<string, { accountId: string; platform: string }>> {
  const result: any = await zernio.accounts.listAccounts();
  // SDK may return { accounts }, { data: { accounts } }, or the array directly
  const accounts: any[] = result?.accounts || result?.data?.accounts || (Array.isArray(result) ? result : []);
  const map = new Map<string, { accountId: string; platform: string }>();
  for (const account of accounts) {
    const key = account.platform.toLowerCase();
    if (!map.has(key) && account.isActive) {
      map.set(key, { accountId: account._id, platform: account.platform });
    }
  }
  return map;
}

// ─── GET /social/connect-url ──────────────────────────────────────────────────

export const getConnectUrl = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).id;
    if (!userId) return res.status(401).json({ message: "Unauthorized", success: false });

    const { platform, profileId, redirectUrl } = req.query;
    if (!platform || !profileId) {
      return res.status(400).json({ message: "platform and profileId query params are required", success: false });
    }

    const result: any = await zernio.connect.getConnectUrl({
      platform: platform as string,
      profileId: profileId as string,
      ...(redirectUrl ? { redirectUrl: redirectUrl as string } : {}),
    });

    return res.status(200).json({ success: true, authUrl: result?.authUrl || result?.data?.authUrl });
  } catch (error: any) {
    console.error("Error getting connect URL:", error);
    return res.status(500).json({ message: error.message || "Failed to get connect URL", success: false });
  }
};

// ─── GET /social/accounts ─────────────────────────────────────────────────────

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
    return res.status(500).json({ message: error.message || "Failed to list connected accounts", success: false });
  }
};

// ─── POST /social/profiles ────────────────────────────────────────────────────

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

    return res.status(201).json({ success: true, profile: result?.profile || result?.data?.profile || result });
  } catch (error: any) {
    console.error("Error creating Zernio profile:", error);
    return res.status(500).json({ message: error.message || "Failed to create profile", success: false });
  }
};

// ─── POST /social/publish ─────────────────────────────────────────────────────

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
      const p = platform.toLowerCase();
      const explicit = accountIds?.[p];
      const resolved = zernioAccountsMap.get(p);

      if (explicit) {
        zernioPlatforms.push({ platform: p, accountId: explicit });
      } else if (resolved) {
        zernioPlatforms.push({ platform: resolved.platform, accountId: resolved.accountId });
      } else {
        missingPlatforms.push(p);
      }
    }

    if (zernioPlatforms.length === 0) {
      return res.status(400).json({
        message: `No connected Zernio accounts found for: ${missingPlatforms.join(", ")}. Connect them first via /social/connect-url.`,
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
        const needsMedia = zernioPlatforms.some((p) => mediaRequiredPlatforms.includes(p.platform.toLowerCase()));
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
        const platformResult = zernioPost?.platforms?.find((zp: any) => zp.platform === pf.platform);
        const record = await (prisma as any).publishedPost.create({
          data: {
            adId: Number(adId),
            platform: pf.platform.toUpperCase(),
            content: postContent,
            scheduledTime: scheduledTime ? new Date(scheduledTime) : null,
            status: postStatus,
            publishedAt: postStatus === "PUBLISHED" ? new Date() : null,
            externalPostId: zernioPost?._id || null,
          },
        });
        return { ...record, zernioPostId: zernioPost?._id, platformPostUrl: platformResult?.platformPostUrl || null };
      })
    );

    return res.status(201).json({
      success: true,
      message: `${postStatus === "SCHEDULED" ? "Scheduled" : "Published"} to ${zernioPlatforms.length} platform(s)${missingPlatforms.length > 0 ? `. Missing accounts for: ${missingPlatforms.join(", ")}` : ""}`,
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

// ─── GET /social/posts ────────────────────────────────────────────────────────

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

// ─── POST /social/track ──────────────────────────────────────────────────────

export const trackAnalyticsEvent = async (req: Request, res: Response) => {
  try {
    const { postId, eventType } = req.body;
    if (!postId || !eventType) return res.status(400).json({ message: "Post ID and event type required", success: false });

    const validEvents = ["IMPRESSION", "CLICK", "CONVERSION"];
    if (!validEvents.includes(eventType)) return res.status(400).json({ message: "Invalid event type", success: false });

    await (prisma as any).analyticsEvent.create({ data: { postId: Number(postId), eventType } });
    return res.status(201).json({ success: true, message: "Event tracked" });
  } catch (error) {
    console.error("Error tracking event:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

// ─── GET /social/analytics ───────────────────────────────────────────────────

export const getAnalyticsSummary = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).id;
    if (!userId) return res.status(401).json({ message: "Unauthorized", success: false });

    const { days = "30" } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days as string));

    const posts: any[] = await (prisma as any).publishedPost.findMany({
      where: { ad: { businessProfile: { userId } }, createdAt: { gte: daysAgo } },
      include: { ad: { include: { businessProfile: true } }, analytics: true },
    });

    const totalImpressions = posts.reduce((sum, post) => sum + post.analytics.filter((e: any) => e.eventType === "IMPRESSION").length, 0);
    const totalClicks = posts.reduce((sum, post) => sum + post.analytics.filter((e: any) => e.eventType === "CLICK").length, 0);
    const totalConversions = posts.reduce((sum, post) => sum + post.analytics.filter((e: any) => e.eventType === "CONVERSION").length, 0);

    const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0";
    const conversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : "0";

    const platformBreakdown: Record<string, any> = {};
    for (const post of posts) {
      if (!platformBreakdown[post.platform]) {
        platformBreakdown[post.platform] = { impressions: 0, clicks: 0, conversions: 0, posts: 0 };
      }
      platformBreakdown[post.platform].posts += 1;
      platformBreakdown[post.platform].impressions += post.analytics.filter((e: any) => e.eventType === "IMPRESSION").length;
      platformBreakdown[post.platform].clicks += post.analytics.filter((e: any) => e.eventType === "CLICK").length;
      platformBreakdown[post.platform].conversions += post.analytics.filter((e: any) => e.eventType === "CONVERSION").length;
    }

    const adPerformance = posts.map((post) => ({
      postId: post.id,
      adId: post.adId,
      platform: post.platform,
      externalPostId: post.externalPostId || null,
      content: post.content.substring(0, 100),
      businessName: post.ad?.businessProfile?.businessName || "Unknown",
      status: post.status,
      publishedAt: post.createdAt,
      impressions: post.analytics.filter((e: any) => e.eventType === "IMPRESSION").length,
      clicks: post.analytics.filter((e: any) => e.eventType === "CLICK").length,
      conversions: post.analytics.filter((e: any) => e.eventType === "CONVERSION").length,
      ctr: post.analytics.filter((e: any) => e.eventType === "IMPRESSION").length > 0
        ? ((post.analytics.filter((e: any) => e.eventType === "CLICK").length /
          post.analytics.filter((e: any) => e.eventType === "IMPRESSION").length) * 100).toFixed(2)
        : "0",
    }));

    // Zernio platform analytics (best effort — may require analytics add-on)
    let zernioAnalytics: any = null;
    try {
      const fromDate = daysAgo.toISOString().split("T")[0];
      const toDate = new Date().toISOString().split("T")[0];
      const zernioResult = await zernio.analytics.getAnalytics({ fromDate, toDate, limit: 50 });
      zernioAnalytics = zernioResult.data;
    } catch (zernioErr: any) {
      console.warn("Zernio analytics fetch failed:", zernioErr.message);
    }

    return res.status(200).json({
      success: true,
      summary: { totalPosts: posts.length, totalImpressions, totalClicks, totalConversions, ctr, conversionRate },
      platformBreakdown,
      adPerformance,
      zernioAnalytics,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

// ─── GET /social/zernio-analytics/:postId ─────────────────────────────────────

export const getZernioPostAnalytics = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).id;
    if (!userId) return res.status(401).json({ message: "Unauthorized", success: false });

    const { postId } = req.params;
    if (!postId) return res.status(400).json({ message: "Post ID is required", success: false });

    const result = await zernio.analytics.getAnalytics({ postId });
    return res.status(200).json({ success: true, analytics: result.data });
  } catch (error: any) {
    const statusCode = error?.response?.status || 500;
    const errorMessage = error?.response?.data?.error || error.message || "Failed to fetch analytics";
    console.error("Error fetching Zernio post analytics:", errorMessage);
    return res.status(statusCode).json({ message: errorMessage, success: false });
  }
};
