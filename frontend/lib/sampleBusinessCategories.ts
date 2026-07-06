// Sample Business Categories with Pre-filled Data
// For smooth demo presentations — user picks a category and fields auto-populate

import { CampaignBrief } from "./marketingFrameworks";

export interface BusinessCategory {
  id: string;
  name: string;
  icon: string;
  brief: CampaignBrief;
}

export const SAMPLE_CATEGORIES: BusinessCategory[] = [
  {
    id: "fitness",
    name: "Fitness Center",
    icon: "🏋️",
    brief: {
      businessName: "ABC Fitness Studio",
      industry: "Fitness",
      productService: "Weight Loss Program",
      targetAudience: "Women aged 25-45",
      location: "Kolkata",
      offer: "7-day free trial",
      painPoint: "Unable to lose weight despite trying",
      desire: "Look fit and confident",
      campaignGoal: "Lead generation",
      tone: "Friendly",
      cta: "Book Free Trial",
    },
  },
  {
    id: "restaurant",
    name: "Restaurant",
    icon: "🍽️",
    brief: {
      businessName: "Spice Garden Restaurant",
      industry: "Food & Beverage",
      productService: "Family dining with authentic Indian cuisine",
      targetAudience: "Families and food lovers aged 25-50",
      location: "Mumbai",
      offer: "20% off on first visit",
      painPoint: "Hard to find quality family dining",
      desire: "Enjoy memorable meals with family",
      campaignGoal: "Foot traffic",
      tone: "Warm",
      cta: "Reserve Your Table",
    },
  },
  {
    id: "salon",
    name: "Salon & Spa",
    icon: "💇",
    brief: {
      businessName: "Glow Beauty Salon",
      industry: "Beauty & Wellness",
      productService: "Premium hair and skin treatments",
      targetAudience: "Women aged 20-40",
      location: "Delhi",
      offer: "Free consultation + 15% off first service",
      painPoint: "Not happy with current look",
      desire: "Feel beautiful and pampered",
      campaignGoal: "Appointments",
      tone: "Premium",
      cta: "Book Appointment",
    },
  },
  {
    id: "coaching",
    name: "Coaching Institute",
    icon: "📚",
    brief: {
      businessName: "BrightMind Academy",
      industry: "Education",
      productService: "JEE/NEET preparation course",
      targetAudience: "Students aged 16-19 and their parents",
      location: "Pune",
      offer: "Free demo class + study material",
      painPoint: "Struggling with competitive exam prep",
      desire: "Crack the exam with top rank",
      campaignGoal: "Enrollment",
      tone: "Motivational",
      cta: "Enroll for Free Demo",
    },
  },
  {
    id: "realestate",
    name: "Real Estate",
    icon: "🏠",
    brief: {
      businessName: "Skyline Properties",
      industry: "Real Estate",
      productService: "2BHK/3BHK luxury apartments",
      targetAudience: "Working professionals aged 28-45",
      location: "Bangalore",
      offer: "Site visit with free consultation",
      painPoint: "Cannot find the right home",
      desire: "Own a dream home for the family",
      campaignGoal: "Site visits",
      tone: "Premium",
      cta: "Schedule Site Visit",
    },
  },
  {
    id: "clinic",
    name: "Clinic / Healthcare",
    icon: "🏥",
    brief: {
      businessName: "CareFirst Dental Clinic",
      industry: "Healthcare",
      productService: "Dental care and cosmetic dentistry",
      targetAudience: "Adults aged 25-55",
      location: "Hyderabad",
      offer: "Free dental check-up",
      painPoint: "Dental problems causing discomfort",
      desire: "Have a healthy, confident smile",
      campaignGoal: "Appointments",
      tone: "Caring",
      cta: "Book Free Check-up",
    },
  },
  {
    id: "ecommerce",
    name: "E-commerce Product",
    icon: "🛒",
    brief: {
      businessName: "GlowSkin Naturals",
      industry: "E-commerce / Beauty",
      productService: "Organic skincare products",
      targetAudience: "Women aged 20-35 interested in natural beauty",
      location: "Pan India (Online)",
      offer: "Buy 1 Get 1 Free + free shipping",
      painPoint: "Skin issues from chemical products",
      desire: "Have naturally glowing, healthy skin",
      campaignGoal: "Online sales",
      tone: "Friendly",
      cta: "Shop Now",
    },
  },
];
