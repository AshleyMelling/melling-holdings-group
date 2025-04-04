"use client";

import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { forwardRef } from "react";

const About = forwardRef<HTMLElement>((_, ref) => {
  return (
    <section ref={ref} className="relative py-20 md:py-32">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Image Section */}
          <div className="relative order-2 lg:order-1 mx-auto w-full max-w-sm md:max-w-md lg:max-w-lg aspect-square">
            <div className="absolute inset-0 bg-[#111111] rounded-2xl overflow-hidden border border-[#222222]">
              <img
                src="/BTCImage.gif"
                alt="A futuristic Bitcoin mountain concept"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Text Content */}
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
              {[
                {
                  title: "Sovereign Wealth Preservation",
                  description:
                    "Protecting assets from inflation, confiscation, and third-party risk through Bitcoin-native solutions.",
                },
                {
                  title: "Immutable Governance",
                  description:
                    "Creating systems that operate with mathematical certainty, not human promises.",
                },
                {
                  title: "Generational Planning",
                  description:
                    "Building wealth structures designed to last centuries, not quarters.",
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1 h-6 w-6 rounded-full bg-[#f97316]/10 flex items-center justify-center">
                    <ChevronRight className="h-4 w-4 text-[#f97316]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-medium">
                      {item.title}
                    </h3>
                    <p className="text-[#f5f5f5]/70 font-sans">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

About.displayName = "About";

export default About;
