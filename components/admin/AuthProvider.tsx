"use client";

import { AuthContext, type AuthUser } from "@/lib/auth-context";

type AuthProviderProps = {
  user: AuthUser;
  children: React.ReactNode;
};

export function AuthProvider({ user, children }: AuthProviderProps) {
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}
