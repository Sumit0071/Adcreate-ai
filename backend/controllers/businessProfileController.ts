import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { generateAdsequence, AdData } from "../utils/adCreativeGenerator";
import cloudinary from "../config/cloudinary";
import getDataUri from "../utils/dataUrl";
const prisma = new PrismaClient();

export const createBusinessProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    const { businessName, niche, productService, targetAudience, adGoal } = req.body;

    // Prevent duplicates
    const duplicateProfile = await prisma.businessProfile.findFirst({
      where: { userId, businessName, niche, productService, targetAudience, adGoal }
    });

    if (duplicateProfile) {
      return res.status(400).json({
        message: "Business profile with the same details already exists.",
        success: false,
      });
    }

    const businessProfile = await prisma.businessProfile.create({
      data: { businessName, niche, productService, targetAudience, adGoal, userId },
    });

    res.status(201).json({
      message: "Business profile created successfully",
      success: true,
      businessProfile,
    });
  } catch (error) {
    console.error("Error creating business profile:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

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

export const deleteBusinessProfile = async ( req: Request, res: Response ) => {
    try {
        const { id } = req.params;
        const deletedProfile = await prisma.businessProfile.delete( {
            where: { id: Number( id ) }
        } );
        res.status( 200 ).json( {
            message: "Business profile deleted successfully",
            success: true,
            deletedProfile
        } );
    }
    catch ( error ) {
        console.error( "Error deleting business profile:", error );
        res.status( 500 ).json( {
            error: "Internal server error",
            success: false
        } );
    }
}


export const generateAdSequence = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).id;
    const { profileId } = req.params;
    const { specialInstructions } = req.body;

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

    const businessProfile = await prisma.businessProfile.findFirst({
      where: { id: Number(profileId), userId },
    });

    if (!businessProfile) {
      return res.status(404).json({ message: "Business profile not found", success: false });
    }

    // Generate ads
    const requiredData: AdData = {
      businessname: businessProfile.businessName,
      niche: businessProfile.niche,
      productService: businessProfile.productService,
      targetAudience: businessProfile.targetAudience,
      adGoal: businessProfile.adGoal,
      specialInstructions,
      contextImage,
    };

    const sequence = await generateAdsequence(requiredData);

    const ads = await Promise.all(
      sequence.adCopies.map((content: string) =>
        prisma.ad.create({
          data: {
            content,
            imageUrl: sequence.imageBase64 ? `data:image/png;base64,${sequence.imageBase64}` : null,
            businessProfileId: businessProfile.id,
          },
        })
      )
    );

    res.status(201).json({
      message: "Ads generated successfully",
      success: true,
      ads,
    });
  } catch (error) {
    console.error("Error generating ad sequence:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

