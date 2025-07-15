"use client"

// Haptic feedback utility for mobile devices
export function triggerHapticFeedback(type: "light" | "medium" | "heavy" | "selection" = "light") {
  // Check if the device supports haptic feedback
  if (typeof window !== "undefined" && "navigator" in window) {
    // For devices that support the Vibration API
    if ("vibrate" in navigator) {
      switch (type) {
        case "light":
          navigator.vibrate(10)
          break
        case "medium":
          navigator.vibrate(20)
          break
        case "heavy":
          navigator.vibrate(50)
          break
        case "selection":
          navigator.vibrate(5)
          break
      }
    }

    // For iOS devices with haptic feedback support
    if ("hapticFeedback" in window) {
      try {
        // @ts-ignore - iOS specific API
        window.hapticFeedback.impact(type)
      } catch (error) {
        // Silently fail if haptic feedback is not available
      }
    }
  }
}

// Utility to check if haptic feedback is supported
export function isHapticFeedbackSupported(): boolean {
  if (typeof window === "undefined") return false

  return "vibrate" in navigator || "hapticFeedback" in window
}

// Utility for button press feedback
export function buttonPressHaptic() {
  triggerHapticFeedback("light")
}

// Utility for success feedback
export function successHaptic() {
  triggerHapticFeedback("medium")
}

// Utility for error feedback
export function errorHaptic() {
  triggerHapticFeedback("heavy")
}

// Utility for selection feedback
export function selectionHaptic() {
  triggerHapticFeedback("selection")
}
