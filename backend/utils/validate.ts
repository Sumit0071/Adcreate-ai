// src/validators/validate.ts
import { z } from "zod";

// ================= Enums ================= //
export const RoleEnum = z.enum(["USER", "ADMIN"]);
export const SenderTypeEnum = z.enum(["CLIENT", "BUSINESS"]);
export const ContentTypeEnum = z.enum(["TEXT", "IMAGE", "VIDEO", "DOCUMENT"]);
export const PlanEnum = z.enum(["BASIC", "PREMIUM", "ENTERPRISE"]);

// ================= User Schema ================= //
export const UserSchema = z.object({
  id: z.number().int().positive().optional(),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  Avatar: z
    .url("Invalid avatar URL")
    .optional()
    .default(
      "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
    ),
  role: RoleEnum.default("USER"),
  googleId: z.string().optional(),
  plan: PlanEnum.default("BASIC"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const RegisterSchema = UserSchema.pick({
  username: true,
  email: true,
  password: true,
  Avatar: true,
  role: true,
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});


// ================= BusinessProfile Schema ================= //
export const BusinessProfileSchema = z.object({
  id: z.number().int().positive().optional(),
  businessName: z.string().min(2, "Business name is required"),
  niche: z.string().min(2, "Niche is required"),
  productService: z.string().min(2, "Product/Service is required"),
  targetAudience: z.string().min(2, "Target audience is required"),
  adGoal: z.string().min(2, "Ad goal is required"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// ================= WhatsAppChat Schema ================= //
export const WhatsAppChatSchema = z.object({
  id: z.number().int().positive().optional(),
  waMessageId: z.string().min(1, "waMessageId is required"),
  senderName: z.string().min(1, "Sender name is required"),
  senderType: SenderTypeEnum,
  phoneNumber: z.string().min(5, "Phone number is required"),
  contentType: ContentTypeEnum,
  messageText: z.string().optional(),
  mediaUrl: z.url("Invalid media URL").optional(),
  timestamp: z.date(),

  userId: z.number().int().positive(),
});

// ================= Types ================= //
export type UserInput = z.infer<typeof UserSchema>;
export type BusinessProfileInput = z.infer<typeof BusinessProfileSchema>;
export type WhatsAppChatInput = z.infer<typeof WhatsAppChatSchema>;
