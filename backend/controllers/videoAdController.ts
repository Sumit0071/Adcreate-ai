import { Request, Response } from "express";
import prisma from "../config/prisma";
import { generateAvatarVideoAd, AVATAR_OPTIONS, VideoResult } from "../utils/videoGenerator";
import { AdData } from "../utils/adCreativeGenerator";
import cloudinary from "../config/cloudinary";

export const getAvatarOptions = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      avatars: AVATAR_OPTIONS,
    });
  } catch (error) {
    console.error("Error fetching avatars:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const generateVideoAd = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    const { profileId } = req.params;
    const { avatarId, adCopyText } = req.body;

    if (!avatarId) {
      return res.status(400).json({ message: "Avatar ID is required", success: false });
    }

    // Fetch the business profile
    const businessProfile = await prisma.businessProfile.findFirst({
      where: { id: Number(profileId), userId },
    });

    if (!businessProfile) {
      return res.status(404).json({ message: "Business profile not found", success: false });
    }

    const adData: AdData = {
      businessname: businessProfile.businessName,
      niche: businessProfile.niche,
      productService: businessProfile.productService,
      targetAudience: businessProfile.targetAudience,
      adGoal: businessProfile.adGoal,
    };

    const scriptText = adCopyText || `
      Discover ${businessProfile.businessName}. 
      We offer ${businessProfile.productService} for ${businessProfile.targetAudience}.
      Our goal: ${businessProfile.adGoal}. 
      Visit us today!
    `.trim();

    console.log(`🎬 Generating video ad for profile ${profileId} with avatar ${avatarId}...`);
    const videoResult: VideoResult = await generateAvatarVideoAd(adData, avatarId, scriptText);

    // Save video ad record to the Ad model with a special marker
    const videoAd = await prisma.ad.create({
      data: {
        content: `[VIDEO] ${scriptText}`,
        imageUrl: videoResult.videoUrl, // storing video URL in imageUrl field for now
        isVideo: true,
        businessProfileId: businessProfile.id,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Video ad generated successfully",
      videoAd: {
        ...videoAd,
        videoUrl: videoResult.videoUrl,
        thumbnailUrl: videoResult.thumbnailUrl,
        duration: videoResult.duration,
        avatarId,
        isVideo: true,
      },
    });
  } catch (error: any) {
    console.error("Error generating video ad:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
    });
  }
};
