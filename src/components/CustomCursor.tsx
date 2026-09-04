"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const followerRef = useRef<HTMLDivElement | null>(null);
  const [hovered, setHovered] = useState<boolean>(false);
  const [hoverText, setHoverText] = useState<string>("");

  useEffect(() => {
    // Only run on desktop/devices with fine pointer
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    const xTo = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "power3" });
    const followerX = gsap.quickTo(follower, "x", { duration: 0.35, ease: "power3" });
    const followerY = gsap.quickTo(follower, "y", { duration: 0.35, ease: "power3" });

    const handleMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      followerX(e.clientX);
      followerY(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveEl = target.closest("button, a, input, select, textarea, [data-cursor]");
      if (interactiveEl) {
        setHovered(true);
        const customText = interactiveEl.getAttribute("data-cursor") || "";
        setHoverText(customText);
      } else {
        setHovered(false);
        setHoverText("");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <>
      {/* Tiny Point Cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#2355FC] rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
      />

      {/* Viewfinder Circle Follower */}
      <div
        ref={followerRef}
        className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[9998] transition-[width,height,border-color,background-color] duration-300 hidden md:flex items-center justify-center rounded-full border ${
          hovered
            ? "w-14 h-14 border-[#2355FC] bg-[#2355FC]/10 backdrop-blur-xs scale-110"
            : "w-8 h-8 border-[#111111]/40 border-dashed"
        }`}
      >
        {hoverText && (
          <span className="font-mono text-[9px] uppercase font-bold text-[#2355FC] tracking-widest text-center px-1">
            {hoverText}
          </span>
        )}
      </div>
    </>
  );
};
