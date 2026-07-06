// Lead Nurturing Sequence Generator
// Creates funnel-stage follow-up message sequences

import { CampaignBrief } from "./marketingFrameworks";

export interface NurturingMessage {
  day: number;
  label: string;
  purpose: string;
  channel: "WhatsApp" | "Email" | "SMS";
  subject?: string;
  message: string;
}

export function generateNurturingSequence(brief: CampaignBrief): NurturingMessage[] {
  const { businessName, productService, offer, painPoint, desire, targetAudience, cta } = brief;

  return [
    {
      day: 0,
      label: "Thank You",
      purpose: "Welcome & acknowledgement",
      channel: "WhatsApp",
      message: `Hi! 👋 Thank you for your interest in ${businessName}! We're thrilled to have you. You've taken the first step towards ${desire.toLowerCase()}. We'll be sharing some exciting things with you soon. Stay tuned!`,
    },
    {
      day: 1,
      label: "Benefit Explanation",
      purpose: "Educate about the product/service",
      channel: "WhatsApp",
      message: `Hey! 😊 Quick question — did you know our ${productService} is specifically designed for ${targetAudience}?\n\nHere's what makes us different:\n✅ Tailored approach for your needs\n✅ Proven results from real people\n✅ Expert guidance every step of the way\n\nWant to know more? Just reply "YES"!`,
    },
    {
      day: 2,
      label: "Trust Building",
      purpose: "Social proof & testimonials",
      channel: "Email",
      subject: `See why ${targetAudience} love ${businessName}`,
      message: `Hi there!\n\nWe know choosing the right ${productService} can feel overwhelming. That's why we wanted to share what others like you are saying:\n\n⭐ "I was struggling with ${painPoint.toLowerCase()}, but ${businessName} completely changed my experience!"\n⭐ "Within weeks, I could see the difference. Truly grateful!"\n\nYou deserve to ${desire.toLowerCase()} too. Ready to start?\n\n${cta} → [Link]`,
    },
    {
      day: 3,
      label: "Offer Reminder",
      purpose: "Re-emphasize the offer",
      channel: "WhatsApp",
      message: `Hi! 🎁 Just a quick reminder — our ${offer} is still available!\n\nThis is the perfect opportunity to experience ${businessName}'s ${productService} and start your journey towards ${desire.toLowerCase()}.\n\nDon't miss out — ${cta}! 🚀`,
    },
    {
      day: 5,
      label: "Overcome Objections",
      purpose: "Address common doubts",
      channel: "Email",
      subject: `Still thinking about it? We understand.`,
      message: `Hi!\n\nWe get it — making a decision about ${productService} is important. Here are answers to the most common questions:\n\n❓ "Is it really for me?" → Yes! Our program is designed for ${targetAudience}.\n❓ "What if it doesn't work?" → We stand behind our results with ${offer}.\n❓ "Is it complicated?" → Not at all! We guide you every step of the way.\n\nReady to take the leap? ${cta}!`,
    },
    {
      day: 7,
      label: "Final Follow-up",
      purpose: "Urgency & last call",
      channel: "WhatsApp",
      message: `Hey! ⏰ This is your last reminder — the ${offer} at ${businessName} is about to end.\n\nHundreds of ${targetAudience} have already started their journey to ${desire.toLowerCase()}. Will you be next?\n\n${cta} → [Link]\n\nAfter today, this offer may not be available again. Don't wait! 🔥`,
    },
  ];
}
