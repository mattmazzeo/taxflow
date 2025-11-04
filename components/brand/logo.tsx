import React from "react";

interface LogoProps {
  className?: string;
  variant?: "default" | "icon" | "wordmark";
}

export function Logo({ className = "", variant = "default" }: LogoProps) {
  if (variant === "icon") {
    return (
      <svg
        className={className}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Stylized T that forms a checkmark + document fold */}
        <path
          d="M8 6C8 4.89543 8.89543 4 10 4H30C31.1046 4 32 4.89543 32 6V12H24V34C24 35.1046 23.1046 36 22 36H18C16.8954 36 16 35.1046 16 34V12H8V6Z"
          fill="currentColor"
          className="text-primary"
        />
        {/* Checkmark accent */}
        <path
          d="M26 18L22 22L20 20"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-warning"
        />
        {/* Document fold */}
        <path
          d="M28 4V10H34L28 4Z"
          fill="currentColor"
          className="text-sage opacity-60"
        />
      </svg>
    );
  }

  if (variant === "wordmark") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <svg
          className="h-8 w-8"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 6C8 4.89543 8.89543 4 10 4H30C31.1046 4 32 4.89543 32 6V12H24V34C24 35.1046 23.1046 36 22 36H18C16.8954 36 16 35.1046 16 34V12H8V6Z"
            fill="currentColor"
            className="text-primary"
          />
          <path
            d="M26 18L22 22L20 20"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-warning"
          />
          <path
            d="M28 4V10H34L28 4Z"
            fill="currentColor"
            className="text-sage opacity-60"
          />
        </svg>
        <span className="text-2xl font-bold">TaxFlow</span>
      </div>
    );
  }

  // Default variant with icon and text
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        className="h-6 w-6"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 6C8 4.89543 8.89543 4 10 4H30C31.1046 4 32 4.89543 32 6V12H24V34C24 35.1046 23.1046 36 22 36H18C16.8954 36 16 35.1046 16 34V12H8V6Z"
          fill="currentColor"
          className="text-primary"
        />
        <path
          d="M26 18L22 22L20 20"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-warning"
        />
        <path
          d="M28 4V10H34L28 4Z"
          fill="currentColor"
          className="text-sage opacity-60"
        />
      </svg>
      <span className="text-xl font-bold">TaxFlow</span>
    </div>
  );
}

