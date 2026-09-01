import { PrismaClient } from "@prisma/client";

/**
 * Singleton Prisma Client untuk Next.js.
 *
 * Di development mode, Next.js hot reload akan menciptakan instance baru
 * setiap kali modul di-reload. Pola ini memastikan hanya ada satu
 * koneksi aktif ke database selama development.
 *
 * Di production, setiap proses Node.js memiliki satu instance global.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
