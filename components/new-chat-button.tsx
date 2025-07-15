"use client"

import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { createNewChat } from "@/lib/chat-storage"
import { Button } from "@/components/ui/button"

export function NewChatButton() {
  const router = useRouter()

  const handleNewChat = () => {
    // Create a new chat and navigate to it
    const newChat = createNewChat()
    router.push(`/chat/${newChat.id}`)
  }

  return (
    <Button
      onClick={handleNewChat}
      size="icon"
      className="h-9 w-9 rounded-full bg-primary hover:bg-primary/90"
      aria-label="New Chat"
    >
      <Plus className="h-4 w-4" />
    </Button>
  )
}
