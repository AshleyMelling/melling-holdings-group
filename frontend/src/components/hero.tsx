"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function Hero() {
  return (
    <section className="relative w-full min-h-[80vh] flex items-center justify-center px-4 text-center z-10">
      <Card className="backdrop-blur-2xl bg-card/50 border border-border shadow-xl rounded-xl p-10 max-w-2xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground">
          <span className="text-primary">
            Melling&#8203;Holdings&#8203;Group
          </span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground">
          A modern Bitcoin-first business. Built on trust, transparency, and
          proof-of-holdings.
        </p>
      </Card>
    </section>
  );
}
