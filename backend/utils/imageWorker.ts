import { Worker, Job } from "bullmq";
import prisma from "../config/prisma";
import { generateAdImage, AdData } from "./adCreativeGenerator";
import cloudinary from "../config/cloudinary";

const redisConnection = {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
};

export interface ImageJobData {
    adData: AdData;
    adIds: number[];
}

export const imageWorker = new Worker("image-generation", async (job: Job<ImageJobData>) => {
    const { adData, adIds } = job.data;

    try {
        console.log(`[Worker] Started processing job ${job.id} for adIds: ${adIds.join(", ")}`);

        // 1. Generate Image (uses free-tier friendly retry logic internally)
        const imageBuffer = await generateAdImage(adData);

        if (!imageBuffer) {
            console.warn(`[Worker] No image generated for job ${job.id}. Skipping upload.`);
            return { success: false, imageUrl: null, reason: "No image generated" };
        }

        // 2. Upload to Cloudinary
        const base64Image = `data:image/png;base64,${imageBuffer.toString("base64")}`;

        const uploadResult = await cloudinary.uploader.upload(base64Image, {
            folder: "ad-creatives",
        });

        const imageUrl = uploadResult.secure_url;
        console.log(`[Worker] Image uploaded successfully to ${imageUrl}`);

        // 3. Update DB with Cloudinary URL
        await prisma.ad.updateMany({
            where: {
                id: { in: adIds }
            },
            data: {
                imageUrl: imageUrl
            }
        });

        console.log(`[Worker] Updated DB for adIds: ${adIds.join(", ")}`);
        return { success: true, imageUrl };
    } catch (error) {
        console.error(`[Worker] Failed job ${job.id}:`, error);
        throw error;
    }
}, {
    connection: redisConnection,
    // Free-tier friendly: limit concurrency and add delay between jobs
    concurrency: 1,          // Process one job at a time (avoid parallel API calls)
    limiter: {
        max: 1,              // Max 1 job per interval
        duration: 10_000,    // 10 second interval between jobs
    },
});

imageWorker.on("completed", (job) => {
    console.log(`[Worker] Job ${job.id} completed successfully`);
});

imageWorker.on("failed", (job, err) => {
    console.error(`[Worker] Job ${job?.id} failed with error:`, err.message);
});
