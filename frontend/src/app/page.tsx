"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Geist, Geist_Mono } from "next/font/google";

import SiteHeader, { SectionKey } from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Solutions from "@/components/Solutions";
import Governance from "@/components/Governance";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

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

export default function PremiumLandingPage() {
  const [activeSection, setActiveSection] = useState<SectionKey>("home");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Create refs for each section
  const homeRef = useRef<HTMLElement | null>(null);
  const aboutRef = useRef<HTMLElement | null>(null);
  const solutionsRef = useRef<HTMLElement | null>(null);
  const governanceRef = useRef<HTMLElement | null>(null);
  const testimonialsRef = useRef<HTMLElement | null>(null);

  // Helper function to always return the latest refs
  const getSections = (): Record<SectionKey, HTMLElement | null> => ({
    home: homeRef.current,
    about: aboutRef.current,
    solutions: solutionsRef.current,
    governance: governanceRef.current,
    testimonials: testimonialsRef.current,
  });

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.05], [1, 0.98]);

  const scrollToSection = (sectionId: SectionKey): void => {
    setMobileMenuOpen(false);
    const sections = getSections();
    const section = sections[sectionId];
    console.log("Scrolling to:", sectionId, section?.offsetTop);
    if (section) {
      const offset =
        section.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      const scrollPos = window.scrollY + 100;
      const sections = getSections();
      Object.entries(sections).forEach(([key, section]) => {
        if (section) {
          const top = section.offsetTop;
          const bottom = top + section.offsetHeight;
          if (scrollPos >= top && scrollPos < bottom) {
            setActiveSection(key as SectionKey);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`min-h-screen bg-[#0a0a0a] text-[#f5f5f5] ${geistSans.variable} ${geistMono.variable}`}
    >
      {/* Background */}
      <div className="fixed inset-0 z-0 opacity-30 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,...')]"></div>
      </div>

      {/* Navbar */}
      <SiteHeader
        activeSection={activeSection}
        scrolled={scrolled}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        scrollToSection={scrollToSection}
      />

      {/* Sections with refs passed down */}
      <Hero
        ref={(el) => {
          homeRef.current = el;
        }}
      />
      <About
        ref={(el) => {
          aboutRef.current = el;
        }}
      />
      <Solutions
        ref={(el) => {
          solutionsRef.current = el;
        }}
      />
      <Governance
        ref={(el) => {
          governanceRef.current = el;
        }}
      />
      <Testimonials
        ref={(el) => {
          testimonialsRef.current = el;
        }}
      />
      <CTA />
      <Footer />

      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(0) translateX(20px);
          }
          75% {
            transform: translateY(20px) translateX(10px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .font-serif {
          font-family: var(--font-geist-mono), monospace;
        }
        .font-sans {
          font-family: var(--font-geist-sans), sans-serif;
        }
      `}</style>
    </div>
  );
}
