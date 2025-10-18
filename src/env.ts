// Cloudflare environment bindings
export type CloudflareEnv = {
  ASSETS?: any
  AGENT_SESSIONS?: any // R2Bucket type from @cloudflare/workers-types
  SESSION_PROCESSING_QUEUE?: any // Queue type from @cloudflare/workers-types
  BILLING_QUEUE?: any // Queue type from @cloudflare/workers-types for billing updates
  RATE_LIMIT_KV?: any // KVNamespace type from @cloudflare/workers-types
  NOTIFICATIONS_HUB?: any // Durable Object namespace for WebSocket connections
  NODE_ENV?: string // Environment: 'development' or 'production'
  DATABASE_URL?: string // Neon PostgreSQL database connection string
  CLAUDE_API_KEY?: string // Claude API key for AI model processing
  GEMINI_API_KEY?: string // Gemini API key for AI model processing
  APP_URL?: string // Application base URL for links in notifications
  PADDLE_ENABLED?: string // Controls billing feature visibility. Set to 'true' to enable billing features. If not set or not 'true', billing is disabled and all users get enterprise access (self-hosted mode)
  PADDLE_WEBHOOK_SECRET?: string // Paddle webhook signature verification secret
  PADDLE_CLIENT_TOKEN?: string // Paddle client-side token for frontend checkout
  PADDLE_INDIVIDUAL_PRICE_ID?: string // Paddle price ID for Individual plan
  PADDLE_TEAM_PRICE_ID?: string // Paddle price ID for Team plan
  PADDLE_ENTERPRISE_PRICE_ID?: string // Paddle price ID for Enterprise plan (dummy, managed manually)
  PADDLE_API_KEY?: string // Paddle API key for backend operations (required when PADDLE_ENABLED=true)
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

/**
 * Message for billing quantity updates
 */
export interface BillingUpdateMessage {
  type: 'user_activated' | 'user_deactivated'
  tenantId: string
  userId: string
  username: string
  timestamp: string
}