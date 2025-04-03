"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Globe } from "lucide-react";
import SolutionCard from "@/components/SolutionCard";
import { forwardRef } from "react";

const Solutions = forwardRef<HTMLElement>((_, ref) => {
  const solutionData = [
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
  ];

  return (
    <section ref={ref} className="relative py-20 md:py-32 bg-[#0a0a0a]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.05),transparent_50%)]" />
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
          {solutionData.map((solution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <SolutionCard {...solution} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

Solutions.displayName = "Solutions";

export default Solutions;
