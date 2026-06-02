"use server";

import { registerUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export type RegisterState = {
  error: string | null;
};

export async function registerAction(
  _prev: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const redirectTo = String(formData.get("redirect") ?? "/admin").trim() || "/admin";

  if (password !== confirmPassword) {
    return { error: "Konfirmasi password tidak cocok." };
  }

  const result = await registerUser(name, email, password);

  if (result.success) {
    redirect(redirectTo.startsWith("/") ? redirectTo : "/admin");
  }

  return { error: result.error };
}
