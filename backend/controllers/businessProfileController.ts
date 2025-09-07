import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { generateAdsequence, AdData } from "../utils/adCreativeGenerator";
import cloudinary from "../config/cloudinary";
import getDataUri from "../utils/dataUrl";
const prisma = new PrismaClient();

export const updateBusinessDetails = async ( req: Request, res: Response ) => {
    try {
        const { businessName, niche, productService, targetAudience, adGoal } = req.body;
        const { id } = req.params;

        const businessDetails = await prisma.businessProfile.update( {
            where: { id: Number( id ) },
            data: {
                businessName,
                niche,
                productService,
                targetAudience,
                adGoal
            }
        } );

        res.status( 200 ).json( {
            message: "Business details updated successfully",
            success: true,
            businessDetails
        } );
    }
    catch ( error ) {
        console.error( "Error updating business details:", error );
        res.status( 500 ).json( {
            error: "Internal server error",
            success: false
        } );
    }
}

export const generateAdsecquenceController = async ( req: Request, res: Response ): Promise<void> => {
    try {
        const userId = ( req as any ).id; // set from auth middleware
        if ( !userId ) {
            res.status( 401 ).json( { message: "Unauthorized", success: false } );
        }
        const { businessName, niche, productService, targetAudience, adGoal, specialInstructions } = req.body;

         let contextImage: string | undefined;
    if (req.file) {
      const fileUri = getDataUri(req.file);
      if (fileUri?.content) {
        const uploadResult = await cloudinary.uploader.upload(fileUri.content, {
          folder: "business-profiles",
        });
        contextImage = uploadResult.secure_url;
      }
    }
        // Step 1: Save business profile
        const businessProfile = await prisma.businessProfile.create( {
            data: {
                businessName,
                niche,
                productService,
                targetAudience,
                adGoal,
                userId,
            },
        } );

        // Step 2: Generate ad content
        const requiredData: AdData = { businessname: businessName, niche, productService, targetAudience, adGoal,specialInstructions, contextImage };
        const sequence = await generateAdsequence( requiredData );

        // Step 3: Save generated ads in DB
        const ads = await Promise.all(
            sequence.adCopies.map( ( content: string ) =>
                prisma.ad.create( {
                    data: {
                        content,
                        imageUrl: sequence.imageBase64
                            ? `data:image/png;base64,${sequence.imageBase64}`
                            : null,
                        businessProfileId: businessProfile.id,
                    },
                } )
            )
        );

        res.status( 201 ).json( {
            message: "Business profile created and ads generated successfully",
            success: true,
            businessProfile,
            ads,
        } );
    } catch ( error ) {
        console.error( "Error generating ad sequence:", error );
        res.status( 500 ).json( { message: "Internal server error", success: false } );
    }
};