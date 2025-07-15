"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface TextPressureProps {
  children: React.ReactNode
  className?: string
  intensity?: number
  speed?: string
  color?: string
}

export function TextPressure({ children, className, intensity = 1.05, speed = "2s", color }: TextPressureProps) {
  return (
    <span
      className={cn("inline-block animate-text-pressure font-bold", className)}
      style={{
        animationDuration: speed,
        color,
        transform: `scale(1)`,
        transformOrigin: "center",
      }}
    >
      {children}
    </span>
  )
}
