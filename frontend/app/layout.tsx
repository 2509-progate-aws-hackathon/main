import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import "./globals.css";
import "../styles/transitions.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "船舶情報比較・検索アプリ",
  description: "船舶データベースから詳細な船舶情報を検索し、複数の船舶を比較できるシステム",
  keywords: "船舶,比較,検索,スペック,航海",
  authors: [{ name: "Ship Comparison Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <meta name="theme-color" content="#2563eb" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PerformanceMonitor />
        <Suspense fallback={<div className="min-h-screen bg-gray-50 animate-pulse" />}>
          <div className="page-transition">
            {children}
          </div>
        </Suspense>
      </body>
    </html>
  );
}
