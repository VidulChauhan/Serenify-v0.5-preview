"use server"

import { v4 as uuidv4 } from "uuid"
import { addMessageToChat, type ChatMessage } from "@/lib/chat-storage"

// Function to save a user message to the chat
export async function saveUserMessage(chatId: string, content: string): Promise<ChatMessage> {
  const messageId = uuidv4()
  const timestamp = new Date()

  const userChatMessage: ChatMessage = {
    id: messageId,
    content,
    sender: "user",
    timestamp,
  }

  addMessageToChat(chatId, userChatMessage)
  return userChatMessage
}

// Function to save an AI message to the chat
export async function saveAIMessage(chatId: string, content: string): Promise<ChatMessage> {
  const messageId = uuidv4()
  const timestamp = new Date()

  const aiChatMessage: ChatMessage = {
    id: messageId,
    content,
    sender: "assistant",
    timestamp,
  }

  addMessageToChat(chatId, aiChatMessage)
  return aiChatMessage
}
