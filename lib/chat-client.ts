"use client"

import { saveUserMessage, saveAIMessage } from "@/app/actions/chat-actions"
import type { ChatMessage } from "@/lib/chat-storage"

// Emergency fallback responses
const EMERGENCY_FALLBACK_RESPONSES = [
  "I'm here to listen and support you. While I'm experiencing some technical difficulties, I want you to know that your feelings are valid and important.",
  "Thank you for reaching out. Even though I'm having some connectivity issues, I want to remind you that you're not alone and it's okay to take things one step at a time.",
  "I appreciate you sharing with me. While I work through some technical challenges, please remember that seeking support is a sign of strength, not weakness.",
  "I'm experiencing some technical difficulties, but I want you to know that I care about your wellbeing. If you're in crisis, please reach out to a mental health professional or crisis hotline.",
]

export async function getStreamingResponse(
  chatId: string,
  userMessage: string,
  previousMessages: ChatMessage[],
  onChunk: (chunk: string) => void,
) {
  console.log("=== Starting getStreamingResponse ===")

  try {
    // Save the user message first
    console.log("💾 Saving user message...")
    const savedUserMessage = await saveUserMessage(chatId, userMessage)
    console.log("✅ User message saved successfully")

    // Format messages for the API
    const formattedMessages = previousMessages
      .filter((msg) => msg && typeof msg === "object")
      .map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: String(msg.content || "").trim(),
      }))
      .filter((msg) => msg.content) // Remove empty messages

    // Add the new user message
    formattedMessages.push({
      role: "user",
      content: userMessage,
    })

    console.log(`📤 Sending ${formattedMessages.length} messages to API`)

    let fullResponse = ""

    try {
      console.log("🔄 Making API call...")

      // Create abort controller for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => {
        console.log("⏰ Request timeout")
        controller.abort()
      }, 30000) // 30 second timeout

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: formattedMessages }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }

      console.log("✅ API call successful, processing stream...")
      fullResponse = await processStreamResponse(response, onChunk)

      if (!fullResponse.trim()) {
        throw new Error("Empty response received")
      }

      console.log("✅ Stream processed successfully")
    } catch (error) {
      console.error("❌ API call failed:", error)

      // Use emergency fallback response
      const randomIndex = Math.floor(Math.random() * EMERGENCY_FALLBACK_RESPONSES.length)
      fullResponse = EMERGENCY_FALLBACK_RESPONSES[randomIndex]

      console.log("🆘 Using emergency fallback response")
      onChunk(fullResponse)
    }

    // Save the AI response
    console.log("💾 Saving AI response...")
    const savedAIMessage = await saveAIMessage(chatId, fullResponse)
    console.log("✅ AI response saved successfully")

    return {
      userMessage: savedUserMessage,
      aiMessage: savedAIMessage,
    }
  } catch (error) {
    console.error("❌ Critical error in getStreamingResponse:", error)

    // Last resort emergency response
    const emergencyResponse =
      "I'm here to support you, though I'm experiencing some technical difficulties. Your wellbeing matters, and if you need immediate help, please reach out to a mental health professional."

    try {
      const savedUserMessage = await saveUserMessage(chatId, userMessage)
      const savedAIMessage = await saveAIMessage(chatId, emergencyResponse)

      onChunk(emergencyResponse)

      return {
        userMessage: savedUserMessage,
        aiMessage: savedAIMessage,
      }
    } catch (saveError) {
      console.error("❌ Failed to save messages:", saveError)
      throw new Error(`Failed to process chat: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }
}

async function processStreamResponse(response: Response, onChunk: (chunk: string) => void): Promise<string> {
  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error("Failed to get response reader")
  }

  const decoder = new TextDecoder()
  let fullResponse = ""
  let buffer = ""

  try {
    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        console.log("✅ Stream reading completed")
        break
      }

      buffer += decoder.decode(value, { stream: true })

      // Process SSE format
      const lines = buffer.split("\n")
      let processedLines = 0

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          processedLines++
          const data = line.substring(6).trim()

          if (data === "[DONE]") {
            continue
          }

          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices?.[0]?.delta?.content || ""

            if (content) {
              fullResponse += content
              onChunk(fullResponse)
            }
          } catch (e) {
            // Ignore JSON parse errors for incomplete chunks
          }
        }
      }

      // Keep unprocessed data in buffer
      if (processedLines > 0) {
        const lastProcessedIndex = buffer.lastIndexOf("\n")
        if (lastProcessedIndex !== -1) {
          buffer = buffer.substring(lastProcessedIndex + 1)
        }
      }
    }
  } finally {
    reader.releaseLock()
  }

  return fullResponse
}
