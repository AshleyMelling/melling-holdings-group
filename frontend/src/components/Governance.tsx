"use client";

import { motion } from "framer-motion";
import GovernanceEventCard from "./GovernanceEventCard";
import { Lock, ExternalLink } from "lucide-react";
import { forwardRef } from "react";

const Governance = forwardRef<HTMLElement>((_, ref) => {
  const events = [
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
  ];

  return (
    <section ref={ref} className="relative py-20 md:py-32 bg-[#0a0a0a]">
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

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-[#f97316] to-[#0a0a0a]" />
          {events.map((event, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
            >
              <GovernanceEventCard
                title={event.title}
                description={event.description}
                icon={event.icon}
                date={event.date}
                alignRight={i % 2 === 0}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

Governance.displayName = "Governance";

export default Governance;
