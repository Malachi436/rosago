// This file forces VS Code TypeScript server to reload Prisma types
// It can be deleted after the types are refreshed
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
