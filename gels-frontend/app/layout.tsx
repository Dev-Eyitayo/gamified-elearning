import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AppLayout from "@/components/layout/AppLayout";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GELS | Gamified eLearning System",
  description: "A Dual-Adaptive, Glass-Box AI Architecture",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* Changed background to bg-white here */}
      <body className={`${inter.className} bg-white text-[#1B2B3A] min-h-screen selection:bg-[#008080]/30`}>
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}