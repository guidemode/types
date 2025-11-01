import type { BaseMetrics } from './types.js'

/**
 * Error tracking metrics
 */
export interface ErrorMetrics extends BaseMetrics {
  error_count?: number
  error_types?: string[]
  last_error_message?: string
  recovery_attempts?: number
  fatal_errors?: number
  metadata?: {
    improvement_tips?: string[]
  }
}
