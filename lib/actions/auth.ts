"use server";

import { logoutUser } from "@/lib/auth";

export async function logoutAction() {
  await logoutUser();
}
