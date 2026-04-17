import { Request, Response } from "express";
import prisma from "../config/prisma";
import axios from "axios";

// ─── Facebook / Instagram Graph API helpers ───────────────────────────────────

const FB_GRAPH = "https://graph.facebook.com/v19.0";
const PAGE_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN || "";
const FB_PAGE_ID = process.env.FACEBOOK_PAGE_ID || "";
const IG_ACCOUNT_ID = process.env.INSTAGRAM_ACCOUNT_ID || "";

/**
 * Post a text + optional image to a Facebook Page via Graph API.
 * Returns { success, postId?, error? }
 */
async function postToFacebook(message: string, imageUrl?: string, isVideo?: boolean): Promise<{ success: boolean; postId?: string; error?: string }> {
  if (!PAGE_ACCESS_TOKEN || !FB_PAGE_ID) {
    return { success: false, error: "FACEBOOK_PAGE_ID or FACEBOOK_ACCESS_TOKEN not set in env" };
  }
  try {
    let endpoint: string;
    let payload: Record<string, string>;

    if (imageUrl) {
      if (isVideo) {
        // Video post
        endpoint = `${FB_GRAPH}/${FB_PAGE_ID}/videos`;
        payload = { file_url: imageUrl, description: message, access_token: PAGE_ACCESS_TOKEN };
      } else {
        // Photo post
        endpoint = `${FB_GRAPH}/${FB_PAGE_ID}/photos`;
        payload = { url: imageUrl, caption: message, access_token: PAGE_ACCESS_TOKEN };
      }
    } else {
      // Text-only post
      endpoint = `${FB_GRAPH}/${FB_PAGE_ID}/feed`;
      payload = { message, access_token: PAGE_ACCESS_TOKEN };
    }

    const res = await axios.post(endpoint, payload);
    const postId = res.data?.id || res.data?.post_id;
    console.log(`✅ Facebook post created: ${postId}`);
    return { success: true, postId };
  } catch (err: any) {
    const fbError = err.response?.data?.error?.message || err.message;
    console.error("❌ Facebook post failed:", fbError);
    return { success: false, error: fbError };
  }
}

/**
 * Publish an image post to an Instagram Business Account via Graph API.
 * Requires an image URL (Instagram API doesn't accept text-only posts).
 * Returns { success, mediaId?, error? }
 */
async function postToInstagram(caption: string, imageUrl?: string, isVideo?: boolean): Promise<{ success: boolean; mediaId?: string; error?: string }> {
  if (!PAGE_ACCESS_TOKEN || !IG_ACCOUNT_ID) {
    return { success: false, error: "INSTAGRAM_ACCOUNT_ID or FACEBOOK_ACCESS_TOKEN not set in env" };
  }
  if (!imageUrl) {
    return { success: false, error: "Instagram requires an image/video URL. Text-only posts are not supported." };
  }
  try {
    // Step 1: Create media container
    const payload: any = {
      caption,
      access_token: PAGE_ACCESS_TOKEN,
    };
    if (isVideo) {
      payload.video_url = imageUrl;
      payload.media_type = 'VIDEO';
    } else {
      payload.image_url = imageUrl;
    }
    const containerRes = await axios.post(`${FB_GRAPH}/${IG_ACCOUNT_ID}/media`, payload);
    const containerId = containerRes.data?.id;
    if (!containerId) throw new Error("No container ID returned from Instagram");

    // Step 2: Publish the container
    const publishRes = await axios.post(`${FB_GRAPH}/${IG_ACCOUNT_ID}/media_publish`, {
      creation_id: containerId,
      access_token: PAGE_ACCESS_TOKEN,
    });
    const mediaId = publishRes.data?.id;
    console.log(`✅ Instagram post published: ${mediaId}`);
    return { success: true, mediaId };
  } catch (err: any) {
    const igError = err.response?.data?.error?.message || err.message;
    console.error("❌ Instagram post failed:", igError);
    return { success: false, error: igError };
  }
}

/**
 * LinkedIn posting requires OAuth per user (user-level access token).
 * This placeholder returns instructions — full OAuth would be a separate flow.
 */
async function postToLinkedIn(_message: string): Promise<{ success: boolean; error?: string }> {
  return { success: false, error: "LinkedIn posting requires user OAuth — not yet configured. Add LINKEDIN_ACCESS_TOKEN to enable." };
}

/**
 * Twitter/X posting requires OAuth 2.0 + user context.
 * Placeholder until TWITTER_BEARER_TOKEN is configured.
 */
async function postToTwitter(_message: string): Promise<{ success: boolean; error?: string }> {
  return { success: false, error: "Twitter/X posting requires OAuth 2.0 user context — not yet configured. Add TWITTER_ACCESS_TOKEN to enable." };
}

// ─── Main platform dispatcher ─────────────────────────────────────────────────

async function publishToPlatform(
  platform: string,
  message: string,
  imageUrl?: string,
  isVideo?: boolean
): Promise<{ success: boolean; externalId?: string; error?: string }> {
  const p = platform.toUpperCase();
  if (p === "FACEBOOK") {
    const r = await postToFacebook(message, imageUrl, isVideo);
    return { success: r.success, externalId: r.postId, error: r.error };
  }
  if (p === "INSTAGRAM") {
    const r = await postToInstagram(message, imageUrl, isVideo);
    return { success: r.success, externalId: r.mediaId, error: r.error };
  }
  if (p === "LINKEDIN") {
    const r = await postToLinkedIn(message);
    return { success: r.success, error: r.error };
  }
  if (p === "TWITTER" || p === "X") {
    const r = await postToTwitter(message);
    return { success: r.success, error: r.error };
  }
  return { success: false, error: `Unknown platform: ${platform}` };
}

// ─── Controllers ──────────────────────────────────────────────────────────────

export const publishAd = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).id;
    if (!userId) return res.status(401).json({ message: "Unauthorized", success: false });

    const { adId, platforms, scheduledTime, content } = req.body;

    if (!adId || !platforms || !Array.isArray(platforms) || platforms.length === 0) {
      return res.status(400).json({ message: "Ad ID and platforms are required", success: false });
    }

    // Verify the ad belongs to the user
    const ad = await (prisma as any).ad.findFirst({
      where: { id: Number(adId), businessProfile: { userId } },
      include: { businessProfile: true },
    });

    if (!ad) return res.status(404).json({ message: "Ad not found", success: false });

    const postContent = content || ad.content;
    const imageUrl: string | undefined = ad.imageUrl || undefined;
    const isVideo: boolean = ad.isVideo || false;

    // For each platform: publish now OR schedule
    const results = await Promise.all(
      platforms.map(async (platform: string) => {
        let externalId: string | null = null;
        let status = "PUBLISHED";
        let publishError: string | null = null;

        if (!scheduledTime) {
          // Publish immediately to the real platform
          const result = await publishToPlatform(platform, postContent, imageUrl, isVideo);
          externalId = result.externalId || null;
          publishError = result.error || null;
          status = result.success ? "PUBLISHED" : "FAILED";
          if (!result.success) {
            console.warn(`⚠️ ${platform} publish failed: ${result.error}`);
          }
        } else {
          status = "SCHEDULED";
        }

        const record = await (prisma as any).publishedPost.create({
          data: {
            adId: Number(adId),
            platform,
            content: postContent,
            scheduledTime: scheduledTime ? new Date(scheduledTime) : null,
            status,
            publishedAt: status === "PUBLISHED" ? new Date() : null,
            externalPostId: externalId,
          },
        });

        return { ...record, publishError };
      })
    );

    const succeeded = results.filter((r: any) => r.status === "PUBLISHED" || r.status === "SCHEDULED");
    const failed = results.filter((r: any) => r.status === "FAILED");

    return res.status(201).json({
      success: true,
      message: `Published to ${succeeded.length} platform(s)${failed.length > 0 ? `, failed on ${failed.length} platform(s)` : ""}`,
      publishedPosts: results,
      errors: failed.map((f: any) => ({ platform: f.platform, error: f.publishError })),
    });
  } catch (error: any) {
    console.error("Error publishing ad:", error);
    return res.status(500).json({ message: error.message || "Internal server error", success: false });
  }
};

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

    return res.status(200).json({
      success: true,
      summary: { totalPosts: posts.length, totalImpressions, totalClicks, totalConversions, ctr, conversionRate },
      platformBreakdown,
      adPerformance,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};
