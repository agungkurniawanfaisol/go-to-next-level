import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EcoSwap — AI-Driven Digital Cultural Stewardship",
  description:
    "Reviving Local Heritage through CNN-Based Circular Economy. Tukar barang bekasmu, selamatkan warisan budaya, dan dapatkan poin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${jakarta.variable} ${fraunces.variable} h-full scroll-smooth`}
    >
      <body
        className={`${jakarta.className} min-h-full font-sans antialiased bg-ivory text-ink`}
      >
        {children}
      </body>
    </html>
  );
}
