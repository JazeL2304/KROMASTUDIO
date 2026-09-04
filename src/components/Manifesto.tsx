"use client";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const Manifesto: React.FC = () => {
  const containerRef = useRef<HTMLElement | null>(null);
  const tagRef = useRef<HTMLParagraphElement | null>(null);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const lines = [
    "Every detail is deliberate.",
    "We craft editorial portraits.",
    "Your persona. Our architecture.",
    "Nothing left to chance.",
    "Only pure contrast.",
  ];

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // 1. Tag reveal
      gsap.fromTo(
        tagRef.current,
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 2. Lines staggered reveal
      gsap.fromTo(
        lineRefs.current,
        { autoAlpha: 0.15, y: 30, filter: "blur(4px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          stagger: 0.18,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 70%",
            end: "bottom 60%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="py-20 sm:py-32 border-b border-[#D0CFCA] text-center max-w-3xl mx-auto px-5"
    >
      <p
        ref={tagRef}
        className="text-xs font-mono uppercase tracking-widest text-[#666666] mb-6 opacity-0"
      >
        01 / PHILOSOPHY &amp; MANIFESTO
      </p>
      <blockquote className="font-satoshi text-3xl sm:text-4xl md:text-5xl font-black leading-[1.18] tracking-tight text-[#111111] uppercase flex flex-col gap-2">
        <span
          ref={(el) => {
            lineRefs.current[0] = el;
          }}
          className="will-change-transform"
        >
          Every detail is deliberate.
        </span>
        <span
          ref={(el) => {
            lineRefs.current[1] = el;
          }}
          className="will-change-transform"
        >
          We craft <span className="underline decoration-2 md:decoration-3 underline-offset-6">editorial</span> portraits.
        </span>
        <span
          ref={(el) => {
            lineRefs.current[2] = el;
          }}
          className="will-change-transform"
        >
          Your persona. Our architecture.
        </span>
        <span
          ref={(el) => {
            lineRefs.current[3] = el;
          }}
          className="will-change-transform"
        >
          Nothing left to chance.
        </span>
        <span
          ref={(el) => {
            lineRefs.current[4] = el;
          }}
          className="will-change-transform"
        >
          Only <span className="underline decoration-2 md:decoration-3 underline-offset-6 text-[#2355FC] decoration-[#2355FC]">pure</span> contrast.
        </span>
      </blockquote>
    </section>
  );
};
