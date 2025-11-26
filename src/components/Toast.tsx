// src/components/Toast.tsx - Component thông báo đẹp thay thế alert
"use client";

import { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type = "info",
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle size={20} className="text-green-600" />,
    error: <AlertCircle size={20} className="text-red-600" />,
    warning: <AlertTriangle size={20} className="text-amber-600" />,
    info: <Info size={20} className="text-blue-600" />,
  };

  const backgrounds = {
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    warning: "bg-amber-50 border-amber-200",
    info: "bg-blue-50 border-blue-200",
  };

  const textColors = {
    success: "text-green-800",
    error: "text-red-800",
    warning: "text-amber-800",
    info: "text-blue-800",
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-[slide-in_0.3s_ease-out]">
      <div
        className={`flex items-center gap-3 ${backgrounds[type]} border-2 rounded-lg shadow-lg p-4 pr-12 min-w-[300px] max-w-md`}
      >
        <div className="flex-shrink-0">{icons[type]}</div>
        <p className={`${textColors[type]} font-medium text-sm`}>{message}</p>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 hover:bg-black/5 rounded transition"
        >
          <X size={16} className="text-gray-500" />
        </button>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
