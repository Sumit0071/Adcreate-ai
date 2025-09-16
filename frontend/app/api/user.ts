import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const registerUser = async (userData: object) => {
  const response = await axios.post(`${API_URL}/api/v1/register`, userData, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
  return response.data;
};

export const loginUser = async (credentials: object) => {
  const response = await axios.post(`${API_URL}/api/v1/login`, credentials, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
  return response.data;
};

export const getUserProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/profile`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching user profile:", error.response?.data || error.message);
    throw error;
  }
};

export const googleLogin = async (tokenId: string) => {
  const response = await axios.post(
    `${API_URL}/api/v1/auth/google`,
    { tokenId },
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
  return response.data;
};

export const logOut = async () => {
  const response = await axios.post(`${API_URL}/api/v1/logout`, {}, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true, // ✅ Fixed here
  });
  return response.data;
};
