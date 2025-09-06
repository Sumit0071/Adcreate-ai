    import axios from "axios";
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    export const generateAd = async (data: any) => {
        try {
            const response = await axios.post(`${API_URL}/generateAd`, data, { withCredentials: true });
            return response.data;
        } catch (error) {
            console.error("Error generating ad:", error);
            throw error;
        }
    }
