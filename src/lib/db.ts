import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

// On Vercel, the filesystem is read-only except for /tmp.
// SQLite needs write access even for reads (due to lock/journal files).
// We copy the bundled db to /tmp and ensure Prisma uses it.
if (process.env.VERCEL) {
  const tmpDbPath = "/tmp/dev.db";
  const bundledDbPath = path.join(process.cwd(), "prisma", "dev.db");
  
  if (!fs.existsSync(tmpDbPath) && fs.existsSync(bundledDbPath)) {
    fs.copyFileSync(bundledDbPath, tmpDbPath);
  }
  
  // Override the DATABASE_URL to point to the writable /tmp directory
  process.env.DATABASE_URL = "file:/tmp/dev.db";
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = new Proxy({} as PrismaClient, {
  get(target, prop) {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = new PrismaClient();
    }
    return (globalForPrisma.prisma as any)[prop];
  }
}) as PrismaClient;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = globalForPrisma.prisma || undefined;
