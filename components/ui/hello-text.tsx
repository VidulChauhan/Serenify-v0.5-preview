"use client"
import { cn } from "@/lib/utils"

interface HelloTextProps {
  text: string
  className?: string
}

export function HelloText({ text, className }: HelloTextProps) {
  const letters = text.split("")

  return (
    <div className={cn("flex items-center justify-center", className)}>
      {letters.map((letter, index) => {
        // Special styling for 'O' to make it outlined
        const isO = letter.toLowerCase() === "o"

        return (
          <span
            key={index}
            className={cn(
              "text-6xl md:text-7xl lg:text-8xl font-black tracking-tight",
              isO
                ? "text-transparent border-4 border-white rounded-lg px-2 py-1 inline-flex items-center justify-center min-w-[1.2em]"
                : "text-white",
            )}
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 900,
              letterSpacing: "-0.02em",
            }}
          >
            {letter === " " ? "\u00A0" : letter}
          </span>
        )
      })}
    </div>
  )
}
