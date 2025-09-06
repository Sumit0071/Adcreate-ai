import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const registerUser = async ( userData: Object ) => {
    const response = await axios.post( `${API_URL}/api/v1/register`, userData, {
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true,
    } );
    return response.data;
}

export const loginUser = async ( credentials: Object ) => {
    const response = await axios.post( `${API_URL}/api/v1/login`, credentials, {
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true,
    } );
    return response.data;
}

export const getUserProfile = async () => {
    const response = await axios.get( `${API_URL}/api/v1/profile`, {
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true,
    } );
    return response.data;
}


export const googleLogin = async ( tokenId: string ) => {
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
