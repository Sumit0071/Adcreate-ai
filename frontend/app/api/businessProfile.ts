import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;


// Create a new business profile
export const createBusinessProfile = async (data: any) => {
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

// Generate ads for a specific profile
export const generateAdsForProfile = async (profileId: number, data: any) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/v1/business/${profileId}/generate-ads`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error generating ads:", error);
    throw error;
  }
};
