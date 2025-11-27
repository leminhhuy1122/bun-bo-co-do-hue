"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function PageLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-sm flex items-center justify-center">
      <div className="text-center">
        {/* Animated Bowl */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 animate-spin">
            <div className="w-24 h-24 border-8 border-hue-red/20 border-t-hue-red rounded-full"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl animate-bounce">🍜</span>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h3 className="font-display text-xl font-bold text-hue-redDark">
            Đang tải...
          </h3>
          <div className="flex justify-center gap-1">
            <div className="w-2 h-2 bg-hue-red rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-hue-red rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-hue-red rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
