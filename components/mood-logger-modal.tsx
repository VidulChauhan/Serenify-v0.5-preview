"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Check, X } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { MoodVisualizer } from "@/components/mood-visualizer"
import { getMoodLabel, getMoodColor, getMoodBackgroundColor, getMoodDescriptors, type MoodLog } from "@/lib/mood-types"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

interface MoodLoggerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaveMood?: (moodLog: MoodLog) => void
}

export function MoodLoggerModal({ open, onOpenChange, onSaveMood }: MoodLoggerModalProps) {
  const [step, setStep] = useState<"intro" | "select" | "details" | "confirm">("intro")
  const [moodValue, setMoodValue] = useState(50)
  const [moodLabel, setMoodLabel] = useState("Neutral")
  const [moodColor, setMoodColor] = useState("#5dc7c2")
  const [moodBgColor, setMoodBgColor] = useState("#e6f7f6")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [notes, setNotes] = useState("")
  const [animateIn, setAnimateIn] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Available tags
  const availableTags = [
    "Work",
    "Family",
    "Friends",
    "Health",
    "Exercise",
    "Relaxation",
    "Hobbies",
    "Learning",
    "Outdoors",
    "Home",
    "Sleep",
    "Food",
    "Social",
    "Alone",
    "Travel",
    "Finances",
  ]

  useEffect(() => {
    // Reset to intro step when modal is opened
    if (open) {
      setStep("intro")
      setAnimateIn(true)
      // Reset after animation completes
      const timer = setTimeout(() => setAnimateIn(false), 500)
      return () => clearTimeout(timer)
    }
  }, [open])

  useEffect(() => {
    // Update mood label, color, and background based on slider value
    setMoodLabel(getMoodLabel(moodValue))
    setMoodColor(getMoodColor(moodValue))
    setMoodBgColor(getMoodBackgroundColor(moodValue))
  }, [moodValue])

  const handleSaveMood = () => {
    const newMoodLog: MoodLog = {
      id: Date.now().toString(),
      date: new Date(),
      moodValue,
      moodLabel,
      moodColor,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      notes: notes.trim() || undefined,
    }

    if (onSaveMood) {
      onSaveMood(newMoodLog)
    }

    onOpenChange(false)

    // Reset form
    setStep("intro")
    setMoodValue(50)
    setSelectedTags([])
    setNotes("")
  }

  const handleNextStep = () => {
    if (step === "intro") setStep("select")
    else if (step === "select") setStep("details")
    else if (step === "details") setStep("confirm")
    else handleSaveMood()

    // Trigger animation on step change
    setAnimateIn(true)
    const timer = setTimeout(() => setAnimateIn(false), 500)
    return () => clearTimeout(timer)
  }

  const handlePrevStep = () => {
    if (step === "select") setStep("intro")
    else if (step === "details") setStep("select")
    else if (step === "confirm") setStep("details")

    // Trigger animation on step change
    setAnimateIn(true)
    const timer = setTimeout(() => setAnimateIn(false), 500)
    return () => clearTimeout(timer)
  }

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  // Get dynamic border color based on background
  const getBorderColor = (bgColor: string) => {
    // For light backgrounds, use a slightly darker version
    // For dark backgrounds, use a slightly lighter version
    return isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.2)"
  }

  // Get dynamic shadow based on theme
  const getShadow = () => {
    return isDark
      ? "0 10px 25px -5px rgba(0, 0, 0, 0.8), 0 8px 10px -6px rgba(0, 0, 0, 0.6)"
      : "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "sm:max-w-md w-[90%] mx-auto rounded-3xl p-0 overflow-hidden transition-all duration-300",
          animateIn ? "scale-105 opacity-90" : "scale-100 opacity-100",
          step === "select" || step === "confirm" ? "bg-transparent" : "bg-[#f5f5f5] dark:bg-black",
        )}
        style={{
          borderWidth: "2px",
          borderStyle: "solid",
          borderColor:
            step === "select" || step === "confirm" ? getBorderColor(moodBgColor) : getBorderColor("#ffffff"),
          boxShadow: getShadow(),
        }}
      >
        {step === "intro" && (
          <div className="flex flex-col h-full bg-[#f5f5f5] dark:bg-black rounded-3xl">
            <div className="flex items-center justify-between p-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-500 dark:text-blue-400 p-0 h-auto"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-5 w-5" />
              </Button>
              <span className="text-lg font-semibold">Log Your Mood</span>
              <div className="w-5"></div> {/* Spacer for balance */}
            </div>

            <div className="flex-1 flex flex-col items-center justify-center px-6 pb-6 text-center">
              <div className="mb-6 h-32 w-32 transition-all duration-300 hover:scale-110">
                <MoodVisualizer moodValue={50} animated={true} />
              </div>
              <h2 className="text-2xl font-semibold mb-4">Logging Your Emotions and Moods</h2>
              <p className="mb-8 text-gray-700 dark:text-gray-300">
                Keeping track of how you are feeling can help you understand your mental wellbeing.
              </p>
              <Button
                onClick={handleNextStep}
                className="w-full rounded-full bg-blue-500 hover:bg-blue-600 text-white h-12 transition-all duration-300 hover:scale-105"
              >
                Get Started
              </Button>
            </div>
          </div>
        )}

        {step === "select" && (
          <div
            className="flex flex-col h-full rounded-3xl transition-all duration-500"
            style={{ backgroundColor: moodBgColor }}
          >
            <div className="flex items-center justify-between p-4">
              <Button variant="ghost" size="sm" className="text-blue-500 p-0 h-auto" onClick={handlePrevStep}>
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-500 p-0 h-auto"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 text-center">
              <h2 className="text-2xl font-medium mb-12 text-gray-700 dark:text-gray-200">
                Choose how you've felt overall today
              </h2>

              <div className="mb-12 h-48 w-48 transition-all duration-300">
                <MoodVisualizer moodValue={moodValue} animated={true} size="lg" />
              </div>

              <h3 className="text-xl font-semibold mb-8 text-gray-800 dark:text-white transition-all duration-300">
                {moodLabel}
              </h3>

              {/* iOS-style slider implementation */}
              <div className="w-full px-4 mb-8">
                <div className="relative w-full h-12 flex items-center">
                  {/* Track background */}
                  <div className="absolute w-full h-6 bg-gray-200/70 dark:bg-gray-700/70 rounded-full"></div>

                  {/* Filled track */}
                  <div
                    className="absolute h-6 bg-blue-500 dark:bg-blue-600 rounded-full"
                    style={{ width: `${moodValue}%` }}
                  ></div>

                  {/* Thumb */}
                  <div
                    className="absolute w-6 h-6 bg-white dark:bg-white rounded-full shadow-md transform -translate-x-1/2 cursor-pointer"
                    style={{ left: `${moodValue}%` }}
                    onMouseDown={(e) => {
                      const track = e.currentTarget.parentElement
                      if (!track) return

                      const handleMouseMove = (moveEvent: MouseEvent) => {
                        const rect = track.getBoundingClientRect()
                        const percent = Math.max(0, Math.min(100, ((moveEvent.clientX - rect.left) / rect.width) * 100))
                        setMoodValue(Math.round(percent))
                      }

                      const handleMouseUp = () => {
                        document.removeEventListener("mousemove", handleMouseMove)
                        document.removeEventListener("mouseup", handleMouseUp)
                      }

                      document.addEventListener("mousemove", handleMouseMove)
                      document.addEventListener("mouseup", handleMouseUp)
                    }}
                    onTouchStart={(e) => {
                      const track = e.currentTarget.parentElement
                      if (!track) return

                      const handleTouchMove = (moveEvent: TouchEvent) => {
                        const rect = track.getBoundingClientRect()
                        const percent = Math.max(
                          0,
                          Math.min(100, ((moveEvent.touches[0].clientX - rect.left) / rect.width) * 100),
                        )
                        setMoodValue(Math.round(percent))
                      }

                      const handleTouchEnd = () => {
                        document.removeEventListener("touchmove", handleTouchMove)
                        document.removeEventListener("touchend", handleTouchEnd)
                      }

                      document.addEventListener("touchmove", handleTouchMove)
                      document.addEventListener("touchend", handleTouchEnd)
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-2">
                  <span>VERY UNPLEASANT</span>
                  <span>VERY PLEASANT</span>
                </div>
              </div>

              <Button
                onClick={handleNextStep}
                className="w-full rounded-full h-12 text-white transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: "#0084ff" }}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {step === "details" && (
          <div className="flex flex-col h-full bg-[#f5f5f5] dark:bg-black rounded-3xl">
            <div className="flex items-center justify-between p-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-500 dark:text-blue-400 p-0 h-auto"
                onClick={handlePrevStep}
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back
              </Button>
              <span className="text-lg font-semibold">Add Details</span>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-500 dark:text-blue-400 p-0 h-auto"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
            </div>

            <div className="flex-1 overflow-auto px-6 py-4">
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-12 w-12">
                  <MoodVisualizer moodValue={moodValue} animated={false} size="sm" />
                </div>
                <div>
                  <h3 className="font-semibold">{moodLabel}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{getMoodDescriptors(moodValue).join(", ")}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">What's contributing to your mood?</h3>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <Button
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        "rounded-full text-xs transition-all",
                        selectedTags.includes(tag) ? "bg-blue-500 hover:bg-blue-600" : "",
                      )}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Notes (optional)</h3>
                <textarea
                  className="w-full h-24 p-3 border rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700"
                  placeholder="Add any thoughts or reflections..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            <div className="p-6 pt-0">
              <Button
                onClick={handleNextStep}
                className="w-full rounded-full bg-blue-500 hover:bg-blue-600 text-white h-12"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {step === "confirm" && (
          <div
            className="flex flex-col h-full rounded-3xl transition-all duration-500"
            style={{ backgroundColor: moodBgColor }}
          >
            <div className="flex items-center justify-between p-4">
              <Button variant="ghost" size="sm" className="text-blue-500 p-0 h-auto" onClick={handlePrevStep}>
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-500 p-0 h-auto"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 text-center">
              <div className="mb-6 h-32 w-32">
                <MoodVisualizer moodValue={moodValue} animated={true} />
              </div>

              <h2 className="text-2xl font-semibold mb-4">{moodLabel} Mood Logged</h2>

              <p className="mb-6 text-gray-700 dark:text-gray-200">{getMoodDescriptors(moodValue).join(", ")}</p>

              {selectedTags.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap justify-center gap-2">
                    {selectedTags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-white/50 dark:bg-gray-800/50 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <Button
                onClick={handleSaveMood}
                className="w-full rounded-full h-12 text-white flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: "#0084ff" }}
              >
                <Check className="h-5 w-5" />
                Save Mood
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
