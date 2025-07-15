"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Apple, Mail, ArrowLeft } from "lucide-react"

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLogin: () => void
}

export function LoginModal({ open, onOpenChange, onLogin }: LoginModalProps) {
  const [step, setStep] = useState<"options" | "email" | "details">("options")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [age, setAge] = useState("")

  const handleEmailContinue = () => {
    if (email) {
      setStep("details")
    }
  }

  const handleSubmit = () => {
    if (name && age) {
      onLogin()
      onOpenChange(false)
      // Reset form
      setStep("options")
      setEmail("")
      setName("")
      setAge("")
    }
  }

  const handleGoogleLogin = () => {
    onLogin()
    onOpenChange(false)
  }

  const handleAppleLogin = () => {
    onLogin()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-xl border-2 shadow-lg">
        <DialogHeader>
          {step !== "options" && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-4 h-8 w-8 rounded-full p-0"
              onClick={() => {
                setStep(step === "details" ? "email" : "options")
              }}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          )}
          <DialogTitle className="text-xl px-4 pt-2">
            {step === "options" && "Welcome to Serenify"}
            {step === "email" && "Sign in with Email"}
            {step === "details" && "Complete Your Profile"}
          </DialogTitle>
          <DialogDescription className="px-4 pb-2">
            {step === "options" && "Choose how you'd like to continue"}
            {step === "email" && "Enter your email address to continue"}
            {step === "details" && "Tell us a bit about yourself"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-4 py-4 px-6">
          {step === "options" && (
            <>
              <Button
                onClick={handleGoogleLogin}
                className="flex items-center justify-start space-x-2 h-12 w-full rounded-full bg-primary hover:bg-primary/90"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                Continue with Google
              </Button>

              <Button
                onClick={handleAppleLogin}
                className="flex items-center justify-start space-x-2 h-12 w-full rounded-full bg-primary hover:bg-primary/90"
              >
                <Apple className="h-5 w-5 mr-2" />
                Continue with Apple
              </Button>

              <Button
                onClick={() => setStep("email")}
                className="flex items-center justify-start space-x-2 h-12 w-full rounded-full bg-primary hover:bg-primary/90"
              >
                <Mail className="h-5 w-5 mr-2" />
                Continue with Email
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-background px-4 py-1 text-muted-foreground">
                    By continuing, you agree to our Terms of Service
                  </span>
                </div>
              </div>
            </>
          )}

          {step === "email" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="px-1">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl px-4 py-2"
                />
              </div>
              <Button
                onClick={handleEmailContinue}
                disabled={!email}
                className="w-full h-12 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-50"
              >
                Continue
              </Button>
            </div>
          )}

          {step === "details" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="px-1">
                  Full Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl px-4 py-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age" className="px-1">
                  Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="rounded-xl px-4 py-2"
                />
              </div>
              <Button
                onClick={handleSubmit}
                disabled={!name || !age}
                className="w-full h-12 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-50"
              >
                Complete Sign Up
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
