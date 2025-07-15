"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getSavedChats, type Chat } from "@/lib/chat-storage"
import { formatDistanceToNow } from "date-fns"

export function RecentChats() {
  const router = useRouter()
  const [recentChats, setRecentChats] = useState<Chat[]>([])

  useEffect(() => {
    // Get the 3 most recent chats
    const chats = getSavedChats().slice(0, 3)
    setRecentChats(chats)
  }, [])

  const handleChatClick = (id: string) => {
    router.push(`/chat/${id}`)
  }

  const formatTimestamp = (date: Date): string => {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  }

  if (recentChats.length === 0) {
    return (
      <Card className="border-dashed shadow-sm">
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <p className="text-sm text-muted-foreground">No recent conversations</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {recentChats.map((chat) => (
        <Card key={chat.id} className="cursor-pointer hover:bg-accent/50" onClick={() => handleChatClick(chat.id)}>
          <CardContent className="flex items-start gap-4 p-4">
            <Avatar className="mt-1 bg-primary/10">
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1 overflow-hidden">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{chat.title}</h4>
                <span className="text-xs text-muted-foreground">{formatTimestamp(chat.timestamp)}</span>
              </div>
              <p className="truncate text-sm text-muted-foreground">{chat.lastMessage}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
