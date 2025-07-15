"use client"

import { useRef } from "react"
import type React from "react"
import { useTheme } from "next-themes"

interface GlassmorphismCardProps {
  children: React.ReactNode
  className?: string
}

export function GlassmorphismCard({ children, className = "" }: GlassmorphismCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        backgroundColor: isDark ? "rgba(20, 20, 20, 0.7)" : "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: isDark
          ? "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.1)"
          : "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.5)",
        borderRadius: "24px", // Consistent rounded corners
      }}
    >
      {/* Static gradient background instead of animated canvas */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? "linear-gradient(135deg, rgba(100, 60, 255, 0.6), rgba(255, 80, 180, 0.6), rgba(50, 220, 100, 0.6))"
            : "linear-gradient(135deg, rgba(100, 60, 255, 0.5), rgba(255, 80, 180, 0.5), rgba(50, 220, 100, 0.5))",
          opacity: 0.8,
          mixBlendMode: "overlay",
        }}
      />

      {/* Add a semi-transparent overlay to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 dark:to-black/50"></div>
      <div className="relative z-10">{children}</div>
    </div>
  )
}
