import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import { themeInitScript } from "@/lib/theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Help Me Solve My Math",
  description: "Solve quadratic equations, matrices, unit conversions, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-950 overflow-x-hidden`}
      >
        <div className="lg:flex lg:min-h-screen">
          <Sidebar />
          <div className="w-full min-w-0 flex flex-col lg:flex-1">
            <main className="flex-1 pb-16 lg:pb-0">{children}</main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}