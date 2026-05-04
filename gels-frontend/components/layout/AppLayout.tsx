"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // If on the auth page, render without Sidebar and TopNav
  if (pathname.startsWith("/auth")) {
    return <main className="min-h-screen bg-white">{children}</main>;
  }

  // For all other pages (/, /instructor, /quests, etc.), show the full layout
  return (
    // Added bg-white to the main wrapper container
    <div className="h-screen flex overflow-hidden bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
}