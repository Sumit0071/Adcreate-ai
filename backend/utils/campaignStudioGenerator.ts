import { GoogleGenAI } from "@google/genai";

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  throw new Error("❌ Gemini API key is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: geminiApiKey });

export interface CampaignBriefData {
  businessName: string;
  industry: string;
  productService: string;
  targetAudience: string;
  location: string;
  offer: string;
  painPoint: string;
  desire: string;
  campaignGoal: string;
  tone: string;
  cta: string;
}

export interface FrameworkAdResponse {
  framework: string;
  frameworkLabel: string;
  angle: string;
  headline: string;
  body: string;
  cta: string;
}

export async function generateStudioCampaignAds(brief: CampaignBriefData): Promise<FrameworkAdResponse[]> {
  const prompt = `You are a world-class conversion copywriter and marketing strategist.
Your task is to generate 7 distinct ad copy variations using different marketing frameworks based on the following campaign brief:

Business Name: ${brief.businessName}
Industry: ${brief.industry}
Product/Service: ${brief.productService}
Target Audience: ${brief.targetAudience}
Location: ${brief.location}
Offer: ${brief.offer}
Pain Point: ${brief.painPoint}
Desire/Aspiration: ${brief.desire}
Campaign Goal: ${brief.campaignGoal}
Tone: ${brief.tone}
CTA: ${brief.cta}

Generate exactly 7 variations corresponding to these frameworks:
1. Framework: AIDA
   Framework Label: Attention → Interest → Desire → Action
   Angle: Problem-Solution
2. Framework: PAS
   Framework Label: Problem → Agitation → Solution
   Angle: Emotional Pain-Point
3. Framework: BAB
   Framework Label: Before → After → Bridge
   Angle: Transformation Story
4. Framework: OFFER
   Framework Label: Offer-Driven Direct Response
   Angle: Offer-Based
5. Framework: URGENCY
   Framework Label: Urgency & Scarcity Driven
   Angle: Urgency / FOMO
6. Framework: TRUST
   Framework Label: Social Proof & Credibility
   Angle: Trust / Social Proof
7. Framework: EMOTIONAL
   Framework Label: Emotional Connection
   Angle: Emotional / Aspirational

Rules:
- Never use markdown formatting (no asterisks, no hashes, no bold markers like **).
- Keep headlines under 50 characters, punchy, and engaging.
- Ensure the CTA matches the CTA in the brief or is closely related.
- Return the output strictly as a JSON array of objects matching the schema below. Do not include any explanation, intro, or wrapping markdown block.

JSON Schema:
[
  {
    "framework": "AIDA",
    "frameworkLabel": "Attention → Interest → Desire → Action",
    "angle": "Problem-Solution",
    "headline": "Headline text",
    "body": "Body copy with [Attention], [Interest], [Desire], [Action] labels",
    "cta": "CTA text"
  },
  ...
]`;

  try {
    console.log("🤖 Requesting Gemini for framework ads...");
    // Use gemini-2.5-flash or gemini-1.5-flash as the fallback/standard model
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error("Empty response received from Gemini API");
    }

    const ads = JSON.parse(text.trim());
    if (Array.isArray(ads) && ads.length > 0) {
      console.log(`✅ Successfully generated ${ads.length} ads via Gemini.`);
      return ads;
    }
    throw new Error("Invalid JSON structure returned by Gemini");
  } catch (error: any) {
    console.error("❌ Gemini framework generation failed, falling back to local generator:", error.message || error);
    // Return fallback local template generation if Gemini API fails (e.g. rate limits or auth issues)
    return getLocalFallbackAds(brief);
  }
}

function getLocalFallbackAds(brief: CampaignBriefData): FrameworkAdResponse[] {
  return [
    {
      framework: "AIDA",
      frameworkLabel: "Attention → Interest → Desire → Action",
      angle: "Problem-Solution",
      headline: `${brief.targetAudience} in ${brief.location} — This Changes Everything`,
      body: `[Attention] Struggling with ${brief.painPoint}? You're not alone.\n\n[Interest] ${brief.businessName} offers ${brief.productService} designed specifically for ${brief.targetAudience}.\n\n[Desire] Imagine ${brief.desire}. Our clients are already experiencing this transformation.\n\n[Action] ${brief.offer} — Limited spots available!`,
      cta: brief.cta,
    },
    {
      framework: "PAS",
      frameworkLabel: "Problem → Agitation → Solution",
      angle: "Emotional Pain-Point",
      headline: `Still Dealing with ${brief.painPoint}?`,
      body: `[Problem] ${brief.painPoint} is holding you back from ${brief.desire}.\n\n[Agitation] Every day you wait, you're falling further behind. The frustration builds, the confidence drops, and the dream feels further away.\n\n[Solution] ${brief.businessName}'s ${brief.productService} is your answer. Join ${brief.targetAudience} in ${brief.location} who already made the switch.`,
      cta: brief.cta,
    },
    {
      framework: "BAB",
      frameworkLabel: "Before → After → Bridge",
      angle: "Transformation Story",
      headline: `From ${brief.painPoint} to ${brief.desire}`,
      body: `[Before] You're dealing with ${brief.painPoint}. It feels like nothing works.\n\n[After] Picture this: ${brief.desire}. Confident, happy, and in control.\n\n[Bridge] ${brief.businessName} bridges the gap with ${brief.productService}. ${brief.offer} — take the first step today.`,
      cta: brief.cta,
    },
    {
      framework: "OFFER",
      frameworkLabel: "Offer-Driven Direct Response",
      angle: "Offer-Based",
      headline: `🎁 ${brief.offer} — ${brief.businessName}`,
      body: `${brief.targetAudience} in ${brief.location}, this is your chance!\n\n${brief.businessName} is offering ${brief.offer} on our ${brief.productService}.\n\nWhether you want to ${brief.desire.toLowerCase()}, this is the easiest way to get started. Don't miss out — this offer won't last forever!`,
      cta: brief.cta,
    },
    {
      framework: "URGENCY",
      frameworkLabel: "Urgency & Scarcity Driven",
      angle: "Urgency / FOMO",
      headline: `⏰ Last Chance: ${brief.offer} Ends Soon!`,
      body: `Attention ${brief.targetAudience} in ${brief.location}!\n\n${brief.businessName}'s ${brief.offer} is ending soon. Our ${brief.productService} has helped hundreds of people ${brief.desire.toLowerCase()}.\n\nSpots are filling up fast. Once they're gone, they're gone. Act now!`,
      cta: brief.cta,
    },
    {
      framework: "TRUST",
      frameworkLabel: "Social Proof & Credibility",
      angle: "Trust / Social Proof",
      headline: `Why ${brief.targetAudience} in ${brief.location} Trust ${brief.businessName}`,
      body: `Join hundreds of happy customers who chose ${brief.businessName} for ${brief.productService}.\n\n⭐⭐⭐⭐⭐ "I finally achieved ${brief.desire.toLowerCase()} thanks to ${brief.businessName}!" — Verified Customer\n\nWe understand ${brief.painPoint}. That's why we offer ${brief.offer} to help you get started risk-free.`,
      cta: brief.cta,
    },
    {
      framework: "EMOTIONAL",
      frameworkLabel: "Emotional Connection",
      angle: "Emotional / Aspirational",
      headline: `You Deserve to ${brief.desire}`,
      body: `We know how it feels to struggle with ${brief.painPoint}. The frustration, the doubt, the endless searching for something that actually works.\n\n${brief.businessName} was built for people like you — ${brief.targetAudience} who refuse to give up.\n\nOur ${brief.productService} is more than a service. It's your next chapter. ${brief.offer} — because you deserve this.`,
      cta: brief.cta,
    },
  ];
}
