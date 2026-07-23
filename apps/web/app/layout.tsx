import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CashiPro AI - Futures Analyst",
  description: "AI Powered MEXC Futures Trading Signals",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0A0A0A] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
