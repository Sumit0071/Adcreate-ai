import { Queue } from "bullmq";

const redisConnection = {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
};

export const imageQueue = new Queue("image-generation", { connection: redisConnection });
