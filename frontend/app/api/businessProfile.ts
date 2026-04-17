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

// ================== SOCIAL PUBLISHING APIs ==================

export const publishAdToSocial = async (
  adId: number,
  platforms: string[],
  content?: string,
  scheduledTime?: string
) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/v1/social/publish`,
      { adId, platforms, content, scheduledTime },
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
