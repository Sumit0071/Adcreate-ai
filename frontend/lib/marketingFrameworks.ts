// Marketing Frameworks Engine
// Generates structured ad copy using proven marketing frameworks (AIDA, PAS, BAB, etc.)
// Works entirely client-side — no API dependency

export interface CampaignBrief {
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

export interface FrameworkAd {
  framework: string;
  frameworkLabel: string;
  angle: string;
  headline: string;
  body: string;
  cta: string;
}

// ─── AIDA Framework ────────────────────────────────────────────────────────────
function generateAIDA(brief: CampaignBrief): FrameworkAd {
  const toneAdj = brief.tone.toLowerCase();
  return {
    framework: "AIDA",
    frameworkLabel: "Attention → Interest → Desire → Action",
    angle: "Problem-Solution",
    headline: `${brief.targetAudience} in ${brief.location} — This Changes Everything`,
    body: `[Attention] Struggling with ${brief.painPoint}? You're not alone.\n\n[Interest] ${brief.businessName} offers ${brief.productService} designed specifically for ${brief.targetAudience}.\n\n[Desire] Imagine ${brief.desire}. Our clients are already experiencing this transformation.\n\n[Action] ${brief.offer} — Limited spots available!`,
    cta: brief.cta || "Get Started Now",
  };
}

// ─── PAS Framework ─────────────────────────────────────────────────────────────
function generatePAS(brief: CampaignBrief): FrameworkAd {
  return {
    framework: "PAS",
    frameworkLabel: "Problem → Agitation → Solution",
    angle: "Emotional Pain-Point",
    headline: `Still Dealing with ${brief.painPoint}?`,
    body: `[Problem] ${brief.painPoint} is holding you back from ${brief.desire}.\n\n[Agitation] Every day you wait, you're falling further behind. The frustration builds, the confidence drops, and the dream feels further away.\n\n[Solution] ${brief.businessName}'s ${brief.productService} is your answer. Join ${brief.targetAudience} in ${brief.location} who already made the switch.`,
    cta: brief.cta || "Start Your Transformation",
  };
}

// ─── BAB Framework ─────────────────────────────────────────────────────────────
function generateBAB(brief: CampaignBrief): FrameworkAd {
  return {
    framework: "BAB",
    frameworkLabel: "Before → After → Bridge",
    angle: "Transformation Story",
    headline: `From ${brief.painPoint} to ${brief.desire}`,
    body: `[Before] You're dealing with ${brief.painPoint}. It feels like nothing works.\n\n[After] Picture this: ${brief.desire}. Confident, happy, and in control.\n\n[Bridge] ${brief.businessName} bridges the gap with ${brief.productService}. ${brief.offer} — take the first step today.`,
    cta: brief.cta || "Bridge the Gap Now",
  };
}

// ─── Offer-Based ───────────────────────────────────────────────────────────────
function generateOfferBased(brief: CampaignBrief): FrameworkAd {
  return {
    framework: "OFFER",
    frameworkLabel: "Offer-Driven Direct Response",
    angle: "Offer-Based",
    headline: `🎁 ${brief.offer} — ${brief.businessName}`,
    body: `${brief.targetAudience} in ${brief.location}, this is your chance!\n\n${brief.businessName} is offering ${brief.offer} on our ${brief.productService}.\n\nWhether you want to ${brief.desire.toLowerCase()}, this is the easiest way to get started. Don't miss out — this offer won't last forever!`,
    cta: brief.cta || "Claim Your Offer",
  };
}

// ─── Urgency-Based ─────────────────────────────────────────────────────────────
function generateUrgencyBased(brief: CampaignBrief): FrameworkAd {
  return {
    framework: "URGENCY",
    frameworkLabel: "Urgency & Scarcity Driven",
    angle: "Urgency / FOMO",
    headline: `⏰ Last Chance: ${brief.offer} Ends Soon!`,
    body: `Attention ${brief.targetAudience} in ${brief.location}!\n\n${brief.businessName}'s ${brief.offer} is ending soon. Our ${brief.productService} has already helped hundreds of people ${brief.desire.toLowerCase()}.\n\nSpots are filling up fast. Once they're gone, they're gone. Act now or regret later.`,
    cta: brief.cta || "Act Now — Limited Time",
  };
}

// ─── Social Proof / Trust ──────────────────────────────────────────────────────
function generateTrustBased(brief: CampaignBrief): FrameworkAd {
  return {
    framework: "TRUST",
    frameworkLabel: "Social Proof & Credibility",
    angle: "Trust / Social Proof",
    headline: `Why ${brief.targetAudience} in ${brief.location} Trust ${brief.businessName}`,
    body: `Join hundreds of happy customers who chose ${brief.businessName} for ${brief.productService}.\n\n⭐⭐⭐⭐⭐ "I finally achieved ${brief.desire.toLowerCase()} thanks to ${brief.businessName}!" — Verified Customer\n\nWe understand ${brief.painPoint}. That's why we offer ${brief.offer} to help you get started risk-free.`,
    cta: brief.cta || "Join the Community",
  };
}

// ─── Emotional Ad ──────────────────────────────────────────────────────────────
function generateEmotional(brief: CampaignBrief): FrameworkAd {
  return {
    framework: "EMOTIONAL",
    frameworkLabel: "Emotional Connection",
    angle: "Emotional / Aspirational",
    headline: `You Deserve to ${brief.desire}`,
    body: `We know how it feels to struggle with ${brief.painPoint}. The frustration, the doubt, the endless searching for something that actually works.\n\n${brief.businessName} was built for people like you — ${brief.targetAudience} who refuse to give up.\n\nOur ${brief.productService} is more than a service. It's your next chapter. ${brief.offer} — because you deserve this.`,
    cta: brief.cta || "Start Your Journey",
  };
}

// ─── Master Generator ──────────────────────────────────────────────────────────
export function generateAllFrameworkAds(brief: CampaignBrief): FrameworkAd[] {
  return [
    generateAIDA(brief),
    generatePAS(brief),
    generateBAB(brief),
    generateOfferBased(brief),
    generateUrgencyBased(brief),
    generateTrustBased(brief),
    generateEmotional(brief),
  ];
}

export const FRAMEWORK_NAMES: Record<string, string> = {
  AIDA: "AIDA (Attention → Interest → Desire → Action)",
  PAS: "PAS (Problem → Agitation → Solution)",
  BAB: "BAB (Before → After → Bridge)",
  OFFER: "Offer-Based Direct Response",
  URGENCY: "Urgency & Scarcity Driven",
  TRUST: "Social Proof & Credibility",
  EMOTIONAL: "Emotional Connection",
};
