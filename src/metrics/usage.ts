import type { BaseMetrics } from './types.js'

/**
 * Usage metrics - measures Read/Write ratio and input clarity
 */
export interface UsageMetrics extends BaseMetrics {
  read_write_ratio: number
  input_clarity_score: number
  metadata?: {
    read_operations: number
    write_operations: number
    total_user_messages: number
    total_lines_read?: number // For git diff efficiency ratios
    improvement_tips: string[]
    // Extra fields for detailed analysis
    tool_diversity?: number
    bash_command_count?: number
    unique_tools?: string[]
  }
}
