"use client";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  message?: string;
}

export default function LoadingSpinner({
  size = "md",
  message,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  const iconSizes = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-4xl",
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className={`relative ${sizeClasses[size]} mb-4`}>
        <div className="absolute inset-0 animate-spin">
          <div
            className={`${sizeClasses[size]} border-4 border-hue-red/20 border-t-hue-red rounded-full`}
          ></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`${iconSizes[size]} animate-pulse`}>🍜</span>
        </div>
      </div>
      {message && (
        <p className="text-gray-600 font-medium animate-pulse">{message}</p>
      )}
    </div>
  );
}
