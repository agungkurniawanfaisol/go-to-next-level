import { NextResponse } from "next/server";
import { getSession, getValidSessionUserId } from "@/lib/auth";
import { getUserTotalEcoSwapPoints } from "@/lib/api/user-points";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null });
  }

  const validUserId = await getValidSessionUserId();
  const totalPoints =
    validUserId != null ? await getUserTotalEcoSwapPoints(validUserId) : 0;

  return NextResponse.json({
    user: {
      name: session.name,
      email: session.email,
      role: session.role,
      totalPoints,
    },
  });
}
