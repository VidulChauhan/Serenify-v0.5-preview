"use client"

import { useRef } from "react"
import { useMetallicEffect, getMetallicTextStyle } from "@/lib/metallic-effect"

interface MetallicTextProps {
  text: string
  className?: string
  gradient?: string
  intensity?: number
}

export function MetallicText({
  text,
  className = "",
  gradient = "linear-gradient(135deg, #4ade80, #8b5cf6, #3b82f6)",
  intensity = 1,
}: MetallicTextProps) {
  const textRef = useRef<HTMLHeadingElement>(null)
  const motion = useMetallicEffect(textRef, intensity)

  return (
    <h1 ref={textRef} className={className} style={getMetallicTextStyle(motion, gradient)}>
      {text}
    </h1>
  )
}
