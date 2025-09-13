
import Bottleneck from "bottleneck";

// Free tier quotas (adjust if you move to paid later)
export const textLimiter = new Bottleneck({
  minTime: 4000, // 1 request every 4s ≈ 15 per minute
  maxConcurrent: 1,
});

export const imageLimiter = new Bottleneck({
  minTime: 60000, // 1 request per minute
  maxConcurrent: 1,
});
