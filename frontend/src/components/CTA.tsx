"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="relative py-20 md:py-32 bg-[#0a0a0a]">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl bg-gradient-to-r from-[#0f0f0f] via-[#111111] to-[#0f0f0f] p-8 md:p-12 relative overflow-hidden border border-[#222222]"
        >
          {/* Glows */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-[#f97316]/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-64 w-64 rounded-full bg-[#f97316]/5 blur-3xl"></div>

          {/* Content */}
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
  );
}
