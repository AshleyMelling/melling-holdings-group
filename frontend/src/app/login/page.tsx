"use client";

import { Geist, Geist_Mono } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { LoginForm } from "@/components/login-form"; // adjust path if needed

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export default function LoginPage() {
  return (
    <div
      className={`min-h-screen flex flex-col bg-[#0a0a0a] text-[#f5f5f5] ${geistSans.variable} ${geistMono.variable}`}
    >
      {/* Header */}
      <div className="z-10 backdrop-blur-md bg-background/70 border-b border-white/10">
        <SiteHeader />
      </div>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-16 sm:py-20 md:py-28 lg:py-32 xl:py-40">
        <div className="w-full max-w-md bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl shadow-xl p-10">
          <LoginForm />
        </div>
      </main>

      {/* Global Font Styles */}
      <style jsx global>{`
        .font-sans {
          font-family: var(--font-geist-sans), sans-serif;
        }
        .font-serif {
          font-family: var(--font-geist-mono), monospace;
        }
      `}</style>
    </div>
  );
}
