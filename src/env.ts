// Cloudflare environment bindings
export type CloudflareEnv = {
  ASSETS?: any
  AGENT_SESSIONS?: any // R2Bucket type from @cloudflare/workers-types
  CLAUDE_API_KEY?: string // Claude API key for AI model processing
  GEMINI_API_KEY?: string // Gemini API key for AI model processing
}