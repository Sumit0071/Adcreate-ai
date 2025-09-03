import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

interface AdData {
  businessname: string;
  niche: string;
  productService: string;
  adGoal: string;
  targetAudience: string;
}

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  throw new Error(" Gemini API key is not set in environment variables.");
}


const ai = new GoogleGenAI({ apiKey: geminiApiKey });

export const generateAdsecquence = async (data: AdData) => {
  try {
    const { businessname, niche, productService, adGoal, targetAudience } = data;

    const prompt = `Generate a compelling Facebook ad for the business "${businessname}".
    Niche: ${niche}
    Product/Service: ${productService}
    Goal: ${adGoal}
    Target Audience: ${targetAudience}.
    
    Write it in an engaging and persuasive style.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    // ✅ safer parsing
    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.text) {
        console.log("Generated Ad:\n", part.text);
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;
        if (typeof imageData !== "string" || imageData.length === 0) {
          console.warn("Skipped inline image: no valid base64 string present");
        } else {
          const buffer = Buffer.from(imageData, "base64");
          fs.writeFileSync("gemini-native-image.png", buffer);
          console.log("Image saved as gemini-native-image.png");
        }
      }
    }
  } catch (error) {
    console.error(" Error generating ad sequence:", error);
  }
};
