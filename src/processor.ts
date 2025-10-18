import type { ParsedMessage, ParsedSession } from './session'
import type { MetricType, SessionMetricsData } from './metrics'

// Processor types
export interface ProcessorResult {
  metricType: MetricType
  metrics: SessionMetricsData
  metadata?: Record<string, any>
  processingTime?: number
}

export interface ProcessorContext {
  sessionId: string
  tenantId: string
  userId: string
  provider: string
  // Optional git diff data from desktop app (not available in server context)
  gitDiffData?: {
    files: Array<{
      path: string
      stats: {
        additions: number
        deletions: number
      }
    }>
    isUnstaged: boolean
  }
}

export type { ParsedMessage, ParsedSession }
