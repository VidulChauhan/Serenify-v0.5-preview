"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, MessageSquare, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

const navItems = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "Chats",
    href: "/chats",
    icon: MessageSquare,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function BottomNavBar() {
  const pathname = usePathname()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("/")
  const [scrolled, setScrolled] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  useEffect(() => {
    // Update active tab based on current path
    if (pathname === "/") {
      setActiveTab("/")
    } else if (pathname.startsWith("/chats") || pathname.startsWith("/chat/")) {
      setActiveTab("/chats")
    } else if (pathname.startsWith("/settings")) {
      setActiveTab("/settings")
    }

    // Add scroll listener to adjust blur effect
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    // Check if window is available (client-side)
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll)
      return () => window.removeEventListener("scroll", handleScroll)
    }
  }, [pathname])

  const handleNavClick = (href: string) => {
    if (activeTab !== href) {
      setActiveTab(href)
    }
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 z-50 w-full border-t transition-all duration-300 safe-area-pb",
        isDark ? "border-gray-800 bg-black/80 backdrop-blur-md" : "border-gray-200 bg-background/80 backdrop-blur-md",
        scrolled ? "shadow-lg" : "",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-md items-center justify-around px-4">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center rounded-md px-3 py-2 text-xs font-medium transition-colors touch-manipulation",
              activeTab === item.href
                ? "text-primary"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300",
            )}
            onClick={() => handleNavClick(item.href)}
          >
            <item.icon
              className={cn(
                "mb-1 h-6 w-6",
                activeTab === item.href ? "text-primary" : "text-gray-500 dark:text-gray-400",
              )}
            />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
