"use client";

import React, { useEffect, useState } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  // Trigger the animation immediately after the component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div 
      className={`transition-all duration-500 ease-out w-full h-full ${
        isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {children}
    </div>
  );
}