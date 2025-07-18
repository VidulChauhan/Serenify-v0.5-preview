"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"
import { hapticFeedback, getHapticEnabled } from "@/lib/haptic-feedback"

interface HapticSwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  feedbackType?: "light" | "medium" | "heavy" | "success" | "warning" | "error"
}

const HapticSwitch = React.forwardRef<React.ElementRef<typeof SwitchPrimitives.Root>, HapticSwitchProps>(
  ({ className, feedbackType = "light", onCheckedChange, ...props }, ref) => {
    const handleCheckedChange = (checked: boolean) => {
      // Provide haptic feedback if enabled
      if (getHapticEnabled()) {
        hapticFeedback(feedbackType)
      }

      // Call the original onCheckedChange handler if provided
      if (onCheckedChange) {
        onCheckedChange(checked)
      }
    }

    return (
      <SwitchPrimitives.Root
        className={cn(
          "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
          className,
        )}
        onCheckedChange={handleCheckedChange}
        {...props}
        ref={ref}
      >
        <SwitchPrimitives.Thumb
          className={cn(
            "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
          )}
        />
      </SwitchPrimitives.Root>
    )
  },
)
HapticSwitch.displayName = SwitchPrimitives.Root.displayName

export { HapticSwitch }
