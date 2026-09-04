"use client";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface LayeredScrollContainerProps {
  children: React.ReactNode;
}

export const LayeredScrollContainer: React.FC<LayeredScrollContainerProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isDesktop, reduceMotion } = context.conditions as {
            isDesktop: boolean;
            reduceMotion: boolean;
          };

          if (!isDesktop || reduceMotion) return;

          const panels = gsap.utils.toArray<HTMLElement>(".editorial-layer-panel");
          if (panels.length <= 1) return;

          // 1. Layered Overlap: Each subsequent panel slides up over the previous pinned panel
          panels.forEach((panel, i) => {
            // Pin the current panel while the next one overlaps it
            if (i < panels.length - 1) {
              ScrollTrigger.create({
                trigger: panel,
                start: "top top",
                end: "bottom top",
                pin: true,
                pinSpacing: false,
              });
            }

            // The incoming panel slides up from yPercent: 100 to yPercent: 0
            if (i > 0) {
              gsap.fromTo(
                panel,
                {
                  yPercent: 100,
                  boxShadow: "0 -25px 60px rgba(0,0,0,0.12)",
                },
                {
                  yPercent: 0,
                  ease: "none",
                  scrollTrigger: {
                    trigger: panel,
                    start: "top bottom",
                    end: "top top",
                    scrub: 1,
                  },
                }
              );
            }
          });

          // 2. Global Viewport Snapping
          ScrollTrigger.create({
            trigger: container,
            start: "top top",
            end: "bottom bottom",
            snap: {
              snapTo: 1 / (panels.length - 1),
              duration: { min: 0.25, max: 0.6 },
              delay: 0.1,
              ease: "power2.inOut",
            },
          });
        },
        containerRef
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      {children}
    </div>
  );
};
