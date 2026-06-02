import { createPrismaClient } from "@/lib/prisma-client";

type PrismaInstance = ReturnType<typeof createPrismaClient>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaInstance | undefined;
};

function isClientComplete(client: PrismaInstance): boolean {
  return typeof client.barterProposal?.findMany === "function";
}

export function getPrisma(): PrismaInstance {
  let client = globalForPrisma.prisma;

  if (client && !isClientComplete(client)) {
    client.$disconnect().catch(() => {});
    client = undefined;
    globalForPrisma.prisma = undefined;
  }

  if (!client) {
    client = createPrismaClient();
    globalForPrisma.prisma = client;
  }

  return client;
}

/** Lazy proxy — avoids stale Prisma delegates from HMR / cached .next bundles */
export const prisma: PrismaInstance = new Proxy({} as PrismaInstance, {
  get(_target, prop, _receiver) {
    const client = getPrisma();
    const value = Reflect.get(client, prop, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
