"use client"

import * as React from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { hapticFeedback, getHapticEnabled } from "@/lib/haptic-feedback"

interface HapticButtonProps extends ButtonProps {
  feedbackType?: "light" | "medium" | "heavy" | "success" | "warning" | "error"
}

const HapticButton = React.forwardRef<HTMLButtonElement, HapticButtonProps>(
  ({ feedbackType = "light", onClick, ...props }, ref) => {
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      // Provide haptic feedback if enabled
      if (getHapticEnabled()) {
        hapticFeedback(feedbackType)
      }

      // Call the original onClick handler if provided
      if (onClick) {
        onClick(event)
      }
    }

    return <Button ref={ref} onClick={handleClick} {...props} />
  },
)

HapticButton.displayName = "HapticButton"

export { HapticButton }
