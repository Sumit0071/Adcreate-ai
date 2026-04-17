import { GoogleGenAI, GenerateContentConfig } from "@google/genai";
import axios from "axios";
import FormData from "form-data";

export interface AdData {
  businessname: string;
  niche: string;
  productService: string;
  adGoal: string;
  targetAudience: string;
  contextImage?: string;
  specialInstructions?: string;
}

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  throw new Error("❌ Gemini API key is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: geminiApiKey });

const CONFIG = {
  maxRetries: 3,
  initialRetryDelayMs: 15_000,
  maxRetryDelayMs: 60_000,
  cooldownBetweenCallsMs: 3_000,
  textModel: "gemini-3-flash-preview",
  // ✅ Correct model name for Gemini image generation
  imageModel: "gemini-3.1-flash-image-preview",
};

const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

async function withRetry<T>(
  fn: () => Promise<T>,
  label: string = "API call",
  maxRetries: number = CONFIG.maxRetries
): Promise<T> {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (error: any) {
      const status = error.status || error.code;
      const isRetryable = status === 429 || status === 503;
      if (isRetryable && attempt < maxRetries - 1) {
        attempt++;
        const backoff = Math.min(
          CONFIG.initialRetryDelayMs * Math.pow(2, attempt - 1),
          CONFIG.maxRetryDelayMs
        );
        const serverRetryMs = error.retryDelay ? parseInt(error.retryDelay) * 1000 : null;
        const delayMs = serverRetryMs ? Math.max(serverRetryMs, backoff) : backoff;
        console.warn(`⚠️ [${label}] Rate limited (${status}). Retrying in ${Math.round(delayMs / 1000)}s...`);
        await wait(delayMs);
      } else {
        console.error(`❌ [${label}] Failed after ${attempt + 1} attempts:`, error.message || error);
        throw error;
      }
    }
  }
  throw new Error(`❌ [${label}] Exhausted all ${maxRetries} retries.`);
}

/**
 * Try generating image with Gemini 2.0 Flash Preview (image generation model).
 * Falls back to Stability AI if Gemini fails.
 */
export const generateAdImage = async (data: AdData): Promise<Buffer | null> => {
  const { businessname, niche, productService, adGoal, targetAudience, specialInstructions } = data;

  const imagePrompt = `Create a professional Facebook ad banner image for "${businessname}".
Niche: ${niche}. Product: ${productService}. Goal: ${adGoal}. Audience: ${targetAudience}.
${specialInstructions ? `Instructions: ${specialInstructions}` : ""}
Design: modern, vibrant colors, bold readable text showing business name "${businessname}", strong visual identity. Clean layout, 1200x628px Facebook ad format.`;

  // ── Attempt 1: Gemini image generation ────────────────────────────────
  try {
    console.log("🎨 Attempting Gemini image generation...");
    const imageResponse = await withRetry(
      () =>
        ai.models.generateContent({
          model: CONFIG.imageModel,
          contents: [{ role: "user", parts: [{ text: imagePrompt }] }],
          config: { responseModalities: ["IMAGE", "TEXT"] } as GenerateContentConfig,
        }),
      "Gemini Image Generation",
      2
    );

    const imageParts = imageResponse.candidates?.[0]?.content?.parts ?? [];
    for (const part of imageParts) {
      if (part.inlineData?.data) {
        const imageBuffer = Buffer.from(part.inlineData.data, "base64");
        console.log(`✅ Gemini image generated (${(imageBuffer.length / 1024).toFixed(0)} KB)`);
        return imageBuffer;
      }
    }
    console.warn("⚠️ Gemini returned no image data — trying Stability AI fallback...");
  } catch (err: any) {
    console.warn("⚠️ Gemini image generation failed:", err.message || err);
    console.log("🔄 Falling back to Stability AI...");
  }

  // ── Attempt 2: Stability AI fallback ──────────────────────────────────
  const stabilityKey = process.env.STABILITY_API_KEY;
  if (stabilityKey) {
    try {
      console.log("🎨 Attempting Stability AI image generation...");
      const formData = new FormData();
      formData.append("prompt", imagePrompt.substring(0, 2000));
      formData.append("output_format", "png");
      formData.append("aspect_ratio", "16:9");
      formData.append("style_preset", "digital-art");

      const stabilityRes = await axios.post(
        "https://api.stability.ai/v2beta/stable-image/generate/core",
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            Authorization: `Bearer ${stabilityKey}`,
            Accept: "image/*",
          },
          responseType: "arraybuffer",
          timeout: 60_000,
        }
      );

      const imageBuffer = Buffer.from(stabilityRes.data);
      console.log(`✅ Stability AI image generated (${(imageBuffer.length / 1024).toFixed(0)} KB)`);
      return imageBuffer;
    } catch (stabErr: any) {
      console.error("❌ Stability AI fallback also failed:", stabErr.message || stabErr);
    }
  } else {
    console.warn("⚠️ STABILITY_API_KEY not set — image generation skipped.");
  }

  return null;
};

export const generateAdsequence = async (data: AdData) => {
  const { businessname, niche, productService, adGoal, targetAudience, specialInstructions } = data;

  const textPrompt = `You are an expert Facebook ad copywriter. Write exactly 3 distinct ad copy options for "${businessname}".

Business Context:
- Niche: ${niche}
- Product/Service: ${productService}
- Goal: ${adGoal}
- Target Audience: ${targetAudience}
${specialInstructions ? `- Special Instructions: ${specialInstructions}` : ""}

For EACH of the 3 options use EXACTLY this format (no markdown, no asterisks):

Option 1:
Headline: [headline here]
Body Text: [body text here]
CTA: [call to action here]

Option 2:
Headline: [headline here]
Body Text: [body text here]
CTA: [call to action here]

Option 3:
Headline: [headline here]
Body Text: [body text here]
CTA: [call to action here]

Rules:
- Never use *, **, _, __, #, or markdown
- Keep headlines under 40 characters
- Body text 2-3 sentences max
- CTA is a short action phrase`;

  console.log("📝 Generating ad copy...");
  const textResponse = await withRetry(
    () =>
      ai.models.generateContent({
        model: CONFIG.textModel,
        contents: [{ role: "user", parts: [{ text: textPrompt }] }],
      }),
    "Text Generation"
  );

  let adCopy = "";
  const textParts = textResponse.candidates?.[0]?.content?.parts ?? [];
  for (const part of textParts) {
    if (part.text) adCopy += part.text + "\n";
  }
  adCopy = adCopy.trim();

  if (adCopy) {
    console.log("📢 Ad copy generated successfully.");
  } else {
    console.warn("⚠️ No ad copy generated.");
  }

  // Cooldown before image generation
  console.log(`⏳ Cooling down ${CONFIG.cooldownBetweenCallsMs / 1000}s before image generation...`);
  await wait(CONFIG.cooldownBetweenCallsMs);

  // Generate image
  console.log("🎨 Generating ad image...");
  const imageBuffer = await generateAdImage(data);

  // Parse ad copies - match "Option 1:", "Option 2:", "Option 3:" blocks
  let adCopies: string[] =
    adCopy.match(/Option\s*\d+:[\s\S]*?(?=Option\s*\d+:|$)/gi)?.map((s) => s.trim()) ?? [];

  // Fallback: split by double newlines
  if (adCopies.length === 0 && adCopy.trim()) {
    const blocks = adCopy.split(/\n\s*\n\s*\n+/).map((s) => s.trim()).filter(Boolean);
    adCopies = blocks.length >= 3 ? blocks.slice(0, 3) : blocks.length > 0 ? blocks : [adCopy];
  }

  // Ensure exactly 3 copies
  while (adCopies.length < 3) {
    adCopies.push(adCopies[0] || adCopy);
  }
  adCopies = adCopies.slice(0, 3);

  console.log(`✅ Generation complete: ${adCopies.length} ad copies, image: ${imageBuffer ? "yes" : "no"}`);

  return {
    adCopies,
    imageBase64: imageBuffer ? imageBuffer.toString("base64") : null,
  };
};