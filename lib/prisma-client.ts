import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

function parseDatabaseUrl(url: string) {
  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: Number(parsed.port || 3306),
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, ""),
  };
}

export function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }

  const config = parseDatabaseUrl(databaseUrl);

  const adapter = new PrismaMariaDb({
    ...config,
    connectionLimit: 5,
    connectTimeout: 30_000,
    acquireTimeout: 30_000,
    // MySQL 8 caching_sha2_password — tanpa ini pool timeout (RSA public key)
    allowPublicKeyRetrieval: true,
  });

  return new PrismaClient({ adapter });
}
