// Cloudflare environment bindings
export type CloudflareEnv = {
  ASSETS?: any
  AGENT_SESSIONS?: any // R2Bucket type from @cloudflare/workers-types
  SESSION_PROCESSING_QUEUE?: any // Queue type from @cloudflare/workers-types
  RATE_LIMIT_KV?: any // KVNamespace type from @cloudflare/workers-types
  CLAUDE_API_KEY?: string // Claude API key for AI model processing
  GEMINI_API_KEY?: string // Gemini API key for AI model processing
  APP_URL?: string // Application base URL for links in notifications
}

// Queue message types
export interface SessionProcessingMessage {
  sessionId: string
  tenantId: string
  userId: string
  provider: string
  forceReprocess?: boolean
  specificProcessor?: string
  enableAIModels?: boolean
  aiModelAdapter?: string
}