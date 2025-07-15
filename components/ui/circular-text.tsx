"use client"
import { cn } from "@/lib/utils"

interface CircularTextProps {
  text: string
  className?: string
  radius?: number
  fontSize?: number
  letterSpacing?: number
  direction?: "clockwise" | "counterclockwise"
  speed?: string
}

export function CircularText({
  text,
  className,
  radius = 50,
  fontSize = 14,
  letterSpacing = 0,
  direction = "clockwise",
  speed = "20s",
}: CircularTextProps) {
  const characters = text.split("")
  const angleStep = 360 / characters.length

  return (
    <div
      className={cn("relative inline-block", className)}
      style={{
        width: `${radius * 2}px`,
        height: `${radius * 2}px`,
      }}
    >
      <div
        className={cn("absolute inset-0 animate-circular-text", direction === "counterclockwise" && "animate-reverse")}
        style={{
          animationDuration: speed,
          animationDirection: direction === "counterclockwise" ? "reverse" : "normal",
        }}
      >
        {characters.map((char, index) => (
          <span
            key={index}
            className="absolute left-1/2 top-1/2 origin-[0_0] transform font-bold"
            style={{
              fontSize: `${fontSize}px`,
              letterSpacing: `${letterSpacing}px`,
              fontWeight: 800,
              transform: `rotate(${index * angleStep}deg) translate(${radius}px) rotate(${
                direction === "counterclockwise" ? 180 : 0
              }deg)`,
              transformOrigin: "0 0",
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </div>
    </div>
  )
}
