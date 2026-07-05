import type { Metadata } from "next";
import { Alfa_Slab_One, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const slab = Alfa_Slab_One({
  variable: "--font-slab",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Suroy-Suroy: plan your Philippine trips, light and free",
    template: "%s · Suroy-Suroy",
  },
  description:
    "A light, local-first travel planner for Philippine adventures. Day-by-day itineraries, maps and routes, a ₱ budget tracker, and packing lists. No signup, everything stays in your browser.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${slab.variable} h-full antialiased`}>
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
