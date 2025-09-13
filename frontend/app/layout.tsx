import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Go島てる",
  description: "Next.jsとAWSで作る位置情報サービス",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}
