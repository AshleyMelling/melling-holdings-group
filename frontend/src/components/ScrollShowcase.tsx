"use client"; // For Next.js App Router

import React, { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import "./ScrollShowcase.css";

export default function ScrollShowcase() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Always run GSAP fallback animations:
    const items = gsap.utils.toArray<HTMLElement>("ul li");

    // Set initial opacity: first item fully visible, others dimmed
    gsap.set(items, { opacity: (i) => (i === 0 ? 1 : 0.2) });

    // Create a fade timeline: brighten items one-by-one then dim earlier ones
    const fadeTl = gsap
      .timeline()
      .to(items.slice(1), { opacity: 1, stagger: 0.5 })
      .to(items.slice(0, items.length - 1), { opacity: 0.2, stagger: 0.5 }, 0);

    ScrollTrigger.create({
      trigger: items[0],
      endTrigger: items[items.length - 1],
      start: "top center",
      end: "bottom center",
      animation: fadeTl,
      scrub: 0.2,
    });

    // Create a hue timeline: tween custom CSS property --hue from 0 to 360
    const hueTl = gsap.fromTo(
      document.documentElement,
      { "--hue": 0 },
      { "--hue": 360, ease: "none" }
    );

    ScrollTrigger.create({
      trigger: items[0],
      endTrigger: items[items.length - 1],
      start: "top center",
      end: "bottom center",
      animation: hueTl,
      scrub: 0.2,
    });
  }, []);

  return (
    <>
      <header>
        <h1 className="fluid">
          you can
          <br />
          scroll.
        </h1>
      </header>
      <main>
        <section className="content fluid">
          <h2>
            <span aria-hidden="true">you can&nbsp;</span>
            <span className="sr-only">you can ship things.</span>
          </h2>
          <ul
            aria-hidden="true"
            style={{ "--count": 22 } as React.CSSProperties}
          >
            {[
              "design.",
              "prototype.",
              "solve.",
              "build.",
              "develop.",
              "debug.",
              "learn.",
              "cook.",
              "ship.",
              "prompt.",
              "collaborate.",
              "create.",
              "inspire.",
              "follow.",
              "innovate.",
              "test.",
              "optimize.",
              "teach.",
              "visualize.",
              "transform.",
              "scale.",
              "do it.",
            ].map((word, i) => (
              <li key={i} style={{ "--i": i } as React.CSSProperties}>
                {word}
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="fluid">fin.</h2>
        </section>
      </main>
      <footer>ʕ⊙ᴥ⊙ʔ jh3yy &copy; 2024</footer>
      <a
        className="bear-link"
        href="https://twitter.com/intent/follow?screen_name=jh3yy"
        target="_blank"
        rel="noreferrer noopener"
      >
        <svg
          className="w-9"
          viewBox="0 0 969 955"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="161.191"
            cy="320.191"
            r="133.191"
            stroke="currentColor"
            strokeWidth="20"
          ></circle>
          <circle
            cx="806.809"
            cy="320.191"
            r="133.191"
            stroke="currentColor"
            strokeWidth="20"
          ></circle>
          <circle
            cx="695.019"
            cy="587.733"
            r="31.4016"
            fill="currentColor"
          ></circle>
          <circle
            cx="272.981"
            cy="587.733"
            r="31.4016"
            fill="currentColor"
          ></circle>
          <path
            d="M564.388 712.083C564.388 743.994 526.035 779.911 483.372 779.911C440.709 779.911 402.356 743.994 402.356 712.083C402.356 680.173 440.709 664.353 483.372 664.353C526.035 664.353 564.388 680.173 564.388 712.083Z"
            fill="currentColor"
          ></path>
          <rect
            x="310.42"
            y="448.31"
            width="343.468"
            height="51.4986"
            fill="#FF1E1E"
          ></rect>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M745.643 288.24C815.368 344.185 854.539 432.623 854.539 511.741H614.938V454.652C614.938 433.113 597.477 415.652 575.938 415.652H388.37C366.831 415.652 349.37 433.113 349.37 454.652V511.741L110.949 511.741C110.949 432.623 150.12 344.185 219.845 288.24C289.57 232.295 384.138 200.865 482.744 200.865C581.35 200.865 675.918 232.295 745.643 288.24Z"
            fill="currentColor"
          ></path>
        </svg>
      </a>
    </>
  );
}
