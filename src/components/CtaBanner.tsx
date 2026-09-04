"use client";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface CtaBannerProps {
  videoUrl?: string;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({
  videoUrl = "/KROMA.mp4",
}) => {
  const outerWrapperRef = useRef<HTMLDivElement | null>(null);
  const pinContentRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const outer = outerWrapperRef.current;
    const pinContent = pinContentRef.current;
    const card = cardRef.current;
    if (!outer || !pinContent || !card) return;

    const ctx = gsap.context(() => {
      // Pin the inner wrapper while using the outer container as trigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outer,
          pin: pinContent,
          start: "top top",
          end: "+=120%",
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(card, {
        scale: 2.6,
        borderRadius: "0px",
        ease: "power2.inOut",
      });
    }, outerWrapperRef);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={outerWrapperRef} className="w-full relative bg-[#E4E3DE]">
      {/* Pinned Inner Container */}
      <div
        ref={pinContentRef}
        className="w-full min-h-screen flex items-center justify-center relative overflow-hidden py-12"
      >
        {/* Pure & Clean Cinematic Video Card that Zooms In on Scroll */}
        <div
          ref={cardRef}
          className="w-[90%] max-w-[1240px] aspect-[16/9] sm:aspect-[21/9] bg-[#111111] rounded-[28px] overflow-hidden shadow-2xl relative will-change-transform flex items-center justify-center border border-[#111111]/20"
        >
          {/* The Full Video (100% Polos, Tanpa Teks / Badge Sudut) */}
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            src={videoUrl}
            className="w-full h-full object-cover object-center pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
};
