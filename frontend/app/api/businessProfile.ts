import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { BusinessProfile } from "@/components/businessProfileCard";

// Create a new business profile
export const createBusinessProfile = async (data: BusinessProfile) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/v1/business/create`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating business profile:", error);
    throw error;
  }
};

// Update an existing business profile
export const updateBusinessProfile = async (id: number, data: any) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/v1/business/update/${id}`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating business profile:", error);
    throw error;
  }
};

// Get all business profiles of the logged-in user
export const getBusinessProfiles = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/api/v1/business/all`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching business profiles:", error);
    throw error;
  }
};

// Get a single business profile by ID
export const getBusinessProfileById = async (id: number) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/v1/business/${id}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching business profile:", error);
    throw error;
  }
};

// ================== AD GENERATION APIs ==================

// Get all ads for the logged-in user (paginated)
export const getUserAds = async (page: number = 1, take: number = 20) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/v1/business/ads?page=${page}&take=${take}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user ads:", error);
    throw error;
  }
};
//ad by id 
export const getUserAdById = async (adId: number) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/v1/business/ads/${adId}`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching ad:", error);
    throw error;
  }
};
// ================== AD GENERATION APIs ==================

// Generate image ads for a specific profile (data can be plain object or FormData for file upload)
export const generateAdsForProfile = async (profileId: number, data: any) => {
  try {
    const isFormData = data instanceof FormData;
    const config: { withCredentials: boolean; headers?: Record<string, string> } = {
      withCredentials: true,
    };
    if (!isFormData && typeof data === "object") {
      config.headers = { "Content-Type": "application/json" };
    }
    const response = await axios.post(
      `${API_URL}/api/v1/business/${profileId}/generate-ads`,
      data,
      config
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("❌ Server responded with:", error.response.data);
      console.error("📌 Status:", error.response.status);
      console.error("📌 Headers:", error.response.headers);
    } else if (error.request) {
      console.error("❌ No response received:", error.request);
    } else {
      console.error("❌ Error setting up request:", error.message);
    }
    throw error;
  }
};

// ================== VIDEO AD APIs ==================

export const getAvatarOptions = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/video/avatars`);
    return response.data;
  } catch (error) {
    console.error("Error fetching avatars:", error);
    throw error;
  }
};

export const generateVideoAdForProfile = async (
  profileId: number,
  avatarId: string,
  adCopyText?: string
) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/v1/video/${profileId}/generate-video`,
      { avatarId, adCopyText },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error generating video ad:", error);
    throw error;
  }
};

// ================== SOCIAL PUBLISHING APIs (Zernio-powered) ==================

/**
 * Publish or schedule an ad to multiple platforms via Zernio.
 * Platforms should be lowercase: "facebook", "instagram", "twitter", "linkedin", etc.
 */
export const publishAdToSocial = async (
  adId: number,
  platforms: string[],
  content?: string,
  scheduledTime?: string,
  accountIds?: Record<string, string>
) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/v1/social/publish`,
      { adId, platforms, content, scheduledTime, accountIds },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error publishing ad:", error);
    throw error;
  }
};

export const getPublishedPosts = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/social/posts`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching published posts:", error);
    throw error;
  }
};

export const getAnalyticsSummary = async (days: number = 30) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/v1/social/analytics?days=${days}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching analytics:", error);
    throw error;
  }
};

export const trackAnalyticsEvent = async (
  postId: number,
  eventType: "IMPRESSION" | "CLICK" | "CONVERSION"
) => {
  try {
    await axios.post(`${API_URL}/api/v1/social/track`, { postId, eventType });
  } catch (error) {
    // Silent fail for tracking
  }
};

// ── Zernio Account Management APIs ──────────────────────────────────────────

/**
 * Get a Zernio OAuth URL to connect a social account.
 */
export const getZernioConnectUrl = async (platform: string, profileId: string, redirectUrl?: string) => {
  try {
    const params = new URLSearchParams({ platform, profileId });
    if (redirectUrl) params.set("redirectUrl", redirectUrl);
    const response = await axios.get(
      `${API_URL}/api/v1/social/connect-url?${params.toString()}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting connect URL:", error);
    throw error;
  }
};

/**
 * List all connected Zernio social accounts.
 */
export const getConnectedAccounts = async (platform?: string) => {
  try {
    const params = platform ? `?platform=${platform}` : "";
    const response = await axios.get(
      `${API_URL}/api/v1/social/accounts${params}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching connected accounts:", error);
    throw error;
  }
};

/**
 * Create a Zernio profile (groups social accounts).
 */
export const createZernioProfile = async (name: string, description?: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/v1/social/profiles`,
      { name, description },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating Zernio profile:", error);
    throw error;
  }
};

/**
 * Fetch Zernio analytics for a specific post.
 */
export const getZernioPostAnalytics = async (postId: string) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/v1/social/zernio-analytics/${postId}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Zernio post analytics:", error);
    throw error;
  }
};
