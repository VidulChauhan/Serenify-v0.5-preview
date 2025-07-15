"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ChatList } from "@/components/chat-list"

export default function ChatsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)

  // Force refresh when the page is visited
  useEffect(() => {
    setRefreshKey((prev) => prev + 1)
  }, [])

  return (
    <div className="container space-y-6 py-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Conversations</h2>
        <p className="text-muted-foreground">Your chat history with your AI mental health assistant.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search conversations..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <ChatList key={refreshKey} searchQuery={searchQuery} />
    </div>
  )
}
