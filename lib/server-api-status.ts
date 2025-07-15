// Server-side flags to track API availability
let geminiQuotaExceeded = false
let geminiApiError = false
let openaiQuotaExceeded = false

// Gemini API status functions
export function isGeminiQuotaExceeded(): boolean {
  return geminiQuotaExceeded
}

export function isGeminiApiError(): boolean {
  return geminiApiError
}

export function markGeminiQuotaExceeded(): void {
  geminiQuotaExceeded = true
  console.log("🚫 Gemini API quota marked as exceeded")
}

export function markGeminiApiError(): void {
  geminiApiError = true
  console.log("🚫 Gemini API marked as having errors")
}

export function shouldUseGemini(): boolean {
  return !geminiQuotaExceeded && !geminiApiError
}

// OpenAI API status functions (for fallback)
export function isOpenAIQuotaExceeded(): boolean {
  return openaiQuotaExceeded
}

export function markOpenAIQuotaExceeded(): void {
  openaiQuotaExceeded = true
  console.log("🚫 OpenAI API quota marked as exceeded")
}

// Reset functions for testing
export function resetGeminiStatus(): void {
  geminiQuotaExceeded = false
  geminiApiError = false
  console.log("🔄 Gemini API status reset")
}

export function resetAllApiStatus(): void {
  geminiQuotaExceeded = false
  geminiApiError = false
  openaiQuotaExceeded = false
  console.log("🔄 All API statuses reset")
}
