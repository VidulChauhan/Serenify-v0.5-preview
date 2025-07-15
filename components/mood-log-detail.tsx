"use client"

import { Card, CardContent } from "@/components/ui/card"
import { MoodVisualizer } from "@/components/mood-visualizer"
import type { MoodLog } from "@/lib/mood-types"
import { format } from "date-fns"
import { getMoodDescriptors } from "@/lib/mood-types"

interface MoodLogDetailProps {
  moodLog: MoodLog
  className?: string
}

export function MoodLogDetail({ moodLog, className = "" }: MoodLogDetailProps) {
  const descriptors = getMoodDescriptors(moodLog.moodValue)

  return (
    <Card
      className={`overflow-hidden border border-gray-100 dark:border-gray-800 shadow-md hover:shadow-lg transition-shadow ${className}`}
    >
      <CardContent className="p-0">
        <div
          className="p-6"
          style={{
            backgroundColor: `${moodLog.moodColor}15`,
            borderBottom: `1px solid ${moodLog.moodColor}30`,
          }}
        >
          <div className="flex items-start gap-6">
            <div className="h-20 w-20 flex-shrink-0">
              <MoodVisualizer moodValue={moodLog.moodValue} animated={true} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold truncate">{moodLog.moodLabel} Day</h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
                    {format(new Date(moodLog.date), "h:mm a")}
                  </span>
                </div>

                <p className="text-base font-medium mt-1 text-gray-700 dark:text-gray-300 line-clamp-1">
                  {descriptors.join(", ")}
                </p>
              </div>

              {moodLog.tags && moodLog.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {moodLog.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-white/60 dark:bg-gray-800/60 rounded-full text-xs font-medium shadow-sm"
                      style={{ borderLeft: `2px solid ${moodLog.moodColor}` }}
                    >
                      {tag}
                    </span>
                  ))}
                  {moodLog.tags.length > 3 && (
                    <span className="px-3 py-1 bg-white/60 dark:bg-gray-800/60 rounded-full text-xs font-medium shadow-sm">
                      +{moodLog.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {moodLog.notes && (
          <div className="p-5 bg-white dark:bg-gray-900">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">NOTES</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">{moodLog.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
