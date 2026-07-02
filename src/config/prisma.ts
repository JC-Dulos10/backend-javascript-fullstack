import { PrismaClient } from "@prisma/client";

// Create one Prisma client instance for the application to reuse across repositories.
const prisma = new PrismaClient({
  log: ["query", "warn", "error"],
});

export default prisma;