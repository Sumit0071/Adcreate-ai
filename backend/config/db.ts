import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient( {
  log: process.env.NODE_ENV === "development"
    ? ["query", "info", "warn", "error"]
    : ["error"],
} );


export async function checkConnection() {
  try {
    await prisma.$connect();
    console.log( "Successfully connected to the database. 🚀" );
  } catch ( e ) {
    console.error( "Failed to connect to the database.", e );
  } finally {
    await prisma.$disconnect();
  }
}

