import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Hệ thống quản lý thiết bị",
  description: "ASSET - Hệ thống quản lý thiết bị",
};

// Component bảo vệ route (client component)
import AuthGuard from "./components/AuthGuard";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  );
}
