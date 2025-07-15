"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircleIcon as ChatBubble, PlusCircle } from "lucide-react"
import { MoodLoggerModal } from "@/components/mood-logger-modal"
import { RecentChats } from "@/components/recent-chats"
import { WeeklyMoodSummary } from "@/components/weekly-mood-summary"
import { MoodLogDetail } from "@/components/mood-log-detail"
import { type MoodLog, mockMoodLogs } from "@/lib/mood-types"
import { useTheme } from "next-themes"

export default function Home() {
  const [moodLoggerOpen, setMoodLoggerOpen] = useState(false)
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>(mockMoodLogs)
  const { theme } = useTheme()

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const handleSaveMood = (newMoodLog: MoodLog) => {
    setMoodLogs([newMoodLog, ...moodLogs])
  }

  // Get today's mood log if it exists
  const todaysMoodLog = moodLogs.find((log) => new Date(log.date).toDateString() === new Date().toDateString())

  // Get the most recent mood log
  const latestMoodLog = moodLogs[0]

  return (
    <div className="container space-y-6 py-6">
      <section className="space-y-2 text-left">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">{greeting()}</h2>
          <p className="text-muted-foreground">How are you feeling today? I'm here to support you.</p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Today's Mood</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMoodLoggerOpen(true)}
            className="text-blue-500 dark:text-blue-400 flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            <span>{todaysMoodLog ? "Update" : "Log"}</span>
          </Button>
        </div>

        {!todaysMoodLog ? (
          <Card className="overflow-hidden border border-dashed border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <div className="h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-200 dark:bg-blue-800/50 flex items-center justify-center">
                  <span className="text-blue-500 dark:text-blue-400 text-lg">+</span>
                </div>
              </div>
              <h3 className="text-lg font-medium mb-2">No mood logged today</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Tracking your mood can help you understand your emotional patterns.
              </p>
              <Button
                onClick={() => setMoodLoggerOpen(true)}
                className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
              >
                Log Your Mood
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="animate-in fade-in-50 duration-500">
            <MoodLogDetail moodLog={todaysMoodLog} className="rounded-xl" />
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Weekly Overview</h3>
        </div>
        <WeeklyMoodSummary onLogMood={() => setMoodLoggerOpen(true)} moodLogs={moodLogs} />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Recent Conversations</h3>
        </div>
        <RecentChats />

        <Card className="border-dashed shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <ChatBubble className="mb-2 h-10 w-10 text-muted-foreground" />
            <h3 className="mb-1 text-lg font-medium">Start a new conversation</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              I'm here to listen and support you whenever you need it.
            </p>
            <Button
              onClick={() => (window.location.href = "/chat/new")}
              className="h-12 px-6 rounded-full bg-primary hover:bg-primary/90"
            >
              New Chat
            </Button>
          </CardContent>
        </Card>
      </section>

      <MoodLoggerModal open={moodLoggerOpen} onOpenChange={setMoodLoggerOpen} onSaveMood={handleSaveMood} />
    </div>
  )
}
