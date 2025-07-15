"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)

  // Ensure theme persistence and prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true)

    // Add CSS transition class for smooth theme transitions
    const addTransitionClass = () => {
      document.documentElement.classList.add("theme-transition")
      setTimeout(() => {
        document.documentElement.classList.remove("theme-transition")
      }, 300)
    }

    // Listen for storage changes to sync theme across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "serenify-theme" && e.newValue) {
        addTransitionClass()
      }
    }

    // Listen for custom theme change events
    const handleThemeChange = () => {
      addTransitionClass()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("themechange", handleThemeChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("themechange", handleThemeChange)
    }
  }, [])

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <NextThemesProvider
      {...props}
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
      enableColorScheme={true}
      storageKey="serenify-theme"
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  )
}
