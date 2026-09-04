"use client";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const line1Ref = useRef<HTMLHeadingElement | null>(null);
  const pillRef = useRef<HTMLDivElement | null>(null);
  const line2Ref = useRef<HTMLHeadingElement | null>(null);
  const line3Ref = useRef<HTMLHeadingElement | null>(null);
  const subtextRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          allowMotion: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { reduceMotion } = context.conditions as { reduceMotion: boolean };

          if (reduceMotion) {
            gsap.set([line1Ref.current, pillRef.current, line2Ref.current, line3Ref.current, subtextRef.current], {
              autoAlpha: 1,
              y: 0,
            });
            return;
          }

          // 1. Entrance Timeline
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

          tl.fromTo(
            line1Ref.current,
            { autoAlpha: 0, y: 60, scale: 0.95 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 1, delay: 0.1 }
          )
            .fromTo(
              pillRef.current,
              { autoAlpha: 0, scale: 0.8, y: 20 },
              { autoAlpha: 1, scale: 1, y: 0, duration: 0.7, ease: "back.out(1.8)" },
              "-=0.6"
            )
            .fromTo(
              line2Ref.current,
              { autoAlpha: 0, y: 50 },
              { autoAlpha: 1, y: 0, duration: 0.9 },
              "-=0.5"
            )
            .fromTo(
              line3Ref.current,
              { autoAlpha: 0, y: 50 },
              { autoAlpha: 1, y: 0, duration: 0.9 },
              "-=0.6"
            )
            .fromTo(
              subtextRef.current,
              { autoAlpha: 0, y: 30 },
              { autoAlpha: 1, y: 0, duration: 0.8 },
              "-=0.4"
            );

          // 2. ScrollTrigger Parallax Scrub on scroll down
          gsap.to(line1Ref.current, {
            yPercent: -20,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });

          gsap.to(line2Ref.current, {
            yPercent: -12,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });

          gsap.to(line3Ref.current, {
            yPercent: -8,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        },
        containerRef
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="w-full flex flex-col items-center justify-center text-center select-none pt-12 md:pt-16 pb-12 overflow-hidden"
    >
      {/* 1. LIGHT */}
      <h1
        ref={line1Ref}
        className="text-[clamp(3.8rem,15vw,10.5rem)] font-satoshi font-black leading-[0.88] tracking-tight uppercase text-[#111111] opacity-0 will-change-transform"
      >
        LIGHT
      </h1>

      {/* 2. Asterisk & AUTOMATED STUDIO pill */}
      <div
        ref={pillRef}
        className="flex items-center justify-center gap-3 sm:gap-6 my-2 sm:my-3 opacity-0 will-change-transform"
      >
        <span className="text-2xl sm:text-4xl font-light text-[#666666]">*</span>
        <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-1 sm:py-1.5 border border-[#111111]/40 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider bg-[#E4E3DE] shadow-xs hover:border-[#2355FC] hover:scale-105 transition-all cursor-default">
          <span className="w-2 h-2 rounded-full bg-[#2355FC] animate-pulse"></span>
          <span>AUTOMATED</span>
        </div>
        <span className="text-xs sm:text-sm uppercase tracking-widest font-mono text-[#666666]">
          STUDIO
        </span>
      </div>

      {/* 3. MEETS MONO */}
      <h1
        ref={line2Ref}
        className="text-[clamp(2.8rem,12vw,8.5rem)] font-satoshi font-black leading-[0.9] tracking-tight uppercase text-[#111111] opacity-0 will-change-transform"
      >
        MEETS MONO
      </h1>

      {/* 4. PORTRAITURE */}
      <h1
        ref={line3Ref}
        className="text-[clamp(3.2rem,13.5vw,9.8rem)] font-satoshi font-black leading-[0.88] tracking-tight uppercase text-[#111111] opacity-0 will-change-transform"
      >
        PORTRAITURE
      </h1>

      {/* Subtext description */}
      <p
        ref={subtextRef}
        className="mt-8 text-xs sm:text-sm uppercase tracking-widest font-mono text-[#666666] max-w-2xl px-4 leading-relaxed opacity-0 will-change-transform"
      >
        PRE-SET ARCHITECTURAL LIGHTING &bull; NO OPERATOR. NO INTIMIDATION. &bull; INSTANT 300-DPI ARCHIVAL PRINTS.
      </p>
    </section>
  );
};
