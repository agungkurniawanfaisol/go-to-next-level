import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk — EcoSwap Admin",
  description: "Login ke panel administrasi EcoSwap",
};

export default function MasukLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
