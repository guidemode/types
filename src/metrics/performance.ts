import type { BaseMetrics } from './types.js'

/**
 * Performance metrics - measures response latency and task completion time
 */
export interface PerformanceMetrics extends BaseMetrics {
  response_latency_ms: number
  task_completion_time_ms: number
  metadata?: {
    total_responses: number
    improvement_tips: string[]
  }
}
