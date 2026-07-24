// Simple database setup (Prisma)
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

// Schema:
// model Signal {
//   id        String   @id @default(cuid())
//   coin      String
//   verdict   String
//   confidence Int
//   strategies Json
//   createdAt DateTime @default(now())
// }
