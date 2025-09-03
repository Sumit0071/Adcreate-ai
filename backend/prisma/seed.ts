import { PrismaClient, Role, Plan, SenderType, ContentType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Hash passwords
  const adminPass = await bcrypt.hash("Admin@123", 10);
  const userPass = await bcrypt.hash("User@123", 10);

  // Create Admin
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

  // Create Normal User
  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      username: "user1",
      email: "user@example.com",
      password: userPass,
      role: Role.USER,
      plan: Plan.BASIC,
    },
  });

  // Create Business Profile for User
  const businessProfile = await prisma.businessProfile.create({
    data: {
      businessName: "Tech Solutions",
      niche: "Software",
      productService: "Web & Mobile Apps",
      targetAudience: "Startups & SMEs",
      adGoal: "Lead Generation",
      userId: user.id,
    },
  });

  // Create WhatsApp Chat for User
  const chat = await prisma.whatsAppChat.create({
    data: {
      waMessageId: "msg_123456",
      senderName: "John Doe",
      senderType: SenderType.CLIENT,
      phoneNumber: "+1234567890",
      contentType: ContentType.TEXT,
      messageText: "Hello, I am interested in your services!",
      timestamp: new Date(),
      userId: user.id,
    },
  });

  console.log("✅ Seeding completed!");
  console.log({ admin, user, businessProfile, chat });
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
