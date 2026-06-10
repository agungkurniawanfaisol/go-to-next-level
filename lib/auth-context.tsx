"use client";

import { createContext, useContext } from "react";

export type AuthUser = {
  name: string;
  email: string;
  role: string;
  initial: string;
};

export const AuthContext = createContext<AuthUser | null>(null);

export function useAuth() {
  return useContext(AuthContext);
}
