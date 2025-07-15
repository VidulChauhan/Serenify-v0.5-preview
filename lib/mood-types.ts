export interface MoodLog {
  id: string
  date: Date
  moodValue: number
  moodLabel: string
  moodColor: string
  tags?: string[]
  notes?: string
}

export function getMoodLabel(moodValue: number): string {
  if (moodValue < 15) return "Very Unpleasant"
  if (moodValue < 30) return "Unpleasant"
  if (moodValue < 45) return "Slightly Unpleasant"
  if (moodValue < 55) return "Neutral"
  if (moodValue < 70) return "Slightly Pleasant"
  if (moodValue < 85) return "Pleasant"
  return "Very Pleasant"
}

export function getMoodColor(moodValue: number): string {
  if (moodValue < 15) return "#8a56e8" // Very Unpleasant - purple
  if (moodValue < 30) return "#5b7bf7" // Unpleasant - blue
  if (moodValue < 45) return "#4a9be8" // Slightly unpleasant - light blue
  if (moodValue < 55) return "#5dc7c2" // Neutral - teal
  if (moodValue < 70) return "#7ac555" // Slightly pleasant - light green
  if (moodValue < 85) return "#a8d06c" // Pleasant - green
  return "#f0b840" // Very Pleasant - yellow/gold
}

export function getMoodBackgroundColor(moodValue: number): string {
  if (moodValue < 15) return "#e2d9f7" // Very Unpleasant - light purple
  if (moodValue < 30) return "#dce4fd" // Unpleasant - light blue
  if (moodValue < 45) return "#d9ebfd" // Slightly unpleasant - lighter blue
  if (moodValue < 55) return "#e6f7f6" // Neutral - light teal
  if (moodValue < 70) return "#e8f7df" // Slightly pleasant - light green
  if (moodValue < 85) return "#f0f9e6" // Pleasant - lighter green
  return "#fdf6e6" // Very Pleasant - light yellow
}

export function getMoodDescriptors(moodValue: number): string[] {
  if (moodValue < 15) return ["Distressed", "Miserable", "Overwhelmed"]
  if (moodValue < 30) return ["Sad", "Anxious", "Frustrated"]
  if (moodValue < 45) return ["Uneasy", "Concerned", "Tired"]
  if (moodValue < 55) return ["Calm", "Balanced", "Okay"]
  if (moodValue < 70) return ["Content", "Relaxed", "Satisfied"]
  if (moodValue < 85) return ["Happy", "Optimistic", "Energetic"]
  return ["Grateful", "Joyful", "Excited"]
}

// Mock data for development
export const mockMoodLogs: MoodLog[] = [
  {
    id: "1",
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    moodValue: 85,
    moodLabel: "Very Pleasant",
    moodColor: "#f0b840",
    tags: ["Family", "Relaxation", "Outdoors"],
    notes: "Had a great day at the park with family.",
  },
  {
    id: "2",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    moodValue: 65,
    moodLabel: "Slightly Pleasant",
    moodColor: "#7ac555",
    tags: ["Work", "Achievement"],
    notes: "Completed a big project at work.",
  },
  {
    id: "3",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    moodValue: 50,
    moodLabel: "Neutral",
    moodColor: "#5dc7c2",
    tags: ["Routine", "Rest"],
    notes: "Just an ordinary day.",
  },
  {
    id: "4",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday
    moodValue: 30,
    moodLabel: "Unpleasant",
    moodColor: "#5b7bf7",
    tags: ["Stress", "Work", "Health"],
    notes: "Feeling under the weather and work was stressful.",
  },
]
