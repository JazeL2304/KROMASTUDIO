"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";

type FrameFinish = "noir" | "stone" | "polar";
type FilterStyle = "contrast" | "tri-x" | "flash";

const DEFAULT_SAMPLE_PHOTOS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDx753hYCwvSfAPeKU5JsO0J_mlFESdxUKjsoMTKpC7hLFJa6LEuBUMTYAVtnboHsZuU5MF_1teHqxxtZIxAOZYyzdCztikX9CbDnh4fcUsc8xar3wYaJQpUlYUsTIw6LwgxhNbrma9BJtcZRNm3L61rh3Rt335hvjNbDCNwSxvHGkZX7pAoalbuPnf-KadBfbeE3EBiWHqkE0Xm44DVbhHOJPaIWMi6Tq9j0kpGSDEfK3St5n8BPaf6A",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDzkp2GE3r5W-EVv13kN48XgHBEj9Qykv2LJw3W2jjauyRFk9BmGlEf2_f2u_HqzTZYGJ1swOKavTQCkZEdyywAZQ5tRw3DfnxBUHQXC8YGhiKw2RD7unfP8UCdAGqDA4ACkVBmPCHCQjsFsIdHpaugERLwdEaPmv-KRmHTtSby9w4g3QJEzaLGu9blvuq1aYtYnUDO_wg6w9B7kRLNaFL81xgQJ3rQAkFq4rXXQDsF_GHC3YL1X1C4qg",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBP00C6KJKoeRiGkJdvwsg7O80IFFsgq352RcprH36rRYX0Dy8EKtl8Ps8we7W7gvQGnusMgG81oh05Z4211PUsUJz8MVHCpplo-V7xWFizWPfADJ6_yjnuiO-wwDJon1Zh0kk58gPeq0Cr3hid_C03A7reO7NhFIruT0xQ1f92K1VbjHFKHNcst1VUnE00rvtCuo3pV4JUEXLW62EC73aJi_rkAtZPFHDKSz3B2zE_u1Fwd4Cxtmw2gA",
];

export const Photobooth: React.FC = () => {
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [currentShotIndex, setCurrentShotIndex] = useState<number>(0);
  const [isCapturingSequence, setIsCapturingSequence] = useState<boolean>(false);
  const [flashActive, setFlashActive] = useState<boolean>(false);
  
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>(DEFAULT_SAMPLE_PHOTOS);
  const [frameFinish, setFrameFinish] = useState<FrameFinish>("noir");
  const [heavyGrain, setHeavyGrain] = useState<boolean>(true);
  const [filterStyle, setFilterStyle] = useState<FilterStyle>("contrast");
  const [stripNumber] = useState<number>(() => Math.floor(1000 + Math.random() * 9000));

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Play shutter sound via Web Audio API
  const playSound = (type: "beep" | "shutter") => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      if (type === "beep") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else {
        // Shutter snap sound
        const bufferSize = ctx.sampleRate * 0.08;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        noise.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
      }
    } catch {
      // Audio context might be restricted before user gesture
    }
  };

  // Start webcam
  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 960 },
          facingMode: "user",
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: unknown) {
      console.error("Camera access error:", err);
      setCameraError("Camera permission not granted or device not available. You can still test the simulator with sample portrait frames.");
      setCameraActive(false);
    }
  };

  // Stop webcam
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Capture single frame from video or fallback
  const captureFrame = useCallback((): string => {
    if (videoRef.current && cameraActive) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Mirror horizontal for selfie camera natural feel
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL("image/jpeg", 0.95);
      }
    }
    // Return sample image if camera not ready
    return DEFAULT_SAMPLE_PHOTOS[Math.floor(Math.random() * DEFAULT_SAMPLE_PHOTOS.length)];
  }, [cameraActive]);

  // Trigger 3-shot burst sequence
  const startSequence = async () => {
    if (isCapturingSequence) return;
    if (!cameraActive) {
      await startCamera();
    }

    setIsCapturingSequence(true);
    const newPhotos: string[] = [];

    for (let shot = 1; shot <= 3; shot++) {
      setCurrentShotIndex(shot);

      // Countdown 3, 2, 1
      for (let count = 3; count >= 1; count--) {
        setCountdown(count);
        playSound("beep");
        await new Promise((r) => setTimeout(r, 1000));
      }

      setCountdown(null);
      // Flash
      setFlashActive(true);
      playSound("shutter");
      const photoUrl = captureFrame();
      newPhotos.push(photoUrl);
      setCapturedPhotos([...newPhotos, ...DEFAULT_SAMPLE_PHOTOS.slice(newPhotos.length)]);

      await new Promise((r) => setTimeout(r, 400));
      setFlashActive(false);

      if (shot < 3) {
        // Pause between shots
        await new Promise((r) => setTimeout(r, 1200));
      }
    }

    setCapturedPhotos(newPhotos);
    setIsCapturingSequence(false);
    setCurrentShotIndex(0);
  };

  // High-Resolution 300-DPI PNG Download using HTML5 Canvas
  const downloadHighResPng = () => {
    const canvas = document.createElement("canvas");
    // Standard 2x6 inches @ 300 DPI = 600 x 1800 px
    const W = 600;
    const H = 1800;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background based on frame finish
    let bgColor = "#141414";
    let textColor = "#FFFFFF";
    let subTextColor = "#A3A3A3";
    let borderColor = "rgba(255, 255, 255, 0.15)";

    if (frameFinish === "stone") {
      bgColor = "#E4E3DE";
      textColor = "#191B24";
      subTextColor = "#737373";
      borderColor = "#D0CFCA";
    } else if (frameFinish === "polar") {
      bgColor = "#FFFFFF";
      textColor = "#111111";
      subTextColor = "#666666";
      borderColor = "#E5E5E5";
    }

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, W, H);

    // Draw Header
    ctx.fillStyle = subTextColor;
    ctx.font = "600 16px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText(`KROMA • LAB / STRIP #${stripNumber}`, W / 2, 45);

    // Divider
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(36, 65);
    ctx.lineTo(W - 36, 65);
    ctx.stroke();

    // 3 Photo slots
    const photoWidth = W - 72; // 528px
    const photoHeight = (photoWidth * 3) / 4; // 396px
    const startY = 85;
    const gap = 24;

    const loadImages = capturedPhotos.map((src) => {
      return new Promise<HTMLImageElement>((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => {
          // Fallback image
          const fallback = new Image();
          fallback.src = DEFAULT_SAMPLE_PHOTOS[0];
          resolve(fallback);
        };
        img.src = src;
      });
    });

    Promise.all(loadImages).then((images) => {
      images.forEach((img, idx) => {
        const py = startY + idx * (photoHeight + gap);

        ctx.save();
        ctx.beginPath();
        ctx.rect(36, py, photoWidth, photoHeight);
        ctx.clip();

        // Apply B&W filter in canvas
        ctx.filter =
          filterStyle === "tri-x"
            ? "grayscale(100%) contrast(160%) brightness(90%)"
            : filterStyle === "flash"
            ? "grayscale(100%) contrast(180%) brightness(105%)"
            : "grayscale(100%) contrast(140%) brightness(95%)";

        ctx.drawImage(img, 36, py, photoWidth, photoHeight);
        ctx.restore();

        // Border around photo
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 1;
        ctx.strokeRect(36, py, photoWidth, photoHeight);
      });

      // Footer
      const footerY = H - 80;
      ctx.fillStyle = textColor;
      ctx.font = "800 28px 'Satoshi', sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("KROMA.STUDIO", 36, footerY);

      // Date / Info
      ctx.fillStyle = subTextColor;
      ctx.font = "500 13px 'JetBrains Mono', monospace";
      ctx.fillText(new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }).toUpperCase(), 36, footerY + 24);

      // Barcode bars on the right
      const barX = W - 140;
      const barY = footerY - 22;
      const barH = 38;
      const bars = [4, 2, 6, 2, 8, 3, 4, 2, 5, 2, 7, 2, 4];
      let curX = barX;
      ctx.fillStyle = textColor;
      bars.forEach((w) => {
        ctx.fillRect(curX, barY, w, barH);
        curX += w + 3;
      });

      // Export as PNG
      const link = document.createElement("a");
      link.download = `kroma-strip-${stripNumber}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  // Get frame finish CSS
  const getFrameFinishClasses = () => {
    switch (frameFinish) {
      case "stone":
        return "bg-[#E4E3DE] text-[#191B24] border-[#D0CFCA]";
      case "polar":
        return "bg-white text-[#111111] border-[#E5E5E5]";
      case "noir":
      default:
        return "bg-[#141414] text-white border-white/15";
    }
  };

  // Get photo filter CSS
  const getFilterClass = () => {
    switch (filterStyle) {
      case "tri-x":
        return "mono-tri-x";
      case "flash":
        return "mono-flash";
      case "contrast":
      default:
        return "mono-contrast";
    }
  };

  return (
    <section id="booth" className="w-full px-6 md:px-12 py-16 md:py-24 max-w-[1600px] mx-auto border-b border-[#D0CFCA]">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2355FC] animate-ping"></span>
            <span className="font-mono text-xs uppercase tracking-widest text-[#737373]">
              Free Interactive Simulator
            </span>
          </div>
          <h2 className="font-satoshi text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-[#191B24]">
            KROMA / WEB BOOTH
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs uppercase text-[#737373] bg-[#DCDBCF] px-3 py-1.5 rounded-full">
            100% IN-BROWSER • 0% CLOUD STORAGE
          </span>
        </div>
      </div>

      {/* 3-Column Workbench: Controls & Strip on Left/Center, Camera on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Customizer & Output Controls (col-span-3) */}
        <div className="lg:col-span-3 flex flex-col gap-6 bg-[#DCDBCF]/60 p-6 rounded-xl border border-[#D0CFCA]">
          {/* Frame Finish Selector */}
          <div className="flex flex-col gap-3">
            <p className="font-mono text-xs text-[#737373] uppercase border-b border-[#D0CFCA] pb-1.5 flex justify-between items-center">
              <span>Frame Finish</span>
              <span className="text-[#191B24] font-bold">{frameFinish.toUpperCase()}</span>
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setFrameFinish("noir")}
                className={`px-3 py-2 rounded-lg font-mono text-[10px] uppercase border transition-all text-center ${
                  frameFinish === "noir"
                    ? "bg-[#141414] text-white border-[#141414] ring-2 ring-[#2355FC]"
                    : "bg-[#141414]/10 text-[#191B24] border-[#D0CFCA] hover:bg-[#141414]/20"
                }`}
              >
                Matte Noir
              </button>
              <button
                onClick={() => setFrameFinish("stone")}
                className={`px-3 py-2 rounded-lg font-mono text-[10px] uppercase border transition-all text-center ${
                  frameFinish === "stone"
                    ? "bg-[#E4E3DE] text-[#191B24] border-[#191B24] ring-2 ring-[#2355FC]"
                    : "bg-[#E4E3DE]/60 text-[#191B24] border-[#D0CFCA] hover:bg-[#E4E3DE]"
                }`}
              >
                Warm Stone
              </button>
              <button
                onClick={() => setFrameFinish("polar")}
                className={`px-3 py-2 rounded-lg font-mono text-[10px] uppercase border transition-all text-center ${
                  frameFinish === "polar"
                    ? "bg-white text-[#111111] border-[#111111] ring-2 ring-[#2355FC]"
                    : "bg-white/60 text-[#191B24] border-[#D0CFCA] hover:bg-white"
                }`}
              >
                Polar White
              </button>
            </div>
          </div>

          {/* Filter Style Preset */}
          <div className="flex flex-col gap-3">
            <p className="font-mono text-xs text-[#737373] uppercase border-b border-[#D0CFCA] pb-1.5">
              Mono Filter Profile
            </p>
            <div className="flex flex-col gap-2">
              {[
                { id: "contrast", label: "01. High Contrast Mono" },
                { id: "tri-x", label: "02. Kodak Tri-X 400 Grain" },
                { id: "flash", label: "03. Harsh Editorial Flash" },
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => setFilterStyle(style.id as FilterStyle)}
                  className={`px-3 py-2 rounded-md font-mono text-[11px] text-left uppercase transition-all flex items-center justify-between border ${
                    filterStyle === style.id
                      ? "bg-[#191B24] text-white border-[#191B24]"
                      : "bg-transparent text-[#191B24] border-[#D0CFCA] hover:bg-[#DCDBCF]"
                  }`}
                >
                  <span>{style.label}</span>
                  {filterStyle === style.id && (
                    <span className="material-symbols-outlined text-[14px]">check</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Heavy Grain Toggle */}
          <div className="flex flex-col gap-3">
            <p className="font-mono text-xs text-[#737373] uppercase border-b border-[#D0CFCA] pb-1.5">
              Analog Processing
            </p>
            <label className="flex items-center justify-between cursor-pointer group py-1">
              <span className="font-mono text-xs text-[#191B24] font-medium uppercase">
                Heavy Film Grain
              </span>
              <button
                type="button"
                onClick={() => setHeavyGrain(!heavyGrain)}
                className={`w-11 h-6 rounded-full relative transition-colors focus:outline-none ${
                  heavyGrain ? "bg-[#2355FC]" : "bg-[#D0CFCA]"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                    heavyGrain ? "right-1" : "left-1"
                  }`}
                ></div>
              </button>
            </label>
          </div>

          {/* Output Action Buttons */}
          <div className="flex flex-col gap-3 pt-4 border-t border-[#D0CFCA]">
            <button
              onClick={() => window.print()}
              className="w-full bg-[#2355FC] text-white font-mono text-xs uppercase tracking-wider py-3.5 rounded-full hover:bg-[#0035BD] transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              Print Physical Strip (2x6)
            </button>

            <button
              onClick={downloadHighResPng}
              className="w-full bg-[#191B24] text-white font-mono text-xs uppercase tracking-wider py-3.5 rounded-full hover:bg-black transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              Save High-Res PNG (300 DPI)
            </button>
          </div>
        </div>

        {/* Center Column: Photo Strip Preview (col-span-4) */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center">
          <div className="text-center mb-3">
            <span className="font-mono text-xs uppercase text-[#737373] tracking-widest">
              Physical 2x6 Strip Simulation
            </span>
          </div>

          {/* Photo Strip Container */}
          <div
            id="photo-strip"
            className={`w-[280px] p-4 flex flex-col gap-3 shadow-2xl relative border transition-all ${
              heavyGrain ? "grain-overlay" : ""
            } ${getFrameFinishClasses()}`}
          >
            {/* Strip Header */}
            <div className="text-center pb-2 border-b border-current/20">
              <p className="font-mono text-[10px] uppercase tracking-widest opacity-80">
                KROMA • LAB / STRIP #{stripNumber}
              </p>
            </div>

            {/* 3 Photo Slots */}
            {capturedPhotos.map((photo, i) => (
              <div
                key={i}
                className="relative aspect-[4/3] bg-black/20 overflow-hidden border border-current/15"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo}
                  alt={`Pose ${i + 1}`}
                  className={`w-full h-full object-cover transition-all ${getFilterClass()}`}
                />
                <span className="absolute bottom-1 right-2 font-mono text-[9px] text-white/70 drop-shadow-md">
                  0{i + 1}
                </span>
              </div>
            ))}

            {/* Strip Footer */}
            <div className="flex justify-between items-end pt-1 mt-1 border-t border-current/20">
              <div>
                <p className="font-satoshi text-base font-extrabold uppercase tracking-tighter leading-none">
                  KROMA.STUDIO
                </p>
                <p className="font-mono text-[8px] opacity-70 mt-0.5">
                  JAKARTA / 300 DPI
                </p>
              </div>

              {/* Barcode Graphic */}
              <div className="flex gap-[2px] h-5 items-end">
                <div className="w-[3px] bg-current h-full"></div>
                <div className="w-[1px] bg-current h-full"></div>
                <div className="w-[4px] bg-current h-full"></div>
                <div className="w-[2px] bg-current h-full"></div>
                <div className="w-[1px] bg-current h-full"></div>
                <div className="w-[3px] bg-current h-full"></div>
                <div className="w-[2px] bg-current h-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Viewfinder (col-span-5) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="relative aspect-[4/3] bg-[#141414] rounded-lg overflow-hidden border border-[#D0CFCA] shadow-2xl flex items-center justify-center">
            {/* Screen Flash Overlay */}
            {flashActive && (
              <div className="absolute inset-0 bg-white z-50 screen-flash pointer-events-none"></div>
            )}

            {/* Countdown Overlay */}
            {countdown !== null && (
              <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-xs">
                <span className="font-satoshi text-8xl md:text-9xl font-black text-white animate-bounce">
                  {countdown}
                </span>
              </div>
            )}

            {/* Video Feed */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover scale-x-[-1] ${
                cameraActive ? "block" : "hidden"
              } ${getFilterClass()}`}
            />

            {/* Camera Offline Placeholder */}
            {!cameraActive && (
              <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center text-white/70 bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A]">
                <span className="material-symbols-outlined text-5xl mb-3 text-[#2355FC]">
                  photo_camera
                </span>
                <p className="font-mono text-xs uppercase tracking-wider mb-4 text-white">
                  Camera Standby
                </p>
                <button
                  onClick={startCamera}
                  className="bg-[#2355FC] text-white px-6 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider hover:bg-[#0035BD] transition-all flex items-center gap-2 shadow-lg"
                >
                  <span className="material-symbols-outlined text-[16px]">videocam</span>
                  Activate Web Camera
                </button>
                {cameraError && (
                  <p className="font-mono text-[10px] text-[#FA9A00] mt-3 max-w-xs">
                    {cameraError}
                  </p>
                )}
              </div>
            )}

            {/* Viewfinder HUD Overlays */}
            <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between z-30">
              <div className="flex justify-between items-start font-mono text-[11px] text-white/80">
                <span className="flex items-center gap-2 bg-black/50 px-2 py-0.5 rounded">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      cameraActive ? "bg-[#BA1A1A] animate-pulse" : "bg-white/40"
                    }`}
                  ></span>
                  {cameraActive ? "REC • 30 FPS" : "STANDBY"}
                </span>
                <span className="bg-black/50 px-2 py-0.5 rounded">
                  4:3 APERTURE
                </span>
              </div>

              {/* Sequencing Status */}
              {isCapturingSequence && (
                <div className="self-center bg-[#2355FC] text-white px-4 py-1.5 rounded-full font-mono text-xs uppercase tracking-widest font-bold animate-pulse">
                  SHOT {currentShotIndex} OF 3
                </div>
              )}

              <div className="flex justify-between items-end font-mono text-[11px] text-white/80">
                <span className="bg-black/50 px-2 py-0.5 rounded">F/2.8 ISO 400</span>
                <span className="bg-black/50 px-2 py-0.5 rounded">1/250s SHUTTER</span>
              </div>
            </div>

            {/* Rule of Thirds Grid Overlay */}
            <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-20 z-20">
              <div className="border-r border-b border-white"></div>
              <div className="border-r border-b border-white"></div>
              <div className="border-b border-white"></div>
              <div className="border-r border-b border-white"></div>
              <div className="border-r border-b border-white"></div>
              <div className="border-b border-white"></div>
              <div className="border-r border-white"></div>
              <div className="border-r border-white"></div>
              <div></div>
            </div>
          </div>

          {/* Camera Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              disabled={isCapturingSequence}
              onClick={startSequence}
              className={`flex-1 py-4 px-6 rounded-full font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 shadow-md ${
                isCapturingSequence
                  ? "bg-[#737373] text-white cursor-not-allowed"
                  : "bg-[#2355FC] text-white hover:bg-[#0035BD] hover:scale-[1.02]"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">motion_photos_on</span>
              {isCapturingSequence ? "Capturing 3 Shots..." : "SNAP 3 POSES"}
            </button>
            {cameraActive && (
              <button
                onClick={stopCamera}
                className="px-5 py-4 border border-[#191B24] rounded-full font-mono text-xs uppercase text-[#191B24] hover:bg-[#191B24] hover:text-[#E4E3DE] transition-colors"
                title="Stop Camera"
              >
                <span className="material-symbols-outlined text-[18px]">videocam_off</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </section>
  );
};
