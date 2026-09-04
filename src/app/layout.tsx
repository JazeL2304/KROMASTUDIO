import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "KROMA STUDIO — Minimalist Swiss Editorial & Photobooth",
  description:
    "Automated self-portrait studio meets high-contrast Swiss editorial aesthetics. Instant 300-DPI prints, browser photobooth, and curated packages.",
  keywords: ["photobooth", "editorial photography", "self portrait", "swiss design", "kroma studio", "analog simulation"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} scroll-smooth`}
    >
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@900,800,700,500,400&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#E4E3DE] text-[#191B24] font-satoshi antialiased flex flex-col">
        {children}
      </body>
    </html>
  );
}
