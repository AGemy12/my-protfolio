"use client";
import React, { useEffect, useState } from "react";

export default function Loading() {
  const [loadingDone, setLoadingDone] = useState<boolean>(false);

  useEffect(() => {
    // Simulate loading completion
    const timer = setTimeout(() => {
      setLoadingDone(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {!loadingDone && (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-main-bg z-50 transition-opacity duration-500 ease-out">
          <div className="relative">
            {/* Animated gradient circle - premium design */}
            <div className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            
            {/* Pulse effect rings */}
            <div className="absolute inset-0 w-24 h-24 rounded-full bg-primary/10 animate-ping" />
            <div className="absolute inset-0 w-24 h-24 rounded-full bg-primary/5 animate-ping" style={{ animationDelay: '0.5s' }} />
            
            {/* Shimmer gradient overlay */}
            <div className="absolute inset-0 w-24 h-24 rounded-full bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-pulse" />
            
            {/* Center content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-primary animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
