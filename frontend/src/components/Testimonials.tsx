"use client";

import { motion } from "framer-motion";
import TestimonialCard from "./TestimonialCard";
import { forwardRef } from "react";

const Testimonials = forwardRef<HTMLElement>((_, ref) => {
  const testimonials = [
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
  ];

  const values = [
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
  ];

  return (
    <section
      ref={ref}
      className="relative py-20 md:py-32 bg-[#0a0a0a] overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.05),transparent_70%)]" />
      <div className="absolute inset-0 opacity-5 flex items-center justify-center">
        <svg
          className="h-96 w-96 text-[#f97316] animate-spin"
          style={{ animationDuration: "30s" }}
        >
          <use href="#bitcoin" />
        </svg>
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

          {/* Testimonials - Mobile Carousel */}
          <div className="mt-12 md:hidden">
            <div className="flex gap-6 py-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="snap-center w-[320px] flex-shrink-0"
                >
                  <TestimonialCard {...testimonial} />
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials - Desktop Grid */}
          <div className="hidden md:grid grid-cols-3 gap-6 mt-12">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {values.map((value, index) => (
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
  );
});

Testimonials.displayName = "Testimonials";

export default Testimonials;
