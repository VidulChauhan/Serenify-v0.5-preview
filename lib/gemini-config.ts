import { GoogleGenerativeAI } from "@google/generative-ai"

// Create a singleton instance of the Gemini client
let geminiInstance: GoogleGenerativeAI | null = null

export function getGeminiClient(): GoogleGenerativeAI {
  if (!geminiInstance) {
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey || typeof apiKey !== "string" || apiKey.trim() === "") {
      throw new Error("GEMINI_API_KEY environment variable is missing or invalid")
    }

    console.log("✅ Initializing Gemini client with API key")
    geminiInstance = new GoogleGenerativeAI(apiKey)
  }

  return geminiInstance
}

export function getGeminiModel() {
  const genAI = getGeminiClient()
  // Use the correct model name for the current API version
  return genAI.getGenerativeModel({
    model: "gemini-1.5-flash", // Updated to use the correct model name
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    },
  })
}

// Test function to verify API key works
export async function testGeminiConnection(): Promise<boolean> {
  try {
    console.log("🔄 Testing Gemini API connection...")
    const model = getGeminiModel()

    // Use a simple test prompt
    const result = await model.generateContent("Hello, please respond with 'API test successful'")
    const response = await result.response
    const text = response.text()

    console.log("✅ Gemini API test successful:", text.substring(0, 50))
    return true
  } catch (error: any) {
    console.error("❌ Gemini API test failed:", error?.message || error)

    // Log more details about the error
    if (error?.message?.includes("models/")) {
      console.error("🔍 Model availability issue. Trying alternative model...")

      // Try with gemini-1.5-pro as fallback
      try {
        const genAI = getGeminiClient()
        const altModel = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })
        const result = await altModel.generateContent("Hello")
        const response = await result.response
        const text = response.text()
        console.log("✅ Alternative model test successful:", text.substring(0, 50))
        return true
      } catch (altError) {
        console.error("❌ Alternative model also failed:", altError)
      }
    }

    return false
  }
}

// Get the best available model
export function getBestGeminiModel() {
  const genAI = getGeminiClient()

  // Try gemini-1.5-flash first (faster and cheaper)
  try {
    return genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    })
  } catch (error) {
    console.log("⚠️ gemini-1.5-flash not available, trying gemini-1.5-pro")

    // Fallback to gemini-1.5-pro
    return genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    })
  }
}
