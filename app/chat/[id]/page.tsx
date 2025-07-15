"use client"

import { useState, useRef, useEffect } from "react"
import { Send, ArrowLeft, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { VerificationBadge } from "@/components/verification-badge"
import { getChatById, createNewChat, type ChatMessage } from "@/lib/chat-storage"
import { v4 as uuidv4 } from "uuid"
import { getStreamingResponse } from "@/lib/chat-client"

export default function ChatPage({ params }: { params: { id: string } }) {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [currentStreamedMessage, setCurrentStreamedMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Load chat messages
  useEffect(() => {
    const loadChat = async () => {
      try {
        console.log("Loading chat messages for ID:", params.id)
        setIsLoading(true)
        setError(null)

        const chat = getChatById(params.id)

        if (chat) {
          console.log("Chat found, setting messages")
          setMessages(chat.messages)
        } else if (params.id !== "new") {
          console.log("Chat not found and not 'new', creating new chat")
          const newChat = createNewChat()
          setMessages(newChat.messages)
          router.replace(`/chat/${newChat.id}`)
        } else {
          console.log("Creating new chat for 'new' route")
          const newChat = createNewChat()
          setMessages(newChat.messages)
          router.replace(`/chat/${newChat.id}`)
        }
      } catch (error) {
        console.error("Error loading chat:", error)
        setError("Failed to load chat. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    loadChat()
  }, [params.id, router])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, currentStreamedMessage])

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return

    const userInput = input.trim()
    setInput("")
    setIsTyping(true)
    setCurrentStreamedMessage("")
    setError(null)

    // Create a temporary user message for immediate UI feedback
    const tempUserMessage: ChatMessage = {
      id: uuidv4(),
      content: userInput,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prevMessages) => [...prevMessages, tempUserMessage])

    try {
      console.log("Sending message:", userInput)

      // Get streaming response
      const { userMessage, aiMessage } = await getStreamingResponse(params.id, userInput, messages, (chunk) => {
        setCurrentStreamedMessage(chunk)
      })

      // Update messages with the saved messages
      setMessages((prevMessages) => {
        // Remove the temporary user message and add the real ones
        const filteredMessages = prevMessages.filter((msg) => msg.id !== tempUserMessage.id)
        return [...filteredMessages, userMessage, aiMessage]
      })

      console.log("✅ Message exchange completed successfully")
    } catch (error) {
      console.error("Error in chat:", error)
      setError(null) // Don't show technical errors to users

      // Create a fallback AI message directly in the UI
      const fallbackMessage: ChatMessage = {
        id: uuidv4(),
        content:
          "I'm here to support you, though I'm experiencing some technical difficulties. How can I help you today?",
        sender: "assistant",
        timestamp: new Date(),
      }

      // Update messages with the user message and fallback response
      setMessages((prevMessages) => {
        // Keep the user message but add our fallback
        return [...prevMessages, fallbackMessage]
      })
    } finally {
      setIsTyping(false)
      setCurrentStreamedMessage("")
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading chat...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* iOS-style header */}
      <div className="sticky top-0 z-40 flex h-12 items-center justify-between border-b border-gray-200 bg-background/80 px-4 dark:border-gray-800 dark:bg-black/80 backdrop-blur-md">
        <Button variant="ghost" size="icon" onClick={() => router.push("/chats")} className="rounded-full p-1">
          <ArrowLeft className="h-5 w-5 text-primary" />
        </Button>
        <div className="flex items-center">
          <Avatar className="h-7 w-7 mr-2 bg-primary/10">
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <span className="font-medium">Serenify Assistant (Gemini)</span>
          <VerificationBadge size="sm" className="ml-1" />
        </div>
        <div className="w-8"></div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 px-4 py-2">
          <div className="flex items-center text-sm text-red-600 dark:text-red-400">
            <AlertCircle className="h-4 w-4 mr-2" />
            {error}
          </div>
        </div>
      )}

      {/* Chat messages container with increased bottom padding */}
      <div className="flex-1 overflow-y-auto bg-background dark:bg-black px-4 py-4 pb-32">
        <div className="space-y-3">
          {messages.map((message, index) => {
            const showTimestamp =
              index === 0 ||
              new Date(message.timestamp).getTime() - new Date(messages[index - 1].timestamp).getTime() > 5 * 60 * 1000

            return (
              <div key={message.id}>
                {showTimestamp && (
                  <div className="flex justify-center my-2">
                    <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                )}
                <div className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] animate-bubble-expand ${
                      message.sender === "user" ? "ios-message-blue" : "ios-message-gray"
                    } rounded-2xl px-4 py-2`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Streaming message */}
          {currentStreamedMessage && (
            <div className="flex justify-start">
              <div className="max-w-[80%] animate-bubble-expand ios-message-gray rounded-2xl px-4 py-2">
                <p className="whitespace-pre-wrap">{currentStreamedMessage}</p>
              </div>
            </div>
          )}

          {/* Typing indicator */}
          {isTyping && !currentStreamedMessage && (
            <div className="flex justify-start">
              <div className="max-w-[80%] animate-bubble-expand ios-message-gray rounded-2xl px-4 py-2">
                <div className="flex space-x-1 items-center px-2 py-1">
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"
                    style={{ animation: "typing-dot 0.8s infinite" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"
                    style={{ animation: "typing-dot 0.8s infinite 0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"
                    style={{ animation: "typing-dot 0.8s infinite 0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Fixed message input with better positioning */}
      <div className="fixed bottom-16 left-0 right-0 z-50 border-t border-gray-200 bg-background/95 p-3 dark:border-gray-800 dark:bg-black/95 backdrop-blur-md shadow-lg">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className="flex items-center space-x-2"
        >
          <Input
            placeholder="Message Serenify..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 rounded-full border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700"
            disabled={isTyping}
          />
          <Button
            type="submit"
            size="icon"
            className="rounded-full bg-primary h-10 w-10 p-0 shadow-sm flex items-center justify-center"
            disabled={!input.trim() || isTyping}
            style={{ borderRadius: "9999px" }}
          >
            <Send className="h-5 w-5" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  )
}
