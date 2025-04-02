"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  Bitcoin,
  ArrowRight,
  Shield,
  Lock,
  Globe,
  ChevronRight,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Geist, Geist_Mono } from "next/font/google";
import SiteHeader, { SectionKey } from "/home/remem/bitcoinholdings/frontend/src/components/SiteHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Component to render animated orbs with fixed dimensions computed on mount
function AnimatedOrbs() {
  const [orbs, setOrbs] = useState<
    {
      width: string;
      height: string;
      top: string;
      left: string;
      background: string;
      filter: string;
      animation: string;
      animationDelay: string;
    }[]
  >([]);

  useEffect(() => {
    const generatedOrbs = Array.from({ length: 5 }).map(() => ({
      width: `${Math.random() * 300 + 100}px`,
      height: `${Math.random() * 300 + 100}px`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 80}%`,
      background: `radial-gradient(circle at center, rgba(249,115,22,0.3), transparent)`,
      filter: "blur(40px)",
      animation: `float ${Math.random() * 20 + 20}s linear infinite`,
      animationDelay: `${Math.random() * 5}s`,
    }));
    setOrbs(generatedOrbs);
  }, []);

  if (orbs.length === 0) return null;
  return (
    <>
      {orbs.map((orb, i) => (
        <div key={i} className="absolute rounded-full opacity-20" style={orb} />
      ))}
    </>
  );
}

// Component to render animated particles with fixed values computed on mount
function AnimatedParticles() {
  const [particles, setParticles] = useState<
    {
      width: string;
      height: string;
      top: string;
      left: string;
      animation: string;
      animationDelay: string;
    }[]
  >([]);

  useEffect(() => {
    const generatedParticles = Array.from({ length: 30 }).map(() => ({
      width: `${Math.random() * 6 + 2}px`,
      height: `${Math.random() * 6 + 2}px`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animation: `float ${Math.random() * 10 + 15}s linear infinite`,
      animationDelay: `${Math.random() * 5}s`,
    }));
    setParticles(generatedParticles);
  }, []);

  if (particles.length === 0) return null;
  return (
    <>
      {particles.map((particle, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-[#f97316]/20"
          style={particle}
        />
      ))}
    </>
  );
}

export default function PremiumLandingPage() {
  const [activeSection, setActiveSection] = useState<SectionKey>("home");
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Define sectionsRef with keys typed to SectionKey and values as HTMLElement | null.
  const sectionsRef = useRef<{ [key in SectionKey]: HTMLElement | null }>({
    home: null,
    about: null,
    solutions: null,
    governance: null,
    testimonials: null,
  });

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.05], [1, 0.98]);

  // Updated scrollToSection using getBoundingClientRect()
  const scrollToSection = (sectionId: SectionKey): void => {
    setMobileMenuOpen(false);
    const section = sectionsRef.current[sectionId];
    if (section) {
      const offset =
        section.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({
        top: offset,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      const scrollPos = window.scrollY + 100;
      (Object.keys(sectionsRef.current) as SectionKey[]).forEach((key) => {
        const section = sectionsRef.current[key];
        if (section) {
          const top = section.offsetTop;
          const bottom = top + section.offsetHeight;
          if (scrollPos >= top && scrollPos < bottom) {
            setActiveSection(key);
          }
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`min-h-screen bg-[#0a0a0a] text-[#f5f5f5] dark ${geistSans.variable} ${geistMono.variable}`}
    >
      {/* Organic Background */}
      <div className="fixed inset-0 z-0 opacity-30 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.15),transparent_50%)]"></div>
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
        {/* Animated Orbs */}
        <AnimatedOrbs />
        {/* Flowing Particles */}
        <div className="absolute inset-0 opacity-30">
          <div className="particle-container">
            <AnimatedParticles />
          </div>
        </div>
      </div>

      {/* Glassmorphic Navbar */}
      <SiteHeader
        activeSection={activeSection}
        scrolled={scrolled}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        scrollToSection={scrollToSection}
      />

      {/* Hero Section */}
      <motion.section
        ref={(el: HTMLElement | null) => {
          sectionsRef.current.home = el;
        }}
        className="relative min-h-screen flex items-start"
        style={{ opacity, scale }}
      >
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
          <div className="mt-40 md:mt-48 max-w-4xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block px-3 py-1 rounded-full bg-[#f97316]/10 text-[#f97316] text-sm font-sans font-medium mb-4 border border-[#f97316]/20"
            >
              The Future of Financial Sovereignty
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold tracking-tight leading-tight"
            >
              Redefining Digital Wealth with{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#f97316] to-[#fbbf24]">
                Immutable Governance
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-[#f5f5f5]/80 max-w-2xl mx-auto font-sans"
            >
              Bitcoin-native infrastructure for sovereign finance and
              generational preservation.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#f97316] text-white shadow-lg shadow-[#f97316]/20 transition-all duration-300 transform hover:scale-105 font-sans"
              >
                Launch Platform
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-[#f5f5f5]/20 text-[#f5f5f5] hover:bg-[#f5f5f5]/5 transition-all duration-300 font-sans"
              >
                Learn More
              </Button>
            </motion.div>
          </div>
        </div>
        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        >
          <span className="text-sm text-[#f5f5f5]/60 mb-2 font-sans">
            Scroll to explore
          </span>
          <div className="w-6 h-10 border-2 border-[#f5f5f5]/20 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-[#f97316] rounded-full animate-bounce mt-2"></div>
          </div>
        </motion.div>
      </motion.section>

      {/* ABOUT SECTION (Replacing the SVG with a 1:1 image) */}
      <section
        ref={(el: HTMLElement | null) => {
          sectionsRef.current.about = el;
        }}
        className="relative py-20 md:py-32"
      >
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            {/* Replace the old SVG container with a 1:1 image */}
            <div className="relative order-2 lg:order-1 mx-auto w-full max-w-sm md:max-w-md lg:max-w-lg aspect-square">
              <div className="absolute inset-0 bg-[#111111] rounded-2xl overflow-hidden border border-[#222222]">
                <img
                  src="/BTCImage.png"
                  alt="A futuristic Bitcoin mountain concept"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Text content remains the same */}
            <div className="space-y-6 order-1 lg:order-2">
              <div className="inline-block px-3 py-1 rounded-full bg-[#f97316]/10 text-[#f97316] text-sm font-sans font-medium mb-2 border border-[#f97316]/20">
                Our Mission
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold tracking-tight">
                Preserving generational wealth through{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#f97316] to-[#fbbf24]">
                  Bitcoin
                </span>{" "}
                and trustless systems
              </h2>
              <p className="text-lg text-[#f5f5f5]/80 font-sans">
                At Melling Holdings Group, we believe in the power of immutable
                systems to protect and grow wealth across generations. Our
                approach combines the security of Bitcoin with innovative
                governance structures that eliminate trust requirements.
              </p>
              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-6 w-6 rounded-full bg-[#f97316]/10 flex items-center justify-center">
                    <ChevronRight className="h-4 w-4 text-[#f97316]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-medium">
                      Sovereign Wealth Preservation
                    </h3>
                    <p className="text-[#f5f5f5]/70 font-sans">
                      Protecting assets from inflation, confiscation, and
                      third-party risk through Bitcoin-native solutions.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-6 w-6 rounded-full bg-[#f97316]/10 flex items-center justify-center">
                    <ChevronRight className="h-4 w-4 text-[#f97316]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-medium">
                      Immutable Governance
                    </h3>
                    <p className="text-[#f5f5f5]/70 font-sans">
                      Creating systems that operate with mathematical certainty,
                      not human promises.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-6 w-6 rounded-full bg-[#f97316]/10 flex items-center justify-center">
                    <ChevronRight className="h-4 w-4 text-[#f97316]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-medium">
                      Generational Planning
                    </h3>
                    <p className="text-[#f5f5f5]/70 font-sans">
                      Building wealth structures designed to last centuries, not
                      quarters.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section
        ref={(el: HTMLElement | null) => {
          sectionsRef.current.solutions = el;
        }}
        className="relative py-20 md:py-32 bg-[#0a0a0a]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.05),transparent_50%)]"></div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-[#f97316]/10 text-[#f97316] text-sm font-sans font-medium mb-4 border border-[#f97316]/20">
              Our Solutions
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold tracking-tight">
              Bitcoin-Native Financial Infrastructure
            </h2>
            <p className="mt-4 text-lg text-[#f5f5f5]/80 max-w-2xl mx-auto font-sans">
              We build systems that leverage Bitcoin&apos;s security and
              immutability to create financial infrastructure that can&apos;t be
              compromised.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <Shield className="h-10 w-10" />,
                title: "Sovereign Custody",
                description:
                  "Multi-signature Bitcoin vaults with inheritance planning and disaster recovery built in.",
                features: [
                  "Collaborative custody",
                  "Inheritance planning",
                  "Geographic distribution",
                ],
              },
              {
                icon: <Lock className="h-10 w-10" />,
                title: "Immutable Governance",
                description:
                  "Cryptographic governance systems that enforce rules without requiring trust in operators.",
                features: [
                  "Time-locked contracts",
                  "Multi-party approvals",
                  "Transparent operations",
                ],
              },
              {
                icon: <Globe className="h-10 w-10" />,
                title: "Bitcoin Asset Infrastructure",
                description:
                  "Secure infrastructure for Bitcoin-based financial operations and asset management.",
                features: [
                  "Institutional-grade security",
                  "Automated operations",
                  "Regulatory compliance",
                ],
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                ),
                title: "Global Trustless Access",
                description:
                  "Borderless financial operations secured by Bitcoin and accessible from anywhere.",
                features: [
                  "Jurisdiction-agnostic",
                  "24/7 operations",
                  "Censorship-resistant",
                ],
              },
            ].map((solution, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-gradient-to-b from-[#111111] to-[#0a0a0a] rounded-2xl p-1 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#f97316]/10 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
                <Card className="border-0 bg-[#0f0f0f] h-full rounded-2xl overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="h-12 w-12 rounded-xl bg-[#f97316]/10 flex items-center justify-center mb-4 text-[#f97316]">
                      {solution.icon}
                    </div>
                    <CardTitle className="text-xl font-serif font-bold">
                      {solution.title}
                    </CardTitle>
                    <CardDescription className="text-[#f5f5f5]/70 text-base font-sans">
                      {solution.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {solution.features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-[#f5f5f5]/80 font-sans"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-[#f97316]"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="ghost"
                      className="p-0 text-[#f97316] hover:text-[#f97316] hover:bg-transparent group-hover:translate-x-1 transition-transform duration-300 font-sans"
                    >
                      Learn more <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Governance Showcase */}
      <section
        ref={(el: HTMLElement | null) => {
          sectionsRef.current.governance = el;
        }}
        className="relative py-20 md:py-32 bg-[#0a0a0a]"
      >
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-[#f97316]/10 text-[#f97316] text-sm font-sans font-medium mb-4 border border-[#f97316]/20">
              Immutable Governance
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold tracking-tight">
              Write Once,{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#f97316] to-[#fbbf24]">
                Immutable
              </span>{" "}
              Forever
            </h2>
            <p className="mt-4 text-lg text-[#f5f5f5]/80 max-w-2xl mx-auto font-sans">
              Our governance systems are designed to operate with mathematical
              certainty, not human promises.
            </p>
          </div>
          {/* Blockchain-style Timeline */}
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-[#f97316] to-[#0a0a0a]"></div>
            {[
              {
                title: "Cryptographic Rules",
                description:
                  "Rules encoded in Bitcoin scripts that cannot be altered once deployed.",
                icon: <Lock className="h-6 w-6" />,
                date: "Block 700,000",
              },
              {
                title: "Transparent Verification",
                description:
                  "All operations are publicly verifiable on the Bitcoin blockchain.",
                icon: <ExternalLink className="h-6 w-6" />,
                date: "Block 710,000",
              },
              {
                title: "Time-Locked Controls",
                description:
                  "Governance actions that require predetermined time delays for security.",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                ),
                date: "Block 720,000",
              },
              {
                title: "Multi-Party Consensus",
                description:
                  "Critical actions require approval from multiple independent parties.",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                ),
                date: "Block 730,000",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className={`relative flex items-center gap-8 mb-16 ${
                  index % 2 === 0 ? "flex-row-reverse text-right" : ""
                }`}
              >
                <div className="flex-1">
                  <div
                    className={cn(
                      "bg-[#111111] border border-[#222222] p-6 rounded-xl relative group",
                      index % 2 === 0
                        ? "rounded-tr-none before:absolute before:top-0 before:right-0 before:border-l-[20px] before:border-l-transparent before:border-t-[20px] before:border-t-[#f97316]/30"
                        : "rounded-tl-none before:absolute before:top-0 before:left-0 before:border-r-[20px] before:border-r-transparent before:border-t-[20px] before:border-t-[#f97316]/30"
                    )}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#f97316]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    <div className="text-xs text-[#f97316]/70 mb-1 font-sans">
                      {item.date}
                    </div>
                    <h3 className="text-xl font-serif font-bold mb-2">
                      {item.title}
                    </h3>
                    <p className="text-[#f5f5f5]/70 font-sans">
                      {item.description}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 p-0 text-[#f97316] hover:text-[#f97316] hover:bg-transparent group-hover:translate-x-1 transition-transform duration-300 font-sans"
                    >
                      View Documentation{" "}
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                  <div className="h-12 w-12 rounded-full bg-[#0f0f0f] border-2 border-[#f97316] flex items-center justify-center text-[#f97316]">
                    {item.icon}
                  </div>
                </div>
                <div className="flex-1"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        ref={(el: HTMLElement | null) => {
          sectionsRef.current.testimonials = el;
        }}
        className="relative py-20 md:py-32 bg-[#0a0a0a] overflow-hidden"
      >
        {/* Subtle radial bg */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.05),transparent_70%)]"></div>
        {/* Animated Bitcoin Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="relative h-full w-full">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Bitcoin
                className="h-96 w-96 text-[#f97316] animate-spin"
                style={{ animationDuration: "30s" }}
              />
            </div>
          </div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-block px-3 py-1 rounded-full bg-[#f97316]/10 text-[#f97316] text-sm font-sans font-medium mb-2 border border-[#f97316]/20">
              Our Values
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold tracking-tight">
              Building for the{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#f97316] to-[#fbbf24]">
                Long Term
              </span>
            </h2>

            {/* Testimonials */}
            <div className="mt-12">
              {/* MOBILE Carousel (hide on md+) */}
              <div className="md:hidden">
                <div className="flex gap-6 py-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                  {[
                    {
                      quote:
                        "In a world of constant change, we build systems that remain unchanged...",
                      name: "Alexander Melling",
                      title: "Founder & CEO",
                    },
                    {
                      quote:
                        "Melling Holdings Group has revolutionized how we think about long-term Bitcoin custody...",
                      name: "Sarah Johnson",
                      title: "Director, Quantum Family Office",
                    },
                    {
                      quote:
                        "The technical implementation of their Bitcoin custody solution is unparalleled...",
                      name: "Michael Chen",
                      title: "CTO, Digital Asset Trust",
                    },
                  ].map((testimonial, index) => (
                    <div
                      key={index}
                      className="snap-center w-[320px] flex-shrink-0"
                    >
                      <div className="relative p-8 bg-[#111111] rounded-2xl border border-[#222222] group hover:border-[#f97316]/30 transition-colors duration-300">
                        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                          <div className="h-10 w-10 rounded-full bg-[#0f0f0f] border-2 border-[#f97316] flex items-center justify-center text-[#f97316]">
                            {/* Comment icon */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                          </div>
                        </div>
                        <blockquote className="text-xl italic text-[#f5f5f5]/90 font-serif">
                          “{testimonial.quote}”
                        </blockquote>
                        <div className="mt-4 text-[#f5f5f5]/70">
                          <p className="font-medium font-serif">
                            {testimonial.name}
                          </p>
                          <p className="text-sm font-sans">
                            {testimonial.title}
                          </p>
                        </div>
                        <div className="flex justify-center mt-4">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="#f97316"
                              className="mx-0.5"
                            >
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* DESKTOP Grid (hide on mobile) */}
              <div className="hidden md:grid grid-cols-3 gap-6">
                {[
                  {
                    quote:
                      "In a world of constant change, we build systems that remain unchanged...",
                    name: "Alexander Melling",
                    title: "Founder & CEO",
                  },
                  {
                    quote:
                      "Melling Holdings Group has revolutionized how we think about long-term Bitcoin custody...",
                    name: "Sarah Johnson",
                    title: "Director, Quantum Family Office",
                  },
                  {
                    quote:
                      "The technical implementation of their Bitcoin custody solution is unparalleled...",
                    name: "Michael Chen",
                    title: "CTO, Digital Asset Trust",
                  },
                ].map((testimonial, index) => (
                  <div
                    key={index}
                    className="relative p-8 bg-[#111111] rounded-2xl border border-[#222222] group hover:border-[#f97316]/30 transition-colors duration-300"
                  >
                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                      <div className="h-10 w-10 rounded-full bg-[#0f0f0f] border-2 border-[#f97316] flex items-center justify-center text-[#f97316]">
                        {/* Comment icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </div>
                    </div>
                    <blockquote className="text-xl italic text-[#f5f5f5]/90 font-serif">
                      “{testimonial.quote}”
                    </blockquote>
                    <div className="mt-4 text-[#f5f5f5]/70">
                      <p className="font-medium font-serif">
                        {testimonial.name}
                      </p>
                      <p className="text-sm font-sans">{testimonial.title}</p>
                    </div>
                    <div className="flex justify-center mt-4">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="#f97316"
                          className="mx-0.5"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Extra values grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {[
                {
                  title: "Sovereignty",
                  description:
                    "We believe in individual financial sovereignty above all else.",
                },
                {
                  title: "Immutability",
                  description:
                    "What is written cannot be changed. What is promised must be delivered.",
                },
                {
                  title: "Transparency",
                  description:
                    "All operations are publicly verifiable and mathematically certain.",
                },
              ].map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-[#111111] border border-[#222222] p-6 rounded-xl hover:border-[#f97316]/30 transition-colors duration-300"
                >
                  <h3 className="text-lg font-serif font-bold mb-2 text-[#f97316]">
                    {value.title}
                  </h3>
                  <p className="text-[#f5f5f5]/70 font-sans">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 md:py-32 bg-[#0a0a0a]">
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl bg-gradient-to-r from-[#0f0f0f] via-[#111111] to-[#0f0f0f] p-8 md:p-12 relative overflow-hidden border border-[#222222]"
          >
            <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-[#f97316]/10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-64 w-64 rounded-full bg-[#f97316]/5 blur-3xl"></div>
            <div className="relative">
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">
                  Join the Future of Sovereign Bitcoin Finance
                </h2>
                <p className="text-lg text-[#f5f5f5]/80 font-sans">
                  Build your legacy on trustless, immutable infrastructure
                  designed for generational wealth preservation.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#f97316] text-white shadow-lg shadow-[#f97316]/20 transition-all duration-300 transform hover:scale-105 font-sans"
                  >
                    Book a Consultation
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-[#f5f5f5]/20 text-[#f5f5f5] hover:bg-[#f5f5f5]/5 transition-all duration-300 font-sans"
                  >
                    See How it Works
                  </Button>
                </div>
                <div className="mt-8 max-w-md mx-auto">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="px-4 py-3 bg-[#ffffff10] border border-[#ffffff20] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]/50 text-white font-sans w-full"
                    />
                    <Button className="bg-[#f97316] hover:bg-[#ea580c] text-white font-sans whitespace-nowrap">
                      Join Waitlist
                    </Button>
                  </div>
                  <p className="text-xs text-[#f5f5f5]/50 mt-2 font-sans">
                    By signing up, you agree to our{" "}
                    <Link href="#" className="underline hover:text-[#f97316]">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="underline hover:text-[#f97316]">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[#222222] bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Logo + Intro */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="relative h-8 w-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#f97316] to-[#ea580c] rounded-full opacity-70 blur-[2px]"></div>
                  <div className="absolute inset-0.5 bg-[#0a0a0a] rounded-full flex items-center justify-center">
                    <Bitcoin className="h-5 w-5 text-[#f97316]" />
                  </div>
                </div>
                <span className="text-lg font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#f97316] to-[#fbbf24]">
                  Melling Holdings Group
                </span>
              </div>
              <p className="text-sm text-[#f5f5f5]/70 max-w-xs font-sans">
                Preserving generational wealth through Bitcoin and trustless
                systems designed for the sovereign individual.
              </p>
              <div className="mt-6">
                <p className="text-sm italic text-[#f5f5f5]/50 font-serif">
                  "Write Once, Immutable Forever"
                </p>
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="font-serif font-medium mb-4 text-[#f5f5f5]">
                Company
              </h3>
              <ul className="space-y-3">
                {["About Us", "Our Team", "Careers", "Press", "Blog"].map(
                  (item, index) => (
                    <li key={index}>
                      <Link
                        href="#"
                        className="text-sm font-sans text-[#f5f5f5]/70 hover:text-[#f97316] transition-colors relative group"
                      >
                        {item}
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#f97316] transition-all duration-300 group-hover:w-full"></span>
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Solutions Links */}
            <div>
              <h3 className="font-serif font-medium mb-4 text-[#f5f5f5]">
                Solutions
              </h3>
              <ul className="space-y-3">
                {[
                  "Sovereign Custody",
                  "Immutable Governance",
                  "Bitcoin Asset Infrastructure",
                  "Global Trustless Access",
                  "Enterprise Solutions",
                ].map((item, index) => (
                  <li key={index}>
                    <Link
                      href="#"
                      className="text-sm font-sans text-[#f5f5f5]/70 hover:text-[#f97316] transition-colors relative group"
                    >
                      {item}
                      <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#f97316] transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact + Socials */}
            <div>
              <h3 className="font-serif font-medium mb-4 text-[#f5f5f5]">
                Connect
              </h3>
              <ul className="space-y-3 font-sans">
                <li className="text-sm text-[#f5f5f5]/70">
                  123 Financial District
                </li>
                <li className="text-sm text-[#f5f5f5]/70">
                  New York, NY 10004
                </li>
                <li>
                  <Link
                    href="mailto:contact@mellinggroup.com"
                    className="text-sm text-[#f5f5f5]/70 hover:text-[#f97316] transition-colors"
                  >
                    contact@mellinggroup.com
                  </Link>
                </li>
                <li>
                  <Link
                    href="tel:+15551234567"
                    className="text-sm text-[#f5f5f5]/70 hover:text-[#f97316] transition-colors"
                  >
                    +1 (555) 123-4567
                  </Link>
                </li>
              </ul>
              <div className="flex gap-4 mt-6">
                {[
                  {
                    label: "Twitter",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                      </svg>
                    ),
                  },
                  {
                    label: "GitHub",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                        <path d="M9 18c-4.51 2-5-2-7-2"></path>
                      </svg>
                    ),
                  },
                  {
                    label: "LinkedIn",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect x="2" y="9" width="4" height="12"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                      </svg>
                    ),
                  },
                  {
                    label: "Telegram",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m22 2-7 20-4-9-9-4Z"></path>
                        <path d="M22 2 11 13"></path>
                      </svg>
                    ),
                  },
                ].map((social, index) => (
                  <Link
                    key={index}
                    href="#"
                    aria-label={social.label}
                    className="text-[#f5f5f5]/70 hover:text-[#f97316] transition-colors p-2 rounded-full hover:bg-[#f97316]/10"
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Legal Line */}
          <div className="mt-12 pt-6 border-t border-[#222222]">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-[#f5f5f5]/50 font-sans">
                © {new Date().getFullYear()} Melling Holdings Group. All rights
                reserved.
              </p>
              <div className="flex gap-6 mt-4 md:mt-0">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                  (item, index) => (
                    <Link
                      key={index}
                      href="#"
                      className="text-sm font-sans text-[#f5f5f5]/50 hover:text-[#f97316] transition-colors"
                    >
                      {item}
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom CSS for animations and fonts */}
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

        /* Example substituting your fonts */
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
