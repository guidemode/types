import type { BaseMetrics } from './types.js'

// Assessment system types

/**
 * Assessment metrics for user feedback
 */
export interface AssessmentMetrics extends BaseMetrics {
  responses: Record<string, AssessmentAnswer>
  completed_at: string
  duration_seconds?: number
  survey_type?: 'short' | 'standard' | 'full'
}

/**
 * Assessment answer types
 */
export type AssessmentAnswer =
  | { type: 'likert'; value: number }
  | { type: 'text'; value: string }
  | { type: 'choice'; value: string }
  | { type: 'skipped' }

/**
 * Assessment status
 */
export type AssessmentStatus = 'not_started' | 'in_progress' | 'completed'

/**
 * Assessment question types
 */
export type AssessmentQuestionType = 'likert-5' | 'likert-7' | 'text' | 'choice'

/**
 * Assessment category classification
 */
export type AssessmentCategory =
  | 'usefulness'
  | 'trust'
  | 'cognitive'
  | 'learning'
  | 'satisfaction'
  | 'comparison'
  | 'reflection'

/**
 * Assessment importance level
 */
export type AssessmentImportance = 'low' | 'medium' | 'high'

/**
 * Assessment survey version
 */
export type AssessmentVersion = 'short' | 'medium' | 'long'

/**
 * Assessment question configuration
 */
export interface AssessmentQuestionConfig {
  id: string
  text: string
  type: AssessmentQuestionType
  category: AssessmentCategory
  importance: AssessmentImportance
  version: AssessmentVersion[]
  required: boolean
  skipLabel?: string
  labels?: [string, string] // [min label, max label] for Likert scales
  choices?: string[] // For choice questions
  placeholder?: string // For text questions
  helpText?: string
}

/**
 * Assessment filter criteria
 */
export interface AssessmentFilter {
  importance?: AssessmentImportance[]
  category?: AssessmentCategory[]
  required?: boolean
  version?: AssessmentVersion
}

/**
 * Assessment response entry
 */
export interface AssessmentResponse {
  questionId: string
  answer: AssessmentAnswer
  timestamp: string
}

/**
 * Assessment session data
 */
export interface AssessmentSession {
  sessionId: string
  status: AssessmentStatus
  responses: AssessmentResponse[]
  startedAt?: string
  completedAt?: string
  rating?: 'thumbs_up' | 'meh' | 'thumbs_down' | null
  surveyType?: 'quick' | 'standard'
}
