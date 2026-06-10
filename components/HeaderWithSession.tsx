import { getSession, getValidSessionUserId } from "@/lib/auth";
import { getUserTotalEcoSwapPoints } from "@/lib/api/user-points";
import { Header } from "@/components/Header";

export const dynamic = "force-dynamic";

export async function HeaderWithSession() {
  const [session, validUserId] = await Promise.all([
    getSession(),
    getValidSessionUserId(),
  ]);

  const totalPoints =
    validUserId != null
      ? await getUserTotalEcoSwapPoints(validUserId)
      : null;

  return (
    <Header
      userName={session?.name ?? null}
      totalPoints={totalPoints}
    />
  );
}
