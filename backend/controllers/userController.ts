import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/dataUrl";
import cloudinary from "../config/cloudinary";


// Initialize Prisma Client
const prisma = new PrismaClient();

// register user function
export const registerUser = async ( req: Request, res: Response ): Promise<void> => {
    try {
        const { username, password, email, role, Avatar } = req.body;
        const file = req.file;

        const fileUri = getDataUri( file );

        if ( !fileUri || !fileUri.content ) {
            res.status( 400 ).json( {
                message: "Invalid or missing file for avatar upload",
                success: false,
            } );
            return;
        }

        const cloudResponse = await cloudinary.uploader.upload( fileUri.content as string );

        // Check if user already exists
        const existingUser = await prisma.user.findUnique( {
            where: { email },
        } );

        if ( existingUser ) {
            res.status( 409 ).json( {
                message: "User with this email already exists",
                success: false,
            } );
            return;
        }

        // Hash the password
        const saltRounds = process.env.SALT ? parseInt( process.env.SALT ) : 10;
        const hashedPassword = await bcryptjs.hash( password, saltRounds );

        // Create the new user
        const newUser = await prisma.user.create( {
            data: {
                username,
                email,
                password: hashedPassword,
                role: role && role === "ADMIN" ? "ADMIN" : "USER",// Default role is 'user'
                Avatar: Avatar ? Avatar : cloudResponse.secure_url, // Optional field
            },
        } );

        // Generate JWT token
        const token = jwt.sign( { id: newUser.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' } );

        res.cookie( 'token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set to true in production
            maxAge: 3600000, // 1 hour
            sameSite: 'strict', // Helps prevent CSRF attacks           
        } )
        res.status( 201 ).json( {
            message: "User registered successfully",
            success: true,
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
                Avatar: newUser.Avatar,
            }
        } );
    } catch ( error ) {
        console.error( "Error in registerUser:", error );
        res.status( 500 ).json( {
            message: "Internal server error",
            success: false,
        } );
    }
};

// login user function
export const loginUser = async ( req: Request, res: Response ): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await prisma.user.findUnique( {
            where: { email },
        } );

        if ( !user ) {
            res.status( 401 ).json( {
                message: "Invalid credentials",
                success: false,
            } );
            return;
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcryptjs.compare( password, user.password );

        if ( !isPasswordValid ) {
            res.status( 401 ).json( {
                message: "Invalid credentials",
                success: false,
            } );
            return;
        }

        // Generate JWT token
        const token = jwt.sign( { id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' } );

        // Set the token as a secure, HttpOnly cookie
        res.cookie( 'token', token, {
            httpOnly: true, // Prevents client-side JS from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Ensures cookie is only sent over HTTPS
            sameSite: 'strict', // Helps protect against CSRF attacks
            maxAge: 3600000, // 1 hour expiration in milliseconds
        } );
        res.status( 200 ).json( {
            message: "User logged in successfully",
            success: true,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                Avatar: user.Avatar,
            },
        } );
    } catch ( error ) {
        console.error( "Error in loginUser:", error );
        res.status( 500 ).json( {
            message: "Internal server error",
            success: false,
        } );
    }
};

// get user profile function
export const getUserProfile = async ( req: Request, res: Response ): Promise<void> => {
    try {
        // req.id is set by the authMiddleware
        const userId = ( req as any ).id;

        const user = await prisma.user.findUnique( {
            where: { id: parseInt( userId ) },
            select: {
                id: true,
                username: true,
                email: true,
                Avatar: true,
                role: true,
                createdAt: true,
            },
        } );

        if ( !user ) {
            res.status( 404 ).json( {
                message: "User not found",
                success: false,
            } );
            return;
        }

        res.status( 200 ).json( {
            message: "User profile fetched successfully",
            success: true,
            user,
        } );
    } catch ( error ) {
        console.error( "Error in getUserProfile:", error );
        res.status( 500 ).json( {
            message: "Internal server error",
            success: false,
        } );
    }
};

// update user profile function
export const updateUserProfile = async ( req: Request, res: Response ): Promise<void> => {
    try {
        const userId = ( req as any ).id;
        const { username, email, password } = req.body;
        let updateData: any = { username, email };

        // Hash new password if provided
        if ( password ) {
            const saltRounds = 10;
            const hashedPassword = await bcryptjs.hash( password, saltRounds );
            updateData.password = hashedPassword;
        }

        const updatedUser = await prisma.user.update( {
            where: { id: parseInt( userId ) },
            data: updateData,
            select: {
                id: true,
                username: true,
                email: true,
                Avatar: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        } );

        res.status( 200 ).json( {
            message: "User profile updated successfully",
            success: true,
            user: updatedUser,
        } );
    } catch ( error ) {
        console.error( "Error in updateUserProfile:", error );
        res.status( 500 ).json( {
            message: "Internal server error",
            success: false,
        } );
    }
};