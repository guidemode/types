import type { SessionPhaseAnalysis } from './ai-analysis.js'
import type { ProcessingStatus } from './core.js'

// Session upload types for desktop -> server sync

/**
 * Session upload request - syncs session from desktop to server
 */
export interface SessionUploadRequest {
  provider: string
  repositoryName: string
  sessionId: string
  fileName: string
  filePath: string
  content?: string // Optional base64 encoded JSONL - not required for metrics-only sync

  // Optional timing fields (for metrics-only sync)
  sessionStartTime?: string // ISO 8601
  sessionEndTime?: string // ISO 8601
  durationMs?: number

  // Optional processing fields
  processingStatus?: ProcessingStatus
  queuedAt?: string // ISO 8601
  processedAt?: string // ISO 8601

  // Optional assessment fields
  assessmentStatus?: 'not_started' | 'rating_only' | 'in_progress' | 'completed'
  assessmentCompletedAt?: string // ISO 8601
  assessmentRating?: 'thumbs_up' | 'meh' | 'thumbs_down' // Matches session_assessments.rating

  // Optional AI model fields
  aiModelSummary?: string
  aiModelQualityScore?: number
  aiModelMetadata?: unknown
  aiModelPhaseAnalysis?: SessionPhaseAnalysis
}

/**
 * Session upload response - confirms upload success
 */
export interface SessionUploadResponse {
  success: boolean
  sessionId: string
  filePath?: string
  size?: number
}

/**
 * Session metric upload - individual session metrics
 */
export interface SessionMetricUpload {
  sessionId: string
  provider: string

  // Performance metrics
  responseLatencyMs?: number
  taskCompletionTimeMs?: number
  performanceTotalResponses?: number

  // Usage metrics
  readWriteRatio?: number
  inputClarityScore?: number
  readOperations?: number
  writeOperations?: number
  totalUserMessages?: number

  // Error metrics
  errorCount?: number
  errorTypes?: string[]
  lastErrorMessage?: string
  recoveryAttempts?: number
  fatalErrors?: number

  // Engagement metrics
  interruptionRate?: number
  sessionLengthMinutes?: number
  totalInterruptions?: number
  engagementTotalResponses?: number

  // Quality metrics
  taskSuccessRate?: number
  iterationCount?: number
  processQualityScore?: number
  usedPlanMode?: boolean
  usedTodoTracking?: boolean
  overTopAffirmations?: number
  successfulOperations?: number
  totalOperations?: number
  exitPlanModeCount?: number
  todoWriteCount?: number
  overTopAffirmationsPhrases?: string[]
  improvementTips?: string[]

  // Custom metrics
  // biome-ignore lint/suspicious/noExplicitAny: Custom metrics can contain any value type
  customMetrics?: Record<string, any>
}

/**
 * Session metrics upload request - batch upload of metrics
 */
export interface SessionMetricsUploadRequest {
  metrics: SessionMetricUpload[]
}

/**
 * Session metrics upload response - confirms batch upload
 */
export interface SessionMetricsUploadResponse {
  success: boolean
  insertedCount: number
}
