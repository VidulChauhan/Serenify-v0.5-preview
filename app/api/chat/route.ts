import { type NextRequest, NextResponse } from "next/server"
import { getBestGeminiModel, getGeminiClient } from "@/lib/gemini-config"

// Therapeutic system prompt for Gemini
const THERAPIST_SYSTEM_PROMPT = `You are Serenify, an empathetic and supportive AI mental health assistant.

Your primary goal is to provide emotional support, active listening, and helpful guidance to users who may be experiencing various mental health challenges.

Guidelines:
- Be warm, compassionate, and non-judgmental in all interactions
- Practice active listening by acknowledging feelings and experiences
- Ask thoughtful follow-up questions to better understand the user's situation
- Provide evidence-based coping strategies and techniques when appropriate
- Encourage healthy habits related to sleep, exercise, nutrition, and social connection
- Recognize your limitations and never claim to replace professional mental health care
- If someone appears to be in crisis, gently suggest professional resources
- Maintain a conversational, friendly tone while remaining respectful and professional
- Respect privacy and confidentiality
- Focus on empowerment and building resilience
- Keep responses concise but meaningful, typically 2-4 sentences
- Use a warm, supportive tone that feels like talking to a caring friend

Remember that your role is to be supportive, not to diagnose or treat mental health conditions. Always encourage users to seek professional help for persistent or severe mental health concerns.

Please respond as Serenify would, with empathy and care.`

// Enhanced fallback responses
const FALLBACK_RESPONSES = [
  "I'm here to listen and support you. How are you feeling today? I want to understand what's on your mind.",
  "Thank you for reaching out to me. Your feelings are valid, and I'm here to help you work through whatever you're experiencing.",
  "I can sense that you might be going through something difficult. Would you like to share more about how you're feeling?",
  "It takes courage to reach out for support. I'm here to listen without judgment and help you explore your thoughts and feelings.",
  "I'm glad you're here. Sometimes talking through our experiences can help us gain new perspectives. What would you like to discuss?",
  "Your mental health matters, and I'm here to support you. What's been weighing on your mind lately?",
  "I want to create a safe space for you to express yourself. How can I best support you today?",
  "Thank you for trusting me with your thoughts. I'm here to listen and help you navigate whatever you're facing.",
]

function createFallbackStream(messages: any[]): ReadableStream {
  const encoder = new TextEncoder()

  return new ReadableStream({
    start(controller) {
      console.log("🔄 Creating fallback response stream")

      // Select a contextually appropriate response
      const response = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)]
      console.log("✅ Selected fallback response")

      // Split response into words for streaming effect
      const words = response.split(" ")
      let wordIndex = 0

      const streamInterval = setInterval(() => {
        if (wordIndex < words.length) {
          const chunk = {
            choices: [
              {
                delta: {
                  content: words[wordIndex] + " ",
                },
              },
            ],
          }

          const sseMessage = `data: ${JSON.stringify(chunk)}\n\n`
          controller.enqueue(encoder.encode(sseMessage))
          wordIndex++
        } else {
          controller.enqueue(encoder.encode("data: [DONE]\n\n"))
          clearInterval(streamInterval)
          controller.close()
          console.log("✅ Fallback stream completed")
        }
      }, 100)
    },
  })
}

function createGeminiStream(geminiStream: any): ReadableStream {
  const encoder = new TextEncoder()

  return new ReadableStream({
    async start(controller) {
      try {
        console.log("🔄 Processing Gemini stream")

        for await (const chunk of geminiStream) {
          const chunkText = chunk.text()

          if (chunkText) {
            const sseChunk = {
              choices: [
                {
                  delta: {
                    content: chunkText,
                  },
                },
              ],
            }

            const sseMessage = `data: ${JSON.stringify(sseChunk)}\n\n`
            controller.enqueue(encoder.encode(sseMessage))
          }
        }

        controller.enqueue(encoder.encode("data: [DONE]\n\n"))
        controller.close()
        console.log("✅ Gemini stream completed successfully")
      } catch (error) {
        console.error("❌ Error in Gemini stream processing:", error)
        controller.error(error)
      }
    },
  })
}

// Test Gemini connection with better model detection
async function testGeminiConnection(): Promise<boolean> {
  try {
    console.log("🔄 Testing Gemini API connection...")

    // Try to list available models first
    const genAI = getGeminiClient()

    // Test with a simple generation
    const model = getBestGeminiModel()
    const result = await model.generateContent("Hello, please respond with 'API test successful'")
    const response = await result.response
    const text = response.text()

    console.log("✅ Gemini API test successful:", text.substring(0, 50))
    return true
  } catch (error: any) {
    console.error("❌ Gemini API test failed:", error?.message || error)

    // Try to get more information about available models
    try {
      const genAI = getGeminiClient()
      console.log("🔍 Attempting to list available models...")

      // Try different model names
      const modelNames = [
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-pro",
        "models/gemini-1.5-flash",
        "models/gemini-1.5-pro",
      ]

      for (const modelName of modelNames) {
        try {
          console.log(`🔄 Trying model: ${modelName}`)
          const testModel = genAI.getGenerativeModel({ model: modelName })
          const result = await testModel.generateContent("Test")
          const response = await result.response
          const text = response.text()
          console.log(`✅ Model ${modelName} works:`, text.substring(0, 30))
          return true
        } catch (modelError: any) {
          console.log(`❌ Model ${modelName} failed:`, modelError?.message?.substring(0, 100))
        }
      }
    } catch (listError) {
      console.error("❌ Could not test alternative models:", listError)
    }

    return false
  }
}

export async function POST(request: NextRequest) {
  console.log("=== Chat API Route Called ===")

  try {
    // Parse request body
    const requestData = await request.json()
    const { messages } = requestData

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.error("❌ Invalid messages format")
      return NextResponse.json({ error: "Invalid request format. Messages array is required." }, { status: 400 })
    }

    console.log(`📥 Received ${messages.length} messages`)

    // Test Gemini connection first
    console.log("🔄 Testing Gemini API connection...")
    const geminiWorking = await testGeminiConnection()

    if (!geminiWorking) {
      console.log("⚠️ Gemini API test failed, using fallback")
      return new NextResponse(createFallbackStream(messages), {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      })
    }

    try {
      console.log("🔄 Initializing Gemini model...")
      const model = getBestGeminiModel()

      // Build conversation for Gemini
      let conversationText = THERAPIST_SYSTEM_PROMPT + "\n\nConversation:\n"

      // Process messages
      for (const msg of messages) {
        if (!msg || typeof msg !== "object") continue

        const role = msg.role === "user" ? "Human" : "Serenify"
        const content = String(msg.content || "").trim()

        if (content) {
          conversationText += `${role}: ${content}\n`
        }
      }

      conversationText += "Serenify:"

      console.log("✅ Built conversation context for Gemini")

      // Generate streaming response
      console.log("🔄 Calling Gemini API...")
      const result = await model.generateContentStream(conversationText)

      console.log("✅ Gemini API call successful")

      return new NextResponse(createGeminiStream(result.stream), {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      })
    } catch (geminiError: any) {
      console.error("❌ Gemini API error:", geminiError)

      // Check for specific error types
      const errorMessage = geminiError?.message || geminiError?.toString() || ""

      if (errorMessage.includes("API_KEY") || errorMessage.includes("authentication")) {
        console.log("🚫 Gemini authentication error")
      } else if (errorMessage.includes("quota") || errorMessage.includes("limit")) {
        console.log("🚫 Gemini quota exceeded")
      } else if (errorMessage.includes("models/") || errorMessage.includes("not found")) {
        console.log("🚫 Gemini model not found error")
      } else {
        console.log("⚠️ Gemini general error")
      }

      // Always fall back gracefully
      console.log("⚠️ Falling back to local responses")
      return new NextResponse(createFallbackStream(messages), {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      })
    }
  } catch (error) {
    console.error("❌ Critical error in chat API:", error)

    // Return fallback for any critical errors
    return new NextResponse(createFallbackStream([]), {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    })
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
