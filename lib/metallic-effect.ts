"use client"

import { useEffect, useState, type RefObject } from "react"
import type React from "react"

interface MotionData {
  tiltX: number
  tiltY: number
  shine: number
  rotation: number
}

export function useMetallicEffect(ref: RefObject<HTMLElement>, intensity = 1): MotionData {
  const [motion, setMotion] = useState<MotionData>({
    tiltX: 0,
    tiltY: 0,
    shine: 0.5,
    rotation: 0,
  })

  useEffect(() => {
    if (!window.DeviceOrientationEvent) {
      // Fallback for devices without motion sensors
      const handleMouseMove = (e: MouseEvent) => {
        if (!ref.current) return

        const rect = ref.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        // Calculate tilt based on mouse position relative to center
        const tiltX = ((e.clientX - centerX) / (rect.width / 2)) * intensity * 5
        const tiltY = ((e.clientY - centerY) / (rect.height / 2)) * intensity * 5

        // Calculate shine based on mouse position
        const shine = 0.5 + ((e.clientX - rect.left) / rect.width) * 0.5

        // Calculate rotation for animated effects
        const rotation = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI)

        setMotion({ tiltX, tiltY, shine, rotation })
      }

      window.addEventListener("mousemove", handleMouseMove)
      return () => window.removeEventListener("mousemove", handleMouseMove)
    } else {
      // Use device orientation for devices with motion sensors
      const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
        if (!e.beta || !e.gamma) return

        // Convert orientation to tilt values
        const tiltY = ((e.beta - 45) / 45) * intensity * 5 // beta: -180 to 180
        const tiltX = (e.gamma / 45) * intensity * 5 // gamma: -90 to 90

        // Calculate shine based on device orientation
        const shine = 0.5 + ((e.gamma + 90) / 180) * 0.5

        // Calculate rotation for animated effects
        const rotation = e.alpha || 0

        setMotion({ tiltX, tiltY, shine, rotation })
      }

      window.addEventListener("deviceorientation", handleDeviceOrientation as EventListener)
      return () => window.removeEventListener("deviceorientation", handleDeviceOrientation as EventListener)
    }
  }, [ref, intensity])

  return motion
}

// Helper function to generate CSS for colorful gradient card
export function getColorfulCardStyle(motion: MotionData): React.CSSProperties {
  const { tiltX, tiltY, shine, rotation } = motion

  // Animate the gradient based on motion
  const gradientRotation = (rotation / 360) * 30 + 45
  const gradientShift = shine * 20

  return {
    background: `linear-gradient(${gradientRotation}deg, 
      rgba(255, 100, 200, ${0.7 + shine * 0.3}) ${0 + gradientShift}%, 
      rgba(120, 80, 255, ${0.7 + shine * 0.3}) ${30 + gradientShift}%, 
      rgba(255, 180, 50, ${0.7 + shine * 0.3}) ${70 + gradientShift}%, 
      rgba(100, 200, 100, ${0.7 + shine * 0.3}) ${100 + gradientShift}%)`,
    borderRadius: "16px",
    boxShadow: `
      0 ${4 + Math.abs(tiltY) * 2}px ${10 + Math.abs(tiltY) * 4}px rgba(0, 0, 0, 0.2),
      0 ${2 + Math.abs(tiltY)}px ${4 + Math.abs(tiltY) * 2}px rgba(0, 0, 0, 0.1),
      inset 0 0 0 1px rgba(255, 255, 255, 0.5)
    `,
    transform: `
      perspective(1000px) 
      rotateX(${tiltY}deg) 
      rotateY(${tiltX}deg)
      translateZ(2px)
    `,
    transition: "transform 0.1s ease-out, box-shadow 0.1s ease-out, background 0.5s ease-out",
    position: "relative",
    overflow: "hidden",
  }
}

// Helper function to generate CSS for metallic gradient
export function getMetallicGradient(
  baseColor = "#e2e2e2",
  darkColor = "#b0b0b0",
  lightColor = "#ffffff",
  shine = 0.5,
): string {
  // Adjust the gradient stops based on shine value
  const middleStop = 40 + shine * 20

  return `
    linear-gradient(
      135deg,
      ${darkColor} 0%,
      ${baseColor} ${middleStop}%,
      ${lightColor} ${middleStop + 10}%,
      ${baseColor} 100%
    )
  `
}

// Helper function to generate CSS for metallic text
export function getMetallicTextStyle(
  motion: MotionData,
  baseColor = "linear-gradient(135deg, #4ade80, #8b5cf6, #3b82f6)",
): React.CSSProperties {
  return {
    background: baseColor,
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    color: "transparent",
    position: "relative",
    display: "inline-block",
    transform: `perspective(1000px) rotateX(${motion.tiltY}deg) rotateY(${motion.tiltX}deg)`,
    transition: "transform 0.1s ease-out",
    textShadow: `
      0 1px 0 rgba(255, 255, 255, 0.4),
      0 -1px 0 rgba(0, 0, 0, 0.2)
    `,
    filter: `brightness(${0.9 + motion.shine * 0.2})`,
  }
}

// Helper function to generate CSS for metallic card
export function getMetallicCardStyle(motion: MotionData): React.CSSProperties {
  const shine = motion.shine

  return {
    background: getMetallicGradient("#e2e2e2", "#b0b0b0", "#ffffff", shine),
    borderRadius: "16px",
    boxShadow: `
      0 ${4 + Math.abs(motion.tiltY) * 2}px ${10 + Math.abs(motion.tiltY) * 4}px rgba(0, 0, 0, 0.1),
      0 ${2 + Math.abs(motion.tiltY)}px ${4 + Math.abs(motion.tiltY) * 2}px rgba(0, 0, 0, 0.1),
      inset 0 0 0 1px rgba(255, 255, 255, 0.5)
    `,
    transform: `
      perspective(1000px) 
      rotateX(${motion.tiltY}deg) 
      rotateY(${motion.tiltX}deg)
      translateZ(2px)
    `,
    transition: "transform 0.1s ease-out, box-shadow 0.1s ease-out",
    position: "relative",
    overflow: "hidden",
  }
}

// Helper function to create the subtle pattern overlay for metallic cards
export function MetallicPatternOverlay(): JSX.Element {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-10"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23000000' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        backgroundSize: "100px 100px",
      }}
    />
  )
}

// Helper component for animated gradient background
export function AnimatedGradientBackground(): JSX.Element {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[inherit] pointer-events-none">
      <div className="absolute inset-0 animate-gradient-shift opacity-70" />
    </div>
  )
}
