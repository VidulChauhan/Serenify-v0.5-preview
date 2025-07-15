"use client"

import { useState } from "react"
import { Moon, Sun, User, Bell, Shield, HelpCircle, Info } from "lucide-react"
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LoginModal } from "@/components/login-modal"
import { EditProfileModal } from "@/components/edit-profile-modal"
import { TiltedCard } from "@/components/ui/tilted-card"
import { CircularText } from "@/components/ui/circular-text"

interface ProfileData {
  name: string
  email: string
  avatar?: string
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(true) // Set to true for demo purposes
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "Jane Doe",
    email: "jane.doe@example.com",
    avatar: "/placeholder.svg?height=64&width=64",
  })

  const handleSaveProfile = (data: ProfileData) => {
    setProfileData(data)
  }

  return (
    <div className="container space-y-6 py-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your app preferences and account settings.</p>
      </div>

      {isLoggedIn ? (
        <TiltedCard className="w-full">
          <div className="relative p-8 bg-gradient-to-br from-gray-300 via-gray-200 to-gray-400 dark:from-gray-600 dark:via-gray-500 dark:to-gray-700 rounded-2xl overflow-hidden">
            {/* Metallic shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-shine"></div>

            {/* Content */}
            <div className="relative z-10 flex items-center space-x-6">
              <div className="relative">
                {/* Circular text around avatar */}
                <div className="absolute -inset-8 flex items-center justify-center">
                  <CircularText
                    text="• SERENIFY USER • MENTAL HEALTH • "
                    className="text-gray-800 dark:text-gray-200"
                    radius={60}
                    fontSize={11}
                    speed="15s"
                  />
                </div>

                <Avatar className="h-20 w-20 border-4 border-white/50 shadow-2xl relative z-10">
                  <AvatarImage src={profileData.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-br from-gray-600 to-gray-800 text-white text-2xl font-bold">
                    {profileData.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{profileData.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{profileData.email}</p>

                <div className="flex space-x-3">
                  <Button
                    onClick={() => setEditProfileOpen(true)}
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs bg-white/60 backdrop-blur-sm text-gray-800 hover:bg-white/80 border-white/30 font-medium"
                  >
                    Edit Profile
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs bg-black/20 backdrop-blur-sm text-gray-800 dark:text-white hover:bg-black/30 border-black/20 font-medium"
                    onClick={() => setIsLoggedIn(false)}
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>

            {/* Subtle pattern overlay */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, rgba(0,0,0,0.1) 1px, transparent 1px),
                   radial-gradient(circle at 75% 75%, rgba(0,0,0,0.1) 1px, transparent 1px)`,
                backgroundSize: "30px 30px",
              }}
            ></div>
          </div>
        </TiltedCard>
      ) : (
        <Card className="overflow-hidden">
          <CardHeader className="pb-0">
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Account
            </CardTitle>
            <CardDescription>Manage your profile and account settings</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Avatar className="mb-4 h-20 w-20">
                <AvatarFallback>
                  <User className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <h3 className="mb-2 text-lg font-medium">Not Signed In</h3>
              <p className="mb-4 text-sm text-muted-foreground">Sign in to sync your data and access all features</p>
              <Button
                onClick={() => setLoginModalOpen(true)}
                className="h-12 px-6 rounded-full bg-primary hover:bg-primary/90"
              >
                Sign Up / Login
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sun className="mr-2 h-5 w-5 dark:hidden" />
            <Moon className="mr-2 h-5 w-5 hidden dark:block" />
            Appearance
          </CardTitle>
          <CardDescription>Customize how Serenify looks and feels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              <span>Dark Mode</span>
            </div>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(checked) => {
                const newTheme = checked ? "dark" : "light"
                setTheme(newTheme)

                // Dispatch custom event for theme change
                window.dispatchEvent(
                  new CustomEvent("themechange", {
                    detail: { theme: newTheme },
                  }),
                )
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Manage your notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Enable Notifications</span>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Privacy & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start rounded-xl">
            Privacy Policy
          </Button>
          <Button variant="outline" className="w-full justify-start rounded-xl">
            Terms of Service
          </Button>
          <Button variant="outline" className="w-full justify-start rounded-xl">
            Data & Privacy Settings
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <HelpCircle className="mr-2 h-5 w-5" />
            Help & Support
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start rounded-xl">
            Contact Support
          </Button>
          <Button variant="outline" className="w-full justify-start rounded-xl">
            FAQs
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Info className="mr-2 h-5 w-5" />
            About
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Serenify v1.0.0</p>
            <p className="text-sm text-muted-foreground">Your personal AI mental health companion</p>
          </div>
        </CardContent>
      </Card>

      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} onLogin={() => setIsLoggedIn(true)} />

      <EditProfileModal
        open={editProfileOpen}
        onOpenChange={setEditProfileOpen}
        onSave={handleSaveProfile}
        initialData={profileData}
      />
    </div>
  )
}
