"use client"

import type React from "react"
import { useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface TiltedCardProps {
  children: React.ReactNode
  className?: string
  tiltMaxAngleX?: number
  tiltMaxAngleY?: number
  perspective?: number
  scale?: number
  transitionDuration?: number
  transitionEasing?: string
  glareEnable?: boolean
  glareMaxOpacity?: number
  glareColor?: string
  glarePosition?: string
  glareBorderRadius?: string
}

export function TiltedCard({
  children,
  className,
  tiltMaxAngleX = 8,
  tiltMaxAngleY = 8,
  perspective = 1000,
  scale = 1.02,
  transitionDuration = 400,
  transitionEasing = "cubic-bezier(0.03, 0.98, 0.52, 0.99)",
  glareEnable = true,
  glareMaxOpacity = 0.3,
  glareColor = "#ffffff",
  glarePosition = "bottom",
  glareBorderRadius = "0",
}: TiltedCardProps) {
  const [transform, setTransform] = useState("")
  const [glare, setGlare] = useState("")
  const [transition, setTransition] = useState("")
  const itemRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    setTransition("")
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!itemRef.current) return

    const { left, top, width, height } = itemRef.current.getBoundingClientRect()
    const x = (e.clientX - left - width / 2) / (width / 2)
    const y = (e.clientY - top - height / 2) / (height / 2)

    const angleX = tiltMaxAngleX * y
    const angleY = tiltMaxAngleY * x

    setTransform(
      `perspective(${perspective}px) rotateX(${-angleX}deg) rotateY(${angleY}deg) scale3d(${scale}, ${scale}, ${scale})`,
    )

    if (glareEnable) {
      const glareX = (e.clientX - left) / width
      const glareY = (e.clientY - top) / height
      const glareOpacity = glareMaxOpacity * Math.min(Math.abs(x), Math.abs(y))

      setGlare(`radial-gradient(circle at ${glareX * 100}% ${glareY * 100}%, ${glareColor} 0%, transparent 50%)`)
    }
  }

  const handleMouseLeave = () => {
    setTransition(`all ${transitionDuration}ms ${transitionEasing}`)
    setTransform(`perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`)
    setGlare("")
  }

  return (
    <div
      ref={itemRef}
      className={cn("relative transform-gpu", className)}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition,
      }}
    >
      {children}
      {glareEnable && (
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background: glare,
            borderRadius: glareBorderRadius,
            opacity: glare ? glareMaxOpacity : 0,
            transition: `opacity ${transitionDuration}ms ${transitionEasing}`,
          }}
        />
      )}
    </div>
  )
}
