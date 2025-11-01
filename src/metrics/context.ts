import type { BaseMetrics } from './types.js'

/**
 * Context management metrics - Claude Code specific (token tracking and compaction)
 */
export interface ContextManagementMetrics extends BaseMetrics {
  total_input_tokens: number // SUM of all input_tokens across session
  total_output_tokens: number // SUM of all output_tokens across session
  total_cache_created: number // SUM of all cache_creation_input_tokens
  total_cache_read: number // SUM of all cache_read_input_tokens
  context_length: number // Most recent message's full context (input + cache_read + cache_creation)
  context_window_size: number // Model's maximum context window (200k for Claude Sonnet 4.5)
  context_utilization_percent: number // (context_length / context_window_size) * 100
  compact_event_count: number
  compact_event_steps: string // JSON array of step numbers
  avg_tokens_per_message: number
  messages_until_first_compact: number | null
  context_improvement_tips: string // JSON array of improvement tips
}
