"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { BottomNavBar } from "@/components/bottom-nav-bar"
import { NewChatButton } from "@/components/new-chat-button"
import { useEffect } from "react"
import { HelloText } from "@/components/ui/hello-text"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const isChatPage = pathname.startsWith("/chat/")

  // Add dark-mode-transition class to body when component mounts
  useEffect(() => {
    document.body.classList.add("dark-mode-transition")

    // Set viewport meta tag for proper mobile handling
    const viewport = document.querySelector('meta[name="viewport"]')
    if (viewport) {
      viewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover",
      )
    } else {
      const meta = document.createElement("meta")
      meta.name = "viewport"
      meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
      document.head.appendChild(meta)
    }

    // Add PWA meta tags for better mobile experience
    const themeColor = document.querySelector('meta[name="theme-color"]')
    if (!themeColor) {
      const meta = document.createElement("meta")
      meta.name = "theme-color"
      meta.content = "#000000"
      document.head.appendChild(meta)
    }

    // Add apple-mobile-web-app-capable for iOS
    const appleCapable = document.querySelector('meta[name="apple-mobile-web-app-capable"]')
    if (!appleCapable) {
      const meta = document.createElement("meta")
      meta.name = "apple-mobile-web-app-capable"
      meta.content = "yes"
      document.head.appendChild(meta)
    }

    // Add apple-mobile-web-app-status-bar-style
    const appleStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')
    if (!appleStatusBar) {
      const meta = document.createElement("meta")
      meta.name = "apple-mobile-web-app-status-bar-style"
      meta.content = "black-translucent"
      document.head.appendChild(meta)
    }

    // Clean up function to remove the class when component unmounts
    return () => {
      document.body.classList.remove("dark-mode-transition")
    }
  }, [])

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col bg-background dark-mode-transition">
            <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 dark-mode-transition safe-area-pt">
              <div className="container flex h-16 items-center justify-center">
                <HelloText text="SERENIFY" className="transform scale-[0.3] origin-center" />
                <div className="absolute right-4">
                  <NewChatButton />
                </div>
              </div>
            </header>
            <main className={`flex-1 ${isChatPage ? "" : "pb-16"}`}>{children}</main>
            <BottomNavBar />
          </div>
        </ThemeProvider>
        <style jsx global>{`
          /* Ensure all dialogs have rounded corners */
          [role="dialog"] {
            border-radius: 24px;
            overflow: hidden;
          }
          
          /* Smooth animations for all transitions */
          * {
            transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            transition-duration: 150ms;
          }
          
          /* Improve animation performance */
          .animate-in {
            animation-duration: 300ms;
            animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          /* iOS-style bottom sheet transitions */
          .ios-sheet-enter {
            transform: translateY(100%);
          }
          
          .ios-sheet-enter-active {
            transform: translateY(0);
            transition: transform 300ms cubic-bezier(0.33, 1, 0.68, 1);
          }
          
          .ios-sheet-exit {
            transform: translateY(0);
          }
          
          .ios-sheet-exit-active {
            transform: translateY(100%);
            transition: transform 300ms cubic-bezier(0.32, 0, 0.67, 0);
          }
          
          /* Prevent horizontal scroll on mobile */
          body {
            overflow-x: hidden;
          }
          
          /* Optimize for touch devices */
          @media (hover: none) and (pointer: coarse) {
            button:hover {
              transform: none;
            }
            
            .hover\\:scale-105:hover {
              transform: none;
            }
          }
        `}</style>
      </body>
    </html>
  )
}
