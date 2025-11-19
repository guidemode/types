/**
 * Gemini provider type definitions
 * Gemini extends Claude's message format with additional thinking and token tracking
 */

import { z } from 'zod'

/**
 * Gemini thought structure (extended thinking)
 */
export const ThoughtSchema = z.object({
  subject: z.string(),
  description: z.string(),
  timestamp: z.string(),
})

export type Thought = z.infer<typeof ThoughtSchema>

/**
 * Gemini token metrics
 * Provides granular breakdown of token usage
 */
export const TokenMetricsSchema = z.object({
  input: z.number(),
  output: z.number(),
  cached: z.number().optional(),
  thoughts: z.number().optional(), // Thinking token overhead
  tool: z.number().optional(),
  total: z.number(),
})

export type TokenMetrics = z.infer<typeof TokenMetricsSchema>

/**
 * Content block schema (reuses shared types at runtime)
 */
const ContentBlockSchema = z.union([
  // Text
  z.object({
    type: z.literal('text'),
    text: z.string(),
  }),
  // Tool use
  z.object({
    type: z.literal('tool_use'),
    id: z.string(),
    name: z.string(),
    input: z.record(z.unknown()),
  }),
  // Tool result
  z.object({
    type: z.literal('tool_result'),
    tool_use_id: z.string(),
    content: z.unknown(),
    is_error: z.boolean().optional(),
  }),
  // Thinking
  z.object({
    type: z.literal('thinking'),
    thinking: z.string().optional(),
    signature: z.string().optional(),
  }),
  // Unknown (catch-all)
  z
    .object({
      type: z.string(),
    })
    .passthrough(),
])

/**
 * Gemini message entry (extends Claude format)
 */
export const GeminiMessageSchema = z.object({
  uuid: z.string(),
  timestamp: z.string(),
  type: z.enum(['user', 'assistant', 'summary', 'system']),
  message: z.object({
    role: z.string(),
    content: z.union([z.string(), z.array(ContentBlockSchema)]),
  }),

  // Gemini-specific fields
  thoughts: z.array(ThoughtSchema).optional(),
  tokens: TokenMetricsSchema.optional(),
  model: z.string().optional(),

  // Standard fields
  sessionId: z.string(),
  parentUuid: z.string().optional(),
  isMeta: z.boolean().optional(),
})

export type GeminiMessage = z.infer<typeof GeminiMessageSchema>

/**
 * Gemini metadata extension for ParsedMessage
 */
export interface GeminiMetadata {
  thoughts?: Thought[]
  thoughtCount?: number
  hasThoughts: boolean
  tokens?: TokenMetrics
  hasCachedTokens: boolean
  hasThinkingTokens: boolean
  cacheHitRate?: number // Percentage of tokens that were cached
  thinkingOverhead?: number // Ratio of thinking tokens to output tokens
  model?: string
}

/**
 * Type guards
 */
export function isGeminiMessage(entry: unknown): entry is GeminiMessage {
  const result = GeminiMessageSchema.safeParse(entry)
  return result.success
}

export function hasGeminiThoughts(message: GeminiMessage): boolean {
  return !!message.thoughts && message.thoughts.length > 0
}

export function hasGeminiTokens(message: GeminiMessage): boolean {
  return !!message.tokens
}

/**
 * Helper to calculate cache hit rate
 */
export function calculateCacheHitRate(tokens: TokenMetrics): number {
  if (!tokens.cached || tokens.total === 0) return 0
  return (tokens.cached / tokens.total) * 100
}

/**
 * Helper to calculate thinking overhead
 */
export function calculateThinkingOverhead(tokens: TokenMetrics): number {
  if (!tokens.thoughts || tokens.output === 0) return 0
  return tokens.thoughts / tokens.output
}
