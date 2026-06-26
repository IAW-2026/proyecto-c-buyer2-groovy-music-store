import { ClerkProvider } from '@clerk/nextjs'
import { esES } from '@clerk/localizations'
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cormorant, syne, dmSans } from '@/app/ui/fonts';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Groovy Music Store",
  description: "Tienda de música online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={esES}>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${syne.variable} ${dmSans.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">{children}</body>
      </html>
    </ClerkProvider>
  );
}
