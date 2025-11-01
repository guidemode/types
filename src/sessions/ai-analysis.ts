import type { SessionPhase } from './core.js'

// AI Model Analysis Types
// These represent the results from various AI analysis tasks on sessions

/**
 * Intent extraction result - identifies the user's goals
 */
export interface IntentExtractionResult {
  primaryGoal?: string
  secondaryGoals?: string[]
  technologies?: string[] | Record<string, string>
  challenges?: string[]
  taskType?: string
}

/**
 * Quality assessment result - evaluates session quality
 */
export interface QualityAssessmentResult {
  score?: number
  improvements?: string[]
  strengths?: string[]
  reasoning?: string
}

/**
 * Session summary result - summarizes the session
 */
export interface SessionSummaryResult {
  summary?: string
  keyPoints?: string[]
}

/**
 * AI model metadata - container for all AI analysis results
 */
export interface AIModelMetadata {
  'intent-extraction'?: IntentExtractionResult
  'quality-assessment'?: QualityAssessmentResult
  'session-summary'?: SessionSummaryResult
  [key: string]: unknown // Allow additional analysis types
}

/**
 * Complete session phase analysis result
 */
export interface SessionPhaseAnalysis {
  phases: SessionPhase[]
  totalPhases: number
  totalSteps: number
  sessionDurationMs: number
  pattern: string
}
