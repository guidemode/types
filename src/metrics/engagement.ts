import type { BaseMetrics } from './types.js'

/**
 * Engagement metrics - measures interruption rate and session length
 */
export interface EngagementMetrics extends BaseMetrics {
  interruption_rate: number
  total_interruptions: number
  session_length_minutes: number
  metadata?: {
    total_responses: number
    improvement_tips: string[]
    // Extra fields for detailed analysis
    interruptions_from_parser?: number
    cancellations_from_info?: number
    conversation_turns?: number
    avg_seconds_per_turn?: number
  }
}
