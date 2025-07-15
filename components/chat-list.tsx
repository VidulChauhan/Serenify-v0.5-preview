"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { getSavedChats, deleteChat, type Chat } from "@/lib/chat-storage"
import { formatDistanceToNow } from "date-fns"

interface ChatListProps {
  searchQuery: string
}

export function ChatList({ searchQuery }: ChatListProps) {
  const router = useRouter()
  const [chats, setChats] = useState<Chat[]>(getSavedChats())
  const [chatToDelete, setChatToDelete] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Filter chats based on search query
  const filteredChats = chats.filter(
    (chat) =>
      chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Group chats by date
  const groupedChats: Record<string, Chat[]> = {}

  filteredChats.forEach((chat) => {
    const today = new Date()
    const chatDate = new Date(chat.timestamp)

    let dateGroup = "Older"

    if (chatDate.toDateString() === today.toDateString()) {
      dateGroup = "Today"
    } else if (chatDate.toDateString() === new Date(today.setDate(today.getDate() - 1)).toDateString()) {
      dateGroup = "Yesterday"
    } else if (chatDate > new Date(today.setDate(today.getDate() - 6))) {
      dateGroup = "This Week"
    } else if (chatDate > new Date(today.setDate(today.getDate() - 30))) {
      dateGroup = "This Month"
    }

    if (!groupedChats[dateGroup]) {
      groupedChats[dateGroup] = []
    }

    groupedChats[dateGroup].push(chat)
  })

  const handleChatClick = (id: string) => {
    router.push(`/chat/${id}`)
  }

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setChatToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (chatToDelete) {
      deleteChat(chatToDelete)
      setChats(getSavedChats())
      setChatToDelete(null)
    }
  }

  const formatTimestamp = (date: Date): string => {
    return formatDistanceToNow(new Date(date), { addSuffix: false })
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedChats).map(([date, dateChats]) => (
        <div key={date} className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">{date}</h3>
          {dateChats.map((chat) => (
            <Card
              key={chat.id}
              className="cursor-pointer hover:bg-accent/50 relative group"
              onClick={() => handleChatClick(chat.id)}
            >
              <CardContent className="flex items-start gap-4 p-4">
                <Avatar className="mt-1 bg-primary/10">
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1 overflow-hidden pr-8">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{chat.title}</h4>
                    <span className="text-xs text-muted-foreground">{formatTimestamp(chat.timestamp)}</span>
                  </div>
                  <p className="truncate text-sm text-muted-foreground">{chat.lastMessage}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-3 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => handleDeleteClick(e, chat.id)}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ))}

      {filteredChats.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground">No conversations found</p>
          {searchQuery && <p className="text-sm text-muted-foreground">Try a different search term</p>}
        </div>
      )}

      <DeleteConfirmationDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} onConfirm={confirmDelete} />
    </div>
  )
}
