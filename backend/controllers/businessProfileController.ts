import { Request, Response } from "express";
import prisma from "../config/prisma";
import { generateAdsequence, AdData } from "../utils/adCreativeGenerator";
import { predictCTR } from "../utils/ctrPredictor";
import cloudinary from "../config/cloudinary";
import getDataUri from "../utils/dataUrl";
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

export const updateBusinessDetails = async (req: Request, res: Response) => {
  try {
    const { businessName, niche, productService, targetAudience, adGoal } = req.body;
    const { id } = req.params;

    const businessDetails = await prisma.businessProfile.update({
      where: { id: Number(id) },
      data: {
        businessName,
        niche,
        productService,
        targetAudience,
        adGoal
      }
    });

    res.status(200).json({
      message: "Business details updated successfully",
      success: true,
      businessDetails
    });
  }
  catch (error) {
    console.error("Error updating business details:", error);
    res.status(500).json({
      error: "Internal server error",
      success: false
    });
  }
}

export const getBusinessProfiles = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }
    const profiles = await prisma.businessProfile.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        businessName: true,
        niche: true,
        productService: true,
        targetAudience: true,
        adGoal: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { ads: true } },
      },
    });
    return res.status(200).json({ success: true, businessProfiles: profiles });
  } catch (error) {
    console.error("Error fetching business profiles:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const getUserAds = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const take = Math.min(50, Math.max(1, parseInt(req.query.take as string) || 20));
    const skip = (page - 1) * take;

    const [ads, totalCount] = await Promise.all([
      prisma.ad.findMany({
        where: { businessProfile: { userId } },
        orderBy: { generatedAt: "desc" },
        skip,
        take,
        select: {
          id: true,
          imageUrl: true,
          isVideo: true,
          generatedAt: true,
          businessProfile: {
            select: { id: true, businessName: true },
          },
          _count: { select: { publishedPosts: true } },
        },
      }),
      prisma.ad.count({ where: { businessProfile: { userId } } }),
    ]);

    return res.status(200).json({
      success: true,
      ads,
      pagination: { page, take, totalCount, totalPages: Math.ceil(totalCount / take) },
    });
  } catch (error) {
    console.error("Error fetching user ads:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const getBusinessProfileById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }
    const { id } = req.params;
    const businessProfile = await prisma.businessProfile.findFirst({
      where: { id: Number(id), userId },
    });
    if (!businessProfile) {
      return res.status(404).json({ message: "Business profile not found", success: false });
    }
    return res.status(200).json({ success: true, businessProfile });
  } catch (error) {
    console.error("Error fetching business profile:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const deleteBusinessProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedProfile = await prisma.businessProfile.delete({
      where: { id: Number(id) }
    });
    res.status(200).json({
      message: "Business profile deleted successfully",
      success: true,
      deletedProfile
    });
  }
  catch (error) {
    console.error("Error deleting business profile:", error);
    res.status(500).json({
      error: "Internal server error",
      success: false
    });
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

    // Upload generated image to Cloudinary (if available) instead of storing base64 in DB
    let imageUrl: string | null = null;
    if (sequence.imageBase64) {
      try {
        const base64DataUri = `data:image/png;base64,${sequence.imageBase64}`;
        const uploadResult = await cloudinary.uploader.upload(base64DataUri, {
          folder: "ad-creatives",
        });
        imageUrl = uploadResult.secure_url;
        console.log(`✅ Ad image uploaded to Cloudinary: ${imageUrl}`);
      } catch (uploadError) {
        console.error("⚠️ Failed to upload image to Cloudinary:", uploadError);
        // Fallback: still proceed without image rather than failing the entire request
      }
    }

    const createdAds = await Promise.all(
      sequence.adCopies.map((content: string) =>
        prisma.ad.create({
          data: {
            content,
            imageUrl,
            businessProfileId: businessProfile.id,
          },
        })
      )
    );

    // Inject CTR into the response (not saved to DB)
    const adsWithCtr = createdAds.map((ad: any) => {
      const ctr = predictCTR({
        niche: businessProfile.niche,
        adGoal: businessProfile.adGoal,
        headline: ad.content.substring(0, 50) // Mock headline extract
      });
      return { ...ad, ctr };
    });

    res.status(201).json({
      message: "Ads generated successfully",
      success: true,
      ads: adsWithCtr,
    });
  } catch (error) {
    console.error("Error generating ad sequence:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const generateCampaignBrief = async (req: Request, res: Response) => {
  try {
    const { generateStudioCampaignAds } = require("../utils/campaignStudioGenerator");
    const brief = req.body;
    const ads = await generateStudioCampaignAds(brief);
    res.status(200).json({
      success: true,
      ads,
    });
  } catch (error) {
    console.error("Error in generateCampaignBrief:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};


