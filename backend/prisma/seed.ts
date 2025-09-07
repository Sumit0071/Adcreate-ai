// prisma/seed.ts
import { PrismaClient, Role, Plan, SenderType, ContentType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Hash passwords
  const adminPass = await bcrypt.hash("Admin@123", 10);
  const user1Pass = await bcrypt.hash("User1@123", 10);
  const user2Pass = await bcrypt.hash("User2@123", 10);

  // ============ USERS ============
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      username: "admin",
      email: "admin@example.com",
      password: adminPass,
      role: Role.ADMIN,
      plan: Plan.ENTERPRISE,
    },
  });

  const user1 = await prisma.user.upsert({
    where: { email: "user1@example.com" },
    update: {},
    create: {
      username: "user1",
      email: "user1@example.com",
      password: user1Pass,
      role: Role.USER,
      plan: Plan.BASIC,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "user2@example.com" },
    update: {},
    create: {
      username: "user2",
      email: "user2@example.com",
      password: user2Pass,
      role: Role.USER,
      plan: Plan.PREMIUM,
    },
  });

  // // ============ BUSINESS PROFILES ============
  // const profile1 = await prisma.businessProfile.create({
  //   data: {
  //     businessName: "Tech Solutions",
  //     niche: "Software",
  //     productService: "Web & Mobile Apps",
  //     targetAudience: "Startups & SMEs",
  //     adGoal: "Lead Generation",
  //     userId: user1.id,
  //   },
  // });

  // const profile2 = await prisma.businessProfile.create({
  //   data: {
  //     businessName: "Green Living",
  //     niche: "Eco Products",
  //     productService: "Reusable Home Goods",
  //     targetAudience: "Eco-conscious Consumers",
  //     adGoal: "Brand Awareness",
  //     userId: user2.id,
  //   },
  // });

  // // ============ ADS ============
  // await prisma.ad.createMany({
  //   data: [
  //     {
  //       content: "Grow your startup with our expert software solutions!",
  //       imageUrl: "https://via.placeholder.com/400x200",
  //       businessProfileId: profile1.id,
  //     },
  //     {
  //       content: "Switch to eco-friendly products and save the planet 🌍",
  //       imageUrl: "https://via.placeholder.com/400x200",
  //       businessProfileId: profile2.id,
  //     },
  //   ],
  // });

  // // ============ WHATSAPP CHATS ============
  // await prisma.whatsAppChat.createMany({
  //   data: [
  //     {
  //       waMessageId: "msg_101",
  //       senderName: "Alice Johnson",
  //       senderType: SenderType.CLIENT,
  //       phoneNumber: "+1987654321",
  //       contentType: ContentType.TEXT,
  //       messageText: "Hi! Can you tell me more about your products?",
  //       timestamp: new Date(),
  //       userId: user1.id,
  //     },
  //     {
  //       waMessageId: "msg_102",
  //       senderName: "Eco Store",
  //       senderType: SenderType.BUSINESS,
  //       phoneNumber: "+1123456789",
  //       contentType: ContentType.IMAGE,
  //       mediaUrl: "https://via.placeholder.com/150",
  //       timestamp: new Date(),
  //       userId: user2.id,
  //     },
  //   ],
  // });

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
