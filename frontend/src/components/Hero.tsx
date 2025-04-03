"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { forwardRef } from "react";

const Hero = forwardRef<HTMLElement>((_, ref) => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.05], [1, 0.98]);

  return (
    <motion.section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center pb-20 md:pb-32"
      style={{ opacity, scale }}
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
        <div className="mt-16 md:mt-40 max-w-4xl mx-auto text-center space-y-8">
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
            Bitcoin-native infrastructure for sovereign finance and generational
            preservation.
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
        className="fixed left-1/2 transform -translate-x-1/2 flex flex-col items-center bottom-[calc(env(safe-area-inset-bottom)+20px)] md:bottom-10 z-50"
      >
        <span className="text-sm text-[#f5f5f5]/60 mb-2 font-sans">
          Scroll to explore
        </span>
        <div className="w-6 h-10 border-2 border-[#f5f5f5]/20 rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-[#f97316] rounded-full animate-bounce mt-2"></div>
        </div>
      </motion.div>
    </motion.section>
  );
});

Hero.displayName = "Hero";

export default Hero;
