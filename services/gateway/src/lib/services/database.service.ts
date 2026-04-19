import { CONFIG } from "#/core/config.js";
import { PrismaClient } from "#/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";


// Prevent multiple instances in development
const globalForPrisma = global as unknown as { prisma: PrismaClient };

const adapter = new PrismaPg({ connectionString: CONFIG.DATABASE_URL });
export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (CONFIG.IS_DEV) globalForPrisma.prisma = prisma;