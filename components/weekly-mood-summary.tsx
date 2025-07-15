"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MoodVisualizer } from "@/components/mood-visualizer"
import { type MoodLog, mockMoodLogs } from "@/lib/mood-types"
import { format, isSameDay, subDays } from "date-fns"

interface WeeklyMoodSummaryProps {
  onLogMood: () => void
  moodLogs?: MoodLog[]
}

export function WeeklyMoodSummary({ onLogMood, moodLogs = mockMoodLogs }: WeeklyMoodSummaryProps) {
  const [weekDays, setWeekDays] = useState<Date[]>([])
  const [todayIndex, setTodayIndex] = useState(0)

  useEffect(() => {
    // Generate array of dates for the current 5 days (including today and 4 days before)
    const today = new Date()

    // Create array with today and 4 previous days
    const days = []
    for (let i = 4; i >= 0; i--) {
      const day = subDays(today, i)
      days.push(day)

      // Find today's index (should be 4, the last element)
      if (isSameDay(day, today)) {
        setTodayIndex(4 - i)
      }
    }

    setWeekDays(days)
  }, [])

  // Get mood log for a specific day
  const getMoodLogForDay = (date: Date): MoodLog | undefined => {
    return moodLogs.find((log) => isSameDay(new Date(log.date), date))
  }

  return (
    <Card className="border-none shadow-sm bg-black dark:bg-black backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-white">Weekly Mood</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-5 gap-1">
          {weekDays.map((day, index) => {
            const moodLog = getMoodLogForDay(day)
            const isToday = index === todayIndex

            return (
              <div
                key={index}
                className={`flex flex-col items-center p-1 rounded-lg ${isToday ? "bg-blue-900/30" : ""}`}
              >
                <span className="text-xs text-gray-400 mb-1">{format(day, "EEE")}</span>

                <div className="relative">
                  {moodLog ? (
                    <div className="h-12 w-12 transition-transform duration-300 hover:scale-110">
                      <MoodVisualizer moodValue={moodLog.moodValue} animated={false} size="sm" />
                    </div>
                  ) : (
                    <div
                      className="h-12 w-12 rounded-full bg-gray-800/50 flex items-center justify-center"
                      onClick={isToday ? onLogMood : undefined}
                    >
                      {isToday && (
                        <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center cursor-pointer hover:bg-blue-500/30 transition-colors">
                          <span className="text-xs text-blue-400">Log</span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="text-center mt-1">
                    <span className="text-xs font-medium text-white">{format(day, "d")}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
