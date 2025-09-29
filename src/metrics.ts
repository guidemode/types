// Session Metrics Types
export type MetricType =
  | 'performance'
  | 'usage'
  | 'error'
  | 'custom'
  | 'engagement'
  | 'quality'
  | 'performance.duration'
  | 'performance.response-time'
  | 'usage.tool-usage'
  | 'usage.user-input'
  | 'engagement.interruptions'
  | 'quality.completion'

// Base metric data structure stored in JSONB
export interface BaseMetrics {
  [key: string]: string | number | boolean | object | null | undefined
}

// Simplified performance metrics - measures response latency and task completion time
export interface PerformanceMetrics extends BaseMetrics {
  response_latency_ms: number
  task_completion_time_ms: number
  metadata?: {
    total_responses: number
    improvement_tips: string[]
  }
}

// Simplified usage metrics - measures Read/Write ratio and input clarity
export interface UsageMetrics extends BaseMetrics {
  read_write_ratio: number
  input_clarity_score: number
  metadata?: {
    read_operations: number
    write_operations: number
    total_user_messages: number
    improvement_tips: string[]
  }
}

// Error tracking metrics
export interface ErrorMetrics extends BaseMetrics {
  error_count?: number
  error_types?: string[]
  last_error_message?: string
  recovery_attempts?: number
  fatal_errors?: number
}

// Simplified engagement metrics - measures interruption rate and session length
export interface EngagementMetrics extends BaseMetrics {
  interruption_rate: number
  session_length_minutes: number
  metadata?: {
    total_interruptions: number
    total_responses: number
    improvement_tips: string[]
  }
}

// Simplified quality metrics - measures task success, iteration count, and process quality
export interface QualityMetrics extends BaseMetrics {
  task_success_rate: number
  iteration_count: number
  process_quality_score: number
  used_plan_mode: boolean
  used_todo_tracking: boolean
  over_top_affirmations: number
  metadata?: {
    successful_operations: number
    total_operations: number
    improvement_tips: string[]
    exit_plan_mode_count?: number
    todo_write_count?: number
    over_top_affirmations_phrases?: string[]
  }
}

// Custom metrics for extensibility
export interface CustomMetrics extends BaseMetrics {
  [customKey: string]: any
}

// Union type for all possible metrics
export type SessionMetricsData =
  | PerformanceMetrics
  | UsageMetrics
  | ErrorMetrics
  | EngagementMetrics
  | QualityMetrics
  | CustomMetrics

// Metadata that can be attached to metrics
export interface MetricMetadata {
  source?: string
  version?: string
  environment?: string
  tags?: string[]
  context?: {
    project_type?: string
    user_experience_level?: string
    session_type?: string
    [key: string]: any
  }
}