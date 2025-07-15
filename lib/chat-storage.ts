import { v4 as uuidv4 } from "uuid"

export interface ChatMessage {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: Date
}

export interface Chat {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  messages: ChatMessage[]
}

// Helper to safely parse dates from JSON
const reviver = (key: string, value: any) => {
  if (key === "timestamp" || key === "date") {
    return new Date(value)
  }
  return value
}

// Get all saved chats
export function getSavedChats(): Chat[] {
  try {
    if (typeof window === "undefined") return []

    const chats = localStorage.getItem("serenify-chats")
    if (!chats) return []

    return JSON.parse(chats, reviver).sort(
      (a: Chat, b: Chat) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
  } catch (error) {
    console.error("Error retrieving chats:", error)
    return []
  }
}

// Get a specific chat by ID
export function getChatById(id: string): Chat | null {
  try {
    const chats = getSavedChats()
    return chats.find((chat) => chat.id === id) || null
  } catch (error) {
    console.error("Error retrieving chat:", error)
    return null
  }
}

// Save a chat (create or update)
export function saveChat(chat: Chat): void {
  try {
    if (typeof window === "undefined") return

    const chats = getSavedChats()
    const existingIndex = chats.findIndex((c) => c.id === chat.id)

    if (existingIndex >= 0) {
      chats[existingIndex] = chat
    } else {
      chats.unshift(chat)
    }

    localStorage.setItem("serenify-chats", JSON.stringify(chats))
  } catch (error) {
    console.error("Error saving chat:", error)
  }
}

// Delete a chat by ID
export function deleteChat(id: string): void {
  try {
    if (typeof window === "undefined") return

    const chats = getSavedChats()
    const updatedChats = chats.filter((chat) => chat.id !== id)

    localStorage.setItem("serenify-chats", JSON.stringify(updatedChats))
  } catch (error) {
    console.error("Error deleting chat:", error)
  }
}

// Create a new chat
export function createNewChat(): Chat {
  const newId = uuidv4()
  const now = new Date()

  const newChat: Chat = {
    id: newId,
    title: "New Conversation",
    lastMessage: "Hi there! I'm your AI mental health assistant. How are you feeling today?",
    timestamp: now,
    messages: [
      {
        id: uuidv4(),
        content:
          "Hi there! I'm your AI mental health assistant. How are you feeling today? I'm here to listen and support you. Feel free to share whatever is on your mind, whether you're looking for coping strategies, need someone to talk to, or just want to reflect on your emotions.",
        sender: "assistant",
        timestamp: now,
      },
    ],
  }

  saveChat(newChat)
  return newChat
}

// Update chat title based on content
export function generateChatTitle(messages: ChatMessage[]): string {
  // Find first user message
  const firstUserMessage = messages.find((msg) => msg.sender === "user")

  if (firstUserMessage) {
    // Use first 30 chars of first user message as title
    const title = firstUserMessage.content.substring(0, 30)
    return title.length < firstUserMessage.content.length ? `${title}...` : title
  }

  return "New Conversation"
}

// Update a chat with a new message
export function addMessageToChat(chatId: string, message: ChatMessage): Chat {
  const chat = getChatById(chatId)

  if (!chat) {
    throw new Error(`Chat with ID ${chatId} not found`)
  }

  chat.messages.push(message)
  chat.lastMessage = message.content
  chat.timestamp = message.timestamp

  // Generate title from first user message if this is the first user message
  if (message.sender === "user" && chat.messages.filter((m) => m.sender === "user").length === 1) {
    chat.title = generateChatTitle(chat.messages)
  }

  saveChat(chat)
  return chat
}
