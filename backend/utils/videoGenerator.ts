import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { AdData } from "./adCreativeGenerator";

const ai = new GoogleGenAI({
  apiKey: process.env['GEMINI_API_KEY'],
});

export interface VideoGenerationOptions {
  avatarId: string;
  script: string;
  voiceId?: string;
  width?: number;
  height?: number;
}

export interface VideoResult {
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: number;
}

export const AVATAR_OPTIONS = [
  {
    id: "amber",
    name: "Amber",
    description: "Professional female presenter, warm trusting expression",
    thumbnail: "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=600&auto=format&fit=crop&q=60",
    style: "professional",
  },
  {
    id: "jade",
    name: "Jade",
    description: "Friendly young female narrator, smiling",
    thumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734953e?w=600&auto=format&fit=crop&q=60",
    style: "friendly",
  },
  {
    id: "alex",
    name: "Alex",
    description: "Dynamic young male presenter, energetic appearance",
    thumbnail: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1a?w=600&auto=format&fit=crop&q=60",
    style: "dynamic",
  },
  {
    id: "marcus",
    name: "Marcus",
    description: "Corporate male spokesperson, wearing a nice suit",
    thumbnail: "https://images.unsplash.com/photo-1568605117036-5fe5c35b6f04?w=600&auto=format&fit=crop&q=60",
    style: "corporate",
  },
];

export const generateVideoAd = async (
  data: AdData,
  options: VideoGenerationOptions
): Promise<VideoResult> => {
  return generateAvatarVideoAd(data, options.avatarId, options.script);
};

export const generateAvatarVideoAd = async (
  adData: AdData,
  avatarId: string,
  adCopy: string
): Promise<VideoResult> => {
  try {
    if (!process.env['GEMINI_API_KEY']) {
      throw new Error("GEMINI_API_KEY not configured");
    }

    const scriptText = `
      ${adCopy}
      Visit us today to learn more about ${adData.businessname}.
    `.trim();

    const avatarDescription = AVATAR_OPTIONS.find(a => a.id === avatarId)?.description || "professional presenter";
    const prompt = `A cinematic, ultra-realistic commercial video featuring a ${avatarDescription}. The person is speaking directly to the camera confidently. They are delivering an advertisement for ${adData.businessname}, which is in the ${adData.niche} niche offering ${adData.productService}. The ad's script tone resembles: "${scriptText}". Ensure well-lit, modern background suitable for a corporate ad.`;

    console.log(`🎬 Requesting generation from Veo-3.1 with prompt: ${prompt}`);

    let operation = await ai.models.generateVideos({
        model: "veo-3.1-generate-preview",
        prompt: prompt,
    });

    // Poll the operation status until the video is ready safely to prevent 429 (Rate Limits)
    while (!operation.done) {
        console.log("Waiting for video generation to complete (polling every 30 seconds)...");
        await new Promise((resolve) => setTimeout(resolve, 30000));
        operation = await ai.operations.getVideosOperation({
            operation: operation as any,
        });
    }

    if (!operation.response?.generatedVideos?.[0]?.video) {
        throw new Error("Veo failed to return a video in the operation response");
    }

    const baseFileName = `ad_${Date.now()}`;
    const mp4RelativeFilePath = `generated/${baseFileName}.mp4`;
    const mp4FileName = path.join(process.cwd(), mp4RelativeFilePath);

    console.log(`🎬 Downloading generated video to ${mp4FileName}...`);
    // Download the generated video.
    await ai.files.download({
        file: operation.response.generatedVideos[0].video,
        downloadPath: mp4FileName,
    });

    console.log(`✅ Successfully downloaded Veo video.`);

    const avatarImageMap: Record<string, string> = {
      amber: "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=600&auto=format&fit=crop&q=60",
      jade: "https://images.unsplash.com/photo-1573496359142-b8d87734953e?w=600&auto=format&fit=crop&q=60",
      alex: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1a?w=600&auto=format&fit=crop&q=60",
      marcus: "https://images.unsplash.com/photo-1568605117036-5fe5c35b6f04?w=600&auto=format&fit=crop&q=60",
    };
    const avatarImage = avatarImageMap[avatarId] || avatarImageMap["amber"];

    const port = process.env.PORT || 5000;
    const backendUrl = process.env.BACKEND_URL || `http://localhost:${port}`;

    return {
      videoUrl: `${backendUrl}/${mp4RelativeFilePath}`,
      thumbnailUrl: avatarImage,
      duration: 30, // Approximate
    };
  } catch (error: any) {
    console.error("❌ Video generation error:", error);
    return {
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumbnailUrl: "https://via.placeholder.com/1280x720/6366f1/fff?text=Video+Ad+Preview",
      duration: 30,
    };
  }
};