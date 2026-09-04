"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";

type FrameFinish = "noir" | "stone" | "polar";
type FilterStyle = "contrast" | "tri-x" | "flash";

const DEFAULT_PORTRAITS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
];

export const InteractiveBooth: React.FC = () => {
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [activeShot, setActiveShot] = useState<number>(0);
  const [flashActive, setFlashActive] = useState<boolean>(false);

  const [photos, setPhotos] = useState<string[]>(DEFAULT_PORTRAITS);
  const [frameFinish, setFrameFinish] = useState<FrameFinish>("noir");
  const [filterStyle, setFilterStyle] = useState<FilterStyle>("contrast");
  const [enableGrain, setEnableGrain] = useState<boolean>(true);
  const [enableDateStamp, setEnableDateStamp] = useState<boolean>(true);
  const [stripTitle, setStripTitle] = useState<string>("KROMA.STUDIO");
  const [stripSerial, setStripSerial] = useState<number>(1092);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const stripContainerRef = useRef<HTMLDivElement | null>(null);
  const photoSlotRefs = useRef<(HTMLDivElement | null)[]>([]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Animate photo development when slot updates
  const triggerSlotDevelopment = useCallback((slotIdx: number) => {
    const el = photoSlotRefs.current[slotIdx];
    if (el) {
      gsap.fromTo(
        el,
        { scale: 1.06, autoAlpha: 0.4, filter: "brightness(2) contrast(150%)" },
        {
          scale: 1,
          autoAlpha: 1,
          filter: "brightness(1) contrast(100%)",
          duration: 0.75,
          ease: "power2.out",
          clearProps: "scale,autoAlpha,filter",
        }
      );
    }
  }, []);

  // Toggle Camera
  const toggleCamera = async () => {
    if (cameraActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setCameraActive(false);
      showToast("Camera feed disconnected");
    } else {
      try {
        showToast("Requesting webcam access...");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setCameraActive(true);
        showToast("Laptop camera connected successfully");
      } catch (err) {
        console.error("Camera error:", err);
        showToast("Could not access camera. Check browser permissions.");
      }
    }
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // Capture frame helper
  const captureCurrentFrame = useCallback((): string => {
    if (videoRef.current && cameraActive) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL("image/jpeg", 0.92);
      }
    }
    return DEFAULT_PORTRAITS[Math.floor(Math.random() * DEFAULT_PORTRAITS.length)];
  }, [cameraActive]);

  // Start 3-Shot Sequence with GSAP timing & sound
  const startPhotoSequence = async () => {
    if (isCapturing) return;
    if (!cameraActive) {
      await toggleCamera();
    }

    setIsCapturing(true);
    showToast("Starting 3-shot sequence. Get ready!");
    const newCaptured: string[] = [];

    for (let shot = 1; shot <= 3; shot++) {
      setActiveShot(shot);
      for (let count = 3; count >= 1; count--) {
        setCountdown(count);
        await new Promise((r) => setTimeout(r, 1000));
      }
      setCountdown(null);

      // Flash & Snap
      setFlashActive(true);
      const frameUrl = captureCurrentFrame();
      newCaptured.push(frameUrl);
      setPhotos([...newCaptured, ...DEFAULT_PORTRAITS.slice(newCaptured.length)]);
      triggerSlotDevelopment(shot - 1);

      await new Promise((r) => setTimeout(r, 350));
      setFlashActive(false);

      if (shot < 3) {
        await new Promise((r) => setTimeout(r, 800));
      }
    }

    setPhotos(newCaptured);
    setStripSerial(Math.floor(1000 + Math.random() * 9000));
    setIsCapturing(false);
    setActiveShot(0);
    showToast("Photo strip complete! Ready to print or download.");

    // Subtle gentle nudge animation on strip
    if (stripContainerRef.current) {
      gsap.fromTo(
        stripContainerRef.current,
        { y: -8 },
        { y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" }
      );
    }
  };

  // Handle local batch upload
  const handleBatchUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const maxFiles = Math.min(files.length, 3);
    const updated = [...photos];

    for (let i = 0; i < maxFiles; i++) {
      const reader = new FileReader();
      const slot = i;
      reader.onload = (event) => {
        if (event.target?.result) {
          updated[slot] = event.target.result as string;
          setPhotos([...updated]);
          triggerSlotDevelopment(slot);
        }
      };
      reader.readAsDataURL(files[i]);
    }
    showToast(`Loaded ${maxFiles} local photos into the strip.`);
  };

  // Download high-res PNG via Canvas
  const downloadStripImage = () => {
    showToast("Generating high-res strip PNG (300 DPI)...");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 1600;

    let bgColor = "#141414";
    let textColor = "#FFFFFF";
    let subTextColor = "#888888";
    let borderLineColor = "rgba(255,255,255,0.2)";

    if (frameFinish === "stone") {
      bgColor = "#C8C7BE";
      textColor = "#111111";
      subTextColor = "#555555";
      borderLineColor = "rgba(0,0,0,0.15)";
    } else if (frameFinish === "polar") {
      bgColor = "#FFFFFF";
      textColor = "#111111";
      subTextColor = "#666666";
      borderLineColor = "rgba(0,0,0,0.15)";
    }

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Top Brand Header
    ctx.fillStyle = subTextColor;
    ctx.font = 'bold 18px "Courier New", monospace';
    ctx.textAlign = "left";
    ctx.fillText("KROMA • LAB", 36, 55);

    ctx.textAlign = "right";
    ctx.font = '15px "Courier New", monospace';
    ctx.fillText(`STRIP #${stripSerial}`, 564, 55);

    // Top line
    ctx.strokeStyle = borderLineColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(36, 70);
    ctx.lineTo(564, 70);
    ctx.stroke();

    // 3 Photos
    const imgPromises = photos.map((src) => {
      return new Promise<HTMLImageElement>((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => {
          const fallback = new Image();
          fallback.src = DEFAULT_PORTRAITS[0];
          resolve(fallback);
        };
        img.src = src;
      });
    });

    Promise.all(imgPromises).then((loaded) => {
      const startY = 90;
      const photoH = 396;
      const gap = 24;

      loaded.forEach((img, idx) => {
        const py = startY + idx * (photoH + gap);
        ctx.save();
        ctx.beginPath();
        ctx.rect(36, py, 528, photoH);
        ctx.clip();

        if (enableGrain) {
          ctx.filter =
            filterStyle === "tri-x"
              ? "grayscale(100%) contrast(160%) brightness(90%)"
              : filterStyle === "flash"
              ? "grayscale(100%) contrast(180%) brightness(105%)"
              : "grayscale(100%) contrast(130%) brightness(95%)";
        } else {
          ctx.filter = "none";
        }

        ctx.drawImage(img, 36, py, 528, photoH);
        ctx.restore();

        // Border around photo
        ctx.strokeStyle = borderLineColor;
        ctx.strokeRect(36, py, 528, photoH);
      });

      // Bottom Metadata
      const footerY = 1380;
      ctx.textAlign = "center";
      ctx.fillStyle = textColor;
      ctx.font = "900 28px 'Satoshi', sans-serif";
      ctx.fillText(stripTitle.toUpperCase() || "KROMA.STUDIO", 300, footerY);

      if (enableDateStamp) {
        ctx.fillStyle = subTextColor;
        ctx.font = '14px "Courier New", monospace';
        const dateStr = new Date().toLocaleDateString("en-CA").replace(/-/g, ".");
        ctx.fillText(`${dateStr} • MONOCHROME 300DPI`, 300, footerY + 32);
      }

      // Barcode lines
      const barY = footerY + 54;
      const bars = [3, 1, 4, 2, 5, 2, 1, 4, 1, 3, 5, 1, 3, 2, 4];
      let curX = 220;
      ctx.fillStyle = textColor;
      bars.forEach((w) => {
        ctx.fillRect(curX, barY, w, 24);
        curX += w + 3;
      });

      // Export
      const link = document.createElement("a");
      link.download = `KROMA-STRIP-${stripSerial}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      showToast("Photo strip image downloaded successfully!");
    });
  };

  // Filter class for img
  const getImgFilterClass = () => {
    if (!enableGrain) return "";
    switch (filterStyle) {
      case "tri-x":
        return "mono-tri-x";
      case "flash":
        return "mono-flash";
      case "contrast":
      default:
        return "film-grain";
    }
  };

  // Strip background class
  const getStripContainerClasses = () => {
    switch (frameFinish) {
      case "stone":
        return "bg-[#C8C7BE] text-[#111111] border-black/15";
      case "polar":
        return "bg-white text-[#111111] border-black/15";
      case "noir":
      default:
        return "bg-[#141414] text-white border-black/30";
    }
  };

  return (
    <section id="booth-machine" className="py-16 md:py-24 border-b border-[#D0CFCA] max-w-[1400px] mx-auto px-5 sm:px-8 w-full scroll-mt-20 relative">
      {/* Flash overlay */}
      {flashActive && (
        <div className="fixed inset-0 bg-white pointer-events-none z-50 animate-flash"></div>
      )}

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#D0CFCA] gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#2355FC] font-bold">
            03 / LIVE ENGINE SIMULATOR
          </span>
          <h2 className="text-3xl sm:text-4xl font-satoshi font-black uppercase tracking-tight mt-1 text-[#111111]">
            INTERACTIVE BOOTH STRIP &amp; PRINT ENGINE
          </h2>
        </div>
        <p className="text-xs font-mono text-[#666666] uppercase max-w-sm">
          Experience the in-browser simulator. Take live photos with your laptop webcam, or pick custom local files, then preview, customize grain &amp; print your 2x6 strip.
        </p>
      </div>

      {/* 2-Column Main Workbench: Left (Photo Strip) | Right (Controls Card & Viewfinder) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 5 Cols: Physical 2x6 Photo Strip */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative">
            {/* Real Strip Container */}
            <div
              ref={stripContainerRef}
              id="print-area"
              className={`w-[260px] sm:w-[290px] p-4 pb-7 rounded-xs shadow-2xl transition-all duration-300 border flex flex-col items-center ${getStripContainerClasses()} ${
                enableGrain ? "grain-overlay" : ""
              }`}
            >
              {/* Strip Header */}
              <div className="w-full flex justify-between items-center mb-3 pb-2 border-b border-current/20 text-[10px] font-mono tracking-widest opacity-80">
                <span>KROMA &bull; LAB</span>
                <span>STRIP #{stripSerial}</span>
              </div>

              {/* 3 Photo Slots Stacked */}
              <div className="w-full space-y-3">
                {photos.map((src, i) => (
                  <div
                    key={i}
                    ref={(el) => {
                      photoSlotRefs.current[i] = el;
                    }}
                    className="w-full aspect-[4/3] bg-neutral-900 overflow-hidden relative border border-current/15 shadow-inner"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`Pose ${i + 1}`}
                      className={`w-full h-full object-cover transition-all duration-300 ${getImgFilterClass()}`}
                    />
                    <span className="absolute bottom-1 right-2 text-[8px] font-mono opacity-60 tracking-widest">
                      POSE 0{i + 1}
                    </span>
                  </div>
                ))}
              </div>

              {/* Frame Footer Metadata */}
              <div className="w-full mt-5 pt-3 border-t border-current/20 text-center flex flex-col items-center gap-1.5">
                <span className="text-[12px] font-satoshi font-black tracking-widest uppercase">
                  {stripTitle || "KROMA.STUDIO"}
                </span>
                {enableDateStamp && (
                  <div className="flex items-center justify-between w-full text-[9px] font-mono opacity-60 px-1">
                    <span>{new Date().toLocaleDateString("en-CA").replace(/-/g, ".")}</span>
                    <span>MONOCHROME &bull; 300DPI</span>
                  </div>
                )}

                {/* Studio Barcode Graphic */}
                <div className="w-full flex items-center justify-center gap-[2px] h-4 mt-1 opacity-70">
                  <div className="w-[3px] h-full bg-current"></div>
                  <div className="w-[1px] h-full bg-current"></div>
                  <div className="w-[4px] h-full bg-current"></div>
                  <div className="w-[1px] h-full bg-current"></div>
                  <div className="w-[2px] h-full bg-current"></div>
                  <div className="w-[4px] h-full bg-current"></div>
                  <div className="w-[1px] h-full bg-current"></div>
                  <div className="w-[3px] h-full bg-current"></div>
                  <div className="w-[2px] h-full bg-current"></div>
                  <div className="w-[1px] h-full bg-current"></div>
                  <div className="w-[4px] h-full bg-current"></div>
                  <div className="w-[2px] h-full bg-current"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Strip Controls & Print Engine */}
        <div className="lg:col-span-7 bg-white/70 p-6 sm:p-8 rounded-2xl border border-[#D0CFCA] shadow-sm space-y-6">
          <div>
            <h3 className="font-satoshi font-black text-xl uppercase tracking-tight text-[#111111]">
              STRIP CONTROLS &amp; PRINT ENGINE
            </h3>
            <p className="text-xs font-mono text-[#666666] uppercase mt-1">
              Live Webcam Trigger &bull; 3-Pose Burst &bull; Chemistry Emulation
            </p>
          </div>

          {/* Camera Viewfinder Box */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-black rounded-xl overflow-hidden border border-[#111111]/20 flex items-center justify-center">
            {/* Live WebCam Feed */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover scale-x-[-1] ${
                cameraActive ? "block" : "hidden"
              } ${getImgFilterClass()}`}
            />

            {/* Placeholder state */}
            {!cameraActive && (
              <div className="text-center p-4 space-y-2">
                <span className="material-symbols-outlined text-4xl text-[#2355FC]">
                  photo_camera
                </span>
                <p className="text-xs font-mono text-white/70 uppercase">
                  Click below to activate laptop camera
                </p>
              </div>
            )}

            {/* Countdown Overlay */}
            {countdown !== null && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-30">
                <span className="text-7xl font-black text-white font-satoshi animate-bounce">
                  {countdown}
                </span>
              </div>
            )}

            {/* HUD overlays */}
            <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between text-[10px] font-mono text-white/70 z-20">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 bg-black/50 px-2 py-0.5 rounded">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      cameraActive ? "bg-green-500 animate-pulse" : "bg-red-500"
                    }`}
                  ></span>
                  {cameraActive ? "LIVE 30 FPS" : "CAMERA STANDBY"}
                </span>
                <span className="bg-black/50 px-2 py-0.5 rounded">35MM &bull; REC</span>
              </div>
              {isCapturing && (
                <div className="self-center bg-[#2355FC] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
                  BURST SHOT {activeShot} OF 3
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="bg-black/50 px-2 py-0.5 rounded">F/2.8 ISO 400</span>
                <span className="bg-black/50 px-2 py-0.5 rounded">+0.0 EV</span>
              </div>
            </div>
          </div>

          {/* Camera Buttons Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={toggleCamera}
              className="px-5 py-2.5 rounded-full text-xs font-mono uppercase bg-[#111111]/10 hover:bg-[#111111]/20 text-[#111111] transition-colors border border-[#D0CFCA]"
            >
              {cameraActive ? "Turn Off Camera" : "Turn On Camera"}
            </button>

            <button
              onClick={startPhotoSequence}
              disabled={isCapturing}
              className="flex-1 py-2.5 px-6 rounded-full text-xs font-mono font-bold uppercase bg-[#2355FC] hover:bg-[#1A43D1] disabled:opacity-50 text-white transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
              <span>{isCapturing ? `Capturing Shot ${activeShot}...` : "SNAP 3 POSES"}</span>
            </button>
          </div>

          {/* Frame Finish Selector */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-[#111111]">
              Frame Finish
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setFrameFinish("noir")}
                className={`px-3 py-2 text-xs font-mono uppercase font-bold rounded border transition-all text-center ${
                  frameFinish === "noir"
                    ? "border-2 border-[#111111] bg-[#141414] text-white ring-2 ring-[#2355FC]/40"
                    : "border-[#D0CFCA] bg-[#141414]/10 text-[#111111] hover:bg-[#141414]/20"
                }`}
              >
                Matte Noir
              </button>
              <button
                onClick={() => setFrameFinish("stone")}
                className={`px-3 py-2 text-xs font-mono uppercase font-bold rounded border transition-all text-center ${
                  frameFinish === "stone"
                    ? "border-2 border-[#111111] bg-[#C8C7BE] text-[#111111] ring-2 ring-[#2355FC]/40"
                    : "border-[#D0CFCA] bg-[#E4E3DE] text-[#111111] hover:bg-[#C8C7BE]"
                }`}
              >
                Warm Stone
              </button>
              <button
                onClick={() => setFrameFinish("polar")}
                className={`px-3 py-2 text-xs font-mono uppercase font-bold rounded border transition-all text-center ${
                  frameFinish === "polar"
                    ? "border-2 border-[#111111] bg-white text-[#111111] ring-2 ring-[#2355FC]/40"
                    : "border-[#D0CFCA] bg-white/70 text-[#111111] hover:bg-white"
                }`}
              >
                Polar White
              </button>
            </div>
          </div>

          {/* Mono Filter Profile */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-[#111111]">
              Mono Filter Profile
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: "contrast", label: "01. High Contrast Mono" },
                { id: "tri-x", label: "02. Kodak Tri-X 400" },
                { id: "flash", label: "03. Harsh Strobe Flash" },
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => setFilterStyle(style.id as FilterStyle)}
                  className={`px-3 py-2 text-xs font-mono uppercase font-bold rounded border transition-all text-left truncate ${
                    filterStyle === style.id
                      ? "border-2 border-[#111111] bg-[#111111] text-white"
                      : "border-[#D0CFCA] bg-transparent text-[#111111] hover:bg-[#DCDBCF]"
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Film Grain & Date Toggles */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between py-2 px-3 bg-[#E4E3DE]/60 rounded-lg border border-[#D0CFCA]">
              <span className="text-xs font-mono uppercase tracking-wider font-bold text-[#111111]">
                OFFICIAL BRAND PRINT
              </span>
              <span className="text-xs font-satoshi font-black uppercase text-[#2355FC] tracking-widest">
                KROMA.STUDIO
              </span>
            </div>

            <div className="flex flex-wrap gap-6 pt-1">
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-mono uppercase">
                <input
                  type="checkbox"
                  checked={enableGrain}
                  onChange={(e) => setEnableGrain(e.target.checked)}
                  className="rounded accent-[#2355FC] w-4 h-4 cursor-pointer"
                />
                <span>Monochrome Film Filter</span>
              </label>

              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-mono uppercase">
                <input
                  type="checkbox"
                  checked={enableDateStamp}
                  onChange={(e) => setEnableDateStamp(e.target.checked)}
                  className="rounded accent-[#2355FC] w-4 h-4 cursor-pointer"
                />
                <span>Date &amp; Series Tag</span>
              </label>
            </div>
          </div>

          {/* Primary Action Buttons (Print & Save PNG) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-[#D0CFCA]">
            <button
              onClick={() => window.print()}
              className="py-3.5 bg-[#2355FC] text-white rounded-full font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#1A43D1] transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              <span>PRINT PHYSICAL STRIP (2x6)</span>
            </button>

            <button
              onClick={downloadStripImage}
              className="py-3.5 bg-[#111111] text-[#E4E3DE] rounded-full font-mono text-xs font-bold uppercase tracking-wider hover:bg-black transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>SAVE HIGH-RES PNG (300 DPI)</span>
            </button>
          </div>

          {/* Fallback local file upload */}
          <div className="text-center pt-2 border-t border-[#D0CFCA]/60">
            <label className="text-[11px] font-mono uppercase text-[#666666] hover:text-[#111111] cursor-pointer transition-colors inline-flex items-center gap-1.5">
              <span>Or choose photos from laptop files</span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleBatchUpload}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Non-intrusive Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
          <div className="bg-[#111111] text-[#E4E3DE] px-6 py-3 rounded-full text-xs font-mono uppercase tracking-wider shadow-2xl flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#2355FC]"></span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </section>
  );
};
