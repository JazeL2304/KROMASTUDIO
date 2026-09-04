import React from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { CtaBanner } from "@/components/CtaBanner";
import { MarqueeTicker } from "@/components/MarqueeTicker";
import { Manifesto } from "@/components/Manifesto";
import { Packages } from "@/components/Packages";
import { InteractiveBooth } from "@/components/InteractiveBooth";
import { StudioArchitecture } from "@/components/StudioArchitecture";
import { ReserveSection } from "@/components/ReserveSection";
import { Footer } from "@/components/Footer";
import { CustomCursor } from "@/components/CustomCursor";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#E4E3DE] text-[#111111] antialiased selection:bg-[#2355FC] selection:text-white relative">
      {/* Interactive Viewfinder Camera Custom Cursor */}
      <CustomCursor />

      {/* 1. Header Navigation */}
      <Navbar />

      <main className="flex-grow flex flex-col items-center w-full">
        {/* 2. Massive Brutalist Hero */}
        <Hero />

        {/* Continuous GSAP Marquee Ticker */}
        <MarqueeTicker speed={28} />

        {/* 3. Electric Blue Action Banner (With Background Video & ScrollTrigger Zoom-In Screen Dive) */}
        <CtaBanner videoUrl="/KROMA.mp4" />

        {/* 4. Philosophy & Manifesto */}
        <Manifesto />

        {/* 5. Curated Sessions / Archive */}
        <Packages />

        {/* Secondary Reverse Marquee Ticker */}
        <MarqueeTicker
          speed={32}
          reverse={true}
          text={[
            "LIVE 3-SHOT SEQUENCE",
            "PHYSICAL 2X6 PRINT ENGINE",
            "KODAK TRI-X 400 EMULATION",
            "100% PRIVATE CLIENT-SIDE",
            "HIGH CONTRAST MONO",
          ]}
        />

        {/* 6. Interactive Booth Strip & Print Engine (Webcam + 2x6 Strip) */}
        <InteractiveBooth />

        {/* 7. Studio Architecture Specifications */}
        <StudioArchitecture />

        {/* 8. Studio Booking Reservation & Architectural Space */}
        <ReserveSection />
      </main>

      {/* 9. Monolithic Watermark Footer */}
      <Footer />
    </div>
  );
}
