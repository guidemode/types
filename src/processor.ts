import type { MetricType, SessionMetricsData } from './metrics.js'
import type { ParsedMessage, ParsedSession } from './session.js'

// Processor types
export interface ProcessorResult {
  metricType: MetricType
  metrics: SessionMetricsData
  // biome-ignore lint/suspicious/noExplicitAny: TODO: Define specific metadata schema
  metadata?: Record<string, any>
  processingTime?: number
}

export interface ProcessorContext {
  sessionId: string
  tenantId: string
  userId: string
  provider: string
  // Optional git diff data from desktop app (not available in server context)
  // biome-ignore lint/suspicious/noExplicitAny: TODO: Extract to dedicated GitDiffData type
  gitDiffData?: any
}

export type { ParsedMessage, ParsedSession }
