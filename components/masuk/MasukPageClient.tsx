"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useState } from "react";
import { PageTransition } from "@/components/PageTransition";
import { loginAction } from "@/lib/actions/login";
import { registerAction } from "@/lib/actions/register";

export function MasukPageClient() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/admin";
  const [mode, setMode] = useState<"login" | "register">("login");

  const [loginState, loginFormAction, loginPending] = useActionState(loginAction, {
    error: null,
  });

  const [registerState, registerFormAction, registerPending] = useActionState(
    registerAction,
    { error: null },
  );

  const isPending = mode === "login" ? loginPending : registerPending;
  const state = mode === "login" ? loginState : registerState;
  const formAction = mode === "login" ? loginFormAction : registerFormAction;

  return (
    <PageTransition>
      <div className="flex min-h-screen items-center justify-center bg-page px-6">
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,rgba(31,61,50,0.08)_0%,transparent_60%),radial-gradient(ellipse_40%_50%_at_70%_80%,rgba(15,107,86,0.05)_0%,transparent_50%)]"
        />
        <div className="relative w-full max-w-md">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-ink/60 transition-colors hover:text-emerald"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7-7l-7 7 7 7" />
            </svg>
            Kembali ke beranda
          </Link>

          <div className="glass-panel rounded-2xl border border-ink/8 bg-surface/80 p-8">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-forest/20 bg-forest/5 ring-1 ring-gold/20">
              <svg className="h-6 w-6 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>

            <div className="mt-4 flex rounded-xl border border-ink/8 bg-ivory p-1">
              <button
                type="button"
                role="tab"
                aria-selected={mode === "login"}
                onClick={() => setMode("login")}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  mode === "login"
                    ? "bg-forest text-ivory shadow-card"
                    : "text-ink/60 hover:text-ink"
                }`}
              >
                Masuk
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "register"}
                onClick={() => setMode("register")}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  mode === "register"
                    ? "bg-forest text-ivory shadow-card"
                    : "text-ink/60 hover:text-ink"
                }`}
              >
                Daftar
              </button>
            </div>

            <h1 className="mt-5 text-2xl font-bold text-ink">
              {mode === "login" ? "Selamat Datang" : "Buat Akun Baru"}
            </h1>
            <p className="mt-2 text-sm text-ink/60">
              {mode === "login"
                ? "Gunakan akun yang sudah terdaftar."
                : "Daftar untuk mulai menggunakan EcoSwap Admin."}
            </p>

            <form action={formAction} className="mt-6 space-y-4">
              <input type="hidden" name="redirect" value={redirectTo} />

              {mode === "register" && (
                <label className="block text-sm font-medium text-ink">
                  Nama Lengkap
                  <input
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder="Contoh: Budi Santoso"
                    className="mt-1.5 w-full rounded-xl border border-ink/20 bg-ivory/60 px-4 py-3 text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-emerald focus:ring-2 focus:ring-emerald/20"
                  />
                </label>
              )}

              <label className="block text-sm font-medium text-ink">
                Email
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder={mode === "login" ? "admin@ecoswap.id" : "email@contoh.com"}
                  defaultValue={mode === "login" ? "admin@ecoswap.id" : undefined}
                  className="mt-1.5 w-full rounded-xl border border-ink/20 bg-ivory/60 px-4 py-3 text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-emerald focus:ring-2 focus:ring-emerald/20"
                />
              </label>

              <label className="block text-sm font-medium text-ink">
                Password
                <input
                  name="password"
                  type="password"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="mt-1.5 w-full rounded-xl border border-ink/20 bg-ivory/60 px-4 py-3 text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-emerald focus:ring-2 focus:ring-emerald/20"
                />
              </label>

              {mode === "register" && (
                <label className="block text-sm font-medium text-ink">
                  Konfirmasi Password
                  <input
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={6}
                    placeholder="Ulangi password"
                    className="mt-1.5 w-full rounded-xl border border-ink/20 bg-ivory/60 px-4 py-3 text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-emerald focus:ring-2 focus:ring-emerald/20"
                  />
                </label>
              )}

              {state.error && (
                <p className="text-sm text-red-700" role="alert">
                  {state.error}
                </p>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="group w-full rounded-full bg-forest px-8 py-3.5 text-sm font-semibold text-ivory shadow-card transition-all hover:bg-forest-light hover:shadow-elevated disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                {isPending
                  ? "Memproses..."
                  : mode === "login"
                    ? "Masuk ke Admin"
                    : "Daftar & Masuk"}
              </button>
            </form>

            {mode === "login" && (
              <div className="mt-6 rounded-xl border border-gold/20 bg-gold/5 px-4 py-3">
                <p className="text-xs font-semibold text-ink/60">Akun Demo</p>
                <p className="mt-1 text-xs leading-relaxed text-ink/50">
                  <span className="font-medium text-ink">admin@ecoswap.id</span> — password:{" "}
                  <span className="font-mono text-ink">password123</span>
                  <br />
                  <span className="font-medium text-ink">budi@email.com</span> — password:{" "}
                  <span className="font-mono text-ink">password123</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
