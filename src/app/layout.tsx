import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { authOptions } from "./api/auth/[...nextauth]/options";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/sonner"
import { getServerSession } from 'next-auth';
import Navbar from "./(app)/navbar/page";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const session = await getServerSession(authOptions);
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider session={session}>
          {children}          
          </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
