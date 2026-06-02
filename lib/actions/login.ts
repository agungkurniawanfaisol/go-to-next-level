"use server";

import { loginUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export type LoginState = {
  error: string | null;
};

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirect") ?? "/admin").trim() || "/admin";

  const result = await loginUser(email, password);

  if (result.success) {
    redirect(redirectTo.startsWith("/") ? redirectTo : "/admin");
  }

  return { error: result.error };
}
