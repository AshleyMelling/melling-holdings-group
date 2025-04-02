"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bitcoin, Menu, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * The shared type of all valid section IDs.
 */
export type SectionKey =
  | "home"
  | "about"
  | "solutions"
  | "governance"
  | "testimonials";

/** Props for the SiteHeader component */
interface SiteHeaderProps {
  activeSection?: SectionKey;
  scrollToSection?: (sectionId: SectionKey) => void;
  scrolled?: boolean;
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
}

export default function SiteHeader({
  activeSection = "home",
  scrollToSection = () => {},
  scrolled = false,
  mobileMenuOpen: externalMobileMenuOpen,
  setMobileMenuOpen: externalSetMobileMenuOpen,
}: SiteHeaderProps) {
  const [internalMobileMenuOpen, setInternalMobileMenuOpen] = useState(false);
  const mobileMenuOpen =
    externalMobileMenuOpen !== undefined
      ? externalMobileMenuOpen
      : internalMobileMenuOpen;
  const setMobileMenuOpen =
    externalSetMobileMenuOpen || setInternalMobileMenuOpen;

  return (
    <>
      <header
        className={cn(
          "w-full fixed top-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-[#0a0a0a]/70 backdrop-blur-md border-b border-[#ffffff10]"
            : "bg-transparent"
        )}
      >
        <div className="w-full max-w-7xl mx-auto px-4 flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer">
            <Link href="/">
              <div className="flex items-center gap-2">
                <div className="relative h-10 w-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#f97316] to-[#ea580c] rounded-full opacity-70 blur-[2px]" />
                  <div className="absolute inset-0 bg-[#0a0a0a] rounded-full flex items-center justify-center">
                    <Bitcoin className="h-6 w-6 text-[#f97316]" />
                  </div>
                </div>
                <span className="text-xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#f97316] to-[#fbbf24]">
                  Melling Holdings Group
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { name: "Home", id: "home" as SectionKey },
              { name: "About", id: "about" as SectionKey },
              { name: "Solutions", id: "solutions" as SectionKey },
              { name: "Governance", id: "governance" as SectionKey },
              { name: "Testimonials", id: "testimonials" as SectionKey },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={cn(
                  "text-sm font-sans relative px-1 py-2 transition-colors group",
                  activeSection === item.id
                    ? "text-[#f97316]"
                    : "text-[#f5f5f5] hover:text-[#f97316]"
                )}
              >
                {item.name}
                <span
                  className={cn(
                    "absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#f97316] to-[#fbbf24] transform origin-left transition-transform duration-300",
                    activeSection === item.id
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  )}
                />
              </button>
            ))}
            {/* Login button for desktop navigates to the login page */}
            <Link href="/login" passHref>
              <Button
                variant="outline"
                className="border-[#f97316] text-[#f97316] hover:bg-[#f97316]/10 hover:text-[#f97316] transition-all duration-300"
              >
                Login
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-[#f5f5f5]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#ffffff10] overflow-hidden"
            >
              <div className="w-full max-w-7xl mx-auto px-4 py-4 flex flex-col gap-4">
                {[
                  { name: "Home", id: "home" as SectionKey },
                  { name: "About", id: "about" as SectionKey },
                  { name: "Solutions", id: "solutions" as SectionKey },
                  { name: "Governance", id: "governance" as SectionKey },
                  { name: "Testimonials", id: "testimonials" as SectionKey },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setTimeout(() => scrollToSection(item.id), 300);
                    }}
                    className={cn(
                      "text-left text-lg font-sans py-2 transition-colors",
                      activeSection === item.id
                        ? "text-[#f97316]"
                        : "text-[#f5f5f5]"
                    )}
                  >
                    {item.name}
                  </button>
                ))}
                {/* Mobile Login button navigates to the login page */}
                <Link href="/login" passHref>
                  <Button
                    variant="outline"
                    className="mt-2 border-[#f97316] text-[#f97316] hover:bg-[#f97316]/10 hover:text-[#f97316] transition-all duration-300"
                  >
                    Login
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
