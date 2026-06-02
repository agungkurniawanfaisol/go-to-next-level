import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import { scryptSync, randomBytes } from "crypto";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "ecoswap-demo-secret-change-in-production",
);

const COOKIE_NAME = "ecoswap-session";
const SESSION_DURATION = 60 * 60 * 24; // 24 hours

function sessionCookieOptions() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL ?? "";
  const secure =
    process.env.COOKIE_SECURE === "true" ||
    (process.env.COOKIE_SECURE !== "false" && appUrl.startsWith("https://"));

  return {
    httpOnly: true,
    secure,
    sameSite: "lax" as const,
    maxAge: SESSION_DURATION,
    path: "/",
  };
}

// ─── Password hashing (Node.js crypto — server-only) ─────────────────────

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const colonIndex = stored.indexOf(":");
  if (colonIndex === -1) return false;
  const salt = stored.slice(0, colonIndex);
  const hash = stored.slice(colonIndex + 1);
  if (!salt || !hash) return false;
  const derived = scryptSync(password, salt, 64).toString("hex");
  return hash === derived;
}

// ─── JWT session ─────────────────────────────────────────────────────────

export type SessionPayload = {
  userId: string;
  email: string;
  name: string;
  role: string;
};

async function createToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(JWT_SECRET);
}

async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

// ─── Login action ────────────────────────────────────────────────────────

export type LoginResult =
  | { success: true; user: SessionPayload }
  | { success: false; error: string };

export async function loginUser(
  email: string,
  password: string,
): Promise<LoginResult> {
  if (!email || !password) {
    return { success: false, error: "Email dan password wajib diisi." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { success: false, error: "Email atau password salah." };
  }

  if (!verifyPassword(password, user.passwordHash)) {
    return { success: false, error: "Email atau password salah." };
  }

  const session: SessionPayload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  const token = await createToken(session);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, sessionCookieOptions());

  return { success: true, user: session };
}

// ─── Logout ──────────────────────────────────────────────────────────────

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// ─── Get current session (for middleware & server components) ────────────

export async function getSession(): Promise<SessionPayload | null> {
  await connection();
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/** userId dari session yang masih ada di DB (hindari FK error setelah re-seed) */
export async function getValidSessionUserId(): Promise<string | null> {
  const session = await getSession();
  if (!session?.userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true },
  });

  return user?.id ?? null;
}

// ─── Register ───────────────────────────────────────────────────────────

export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<LoginResult> {
  if (!name || !email || !password) {
    return { success: false, error: "Nama, email, dan password wajib diisi." };
  }

  if (password.length < 6) {
    return { success: false, error: "Password minimal 6 karakter." };
  }

  // Check if email already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { success: false, error: "Email sudah terdaftar." };
  }

  const passwordHash = hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      role: "MEMBER",
    },
  });

  // Auto-login after register
  const session: SessionPayload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  const token = await createToken(session);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, sessionCookieOptions());

  return { success: true, user: session };
}

// ─── Password hash utility for seeding ───────────────────────────────────

export { hashPassword };
