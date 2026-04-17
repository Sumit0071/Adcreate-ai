import prisma from "./prisma";

export async function checkConnection() {
  try {
    await prisma.$connect();
    console.log("Successfully connected to the database.");
  } catch (e) {
    console.error("Failed to connect to the database.", e);
    throw e;
  }
}
