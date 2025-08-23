import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const prisma = new PrismaClient();

// Create an OAuth2 client with your Google client ID
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req: Request, res: Response): Promise<void> => {
    try {
        const { tokenId } = req.body; // Token from frontend (Google OAuth)
        if (!tokenId) {
            res.status(400).json({ message: "Google token is required", success: false });
            return;
        }

        // Verify token with Google
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            res.status(400).json({ message: "Invalid Google token", success: false });
            return;
        }

        const { email, name, picture, sub: googleId } = payload;

        // Check if user already exists
        let user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Create new user without password
            user = await prisma.user.create({
                data: {
                    username: name || email.split("@")[0],
                    email,
                    password: "", // No password for Google users
                    Avatar: picture || undefined,
                    googleId,
                    role: "USER",
                },
            });
        }

        // Generate JWT token
        const jwtToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

        // Set cookie
        res.cookie("token", jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3600000, // 1 hour
        });

        res.status(200).json({
            message: "Google authentication successful",
            success: true,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                Avatar: user.Avatar,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Error in googleAuth:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};
