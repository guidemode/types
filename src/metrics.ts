// Session Metrics Types
export type MetricType =
  | 'performance'
  | 'usage'
  | 'error'
  | 'custom'
  | 'engagement'
  | 'quality'
  | 'assessment'
  | 'git-diff'
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
    total_lines_read?: number // For git diff efficiency ratios
    improvement_tips: string[]
    // Extra fields for detailed analysis
    tool_diversity?: number
    bash_command_count?: number
    unique_tools?: string[]
  }
}

// Error tracking metrics
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

// Simplified engagement metrics - measures interruption rate and session length
export interface EngagementMetrics extends BaseMetrics {
  interruption_rate: number
  session_length_minutes: number
  metadata?: {
    total_interruptions: number
    total_responses: number
    improvement_tips: string[]
    // Extra fields for detailed analysis
    interruptions_from_parser?: number
    cancellations_from_info?: number
    conversation_turns?: number
    avg_seconds_per_turn?: number
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
    // Extra fields for detailed analysis
    cancellations?: number
    average_response_length?: number
  }
}

// Custom metrics for extensibility
export interface CustomMetrics extends BaseMetrics {
  // Inherits index signature from BaseMetrics
}

// Git diff metrics - desktop-only, all providers
export interface GitDiffMetrics extends BaseMetrics {
  git_total_files_changed: number
  git_lines_added: number
  git_lines_removed: number
  git_lines_modified: number
  git_net_lines_changed: number
  git_lines_read_per_line_changed?: number
  git_reads_per_file_changed?: number
  git_lines_changed_per_minute?: number
  git_lines_changed_per_tool_use?: number
  total_lines_read?: number
  metadata?: {
    calculation_type: 'unstaged' | 'committed'
    first_commit?: string
    latest_commit?: string
    improvement_tips: string[]
  }
}

// Assessment metrics for user feedback
export interface AssessmentMetrics extends BaseMetrics {
  responses: Record<string, AssessmentAnswer>
  completed_at: string
  duration_seconds?: number
  survey_type?: 'short' | 'standard' | 'full'
}

export type AssessmentAnswer =
  | { type: 'likert'; value: number }
  | { type: 'text'; value: string }
  | { type: 'choice'; value: string }
  | { type: 'skipped' }

// Union type for all possible metrics
export type SessionMetricsData =
  | PerformanceMetrics
  | UsageMetrics
  | ErrorMetrics
  | EngagementMetrics
  | QualityMetrics
  | AssessmentMetrics
  | GitDiffMetrics
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
    // biome-ignore lint/suspicious/noExplicitAny: Context can contain arbitrary metadata
    [key: string]: any
  }
}

// Assessment system types
export type AssessmentStatus = 'not_started' | 'in_progress' | 'completed'

export type AssessmentQuestionType = 'likert-5' | 'likert-7' | 'text' | 'choice'

export type AssessmentCategory =
  | 'usefulness'
  | 'trust'
  | 'cognitive'
  | 'learning'
  | 'satisfaction'
  | 'comparison'
  | 'reflection'

export type AssessmentImportance = 'low' | 'medium' | 'high'

export type AssessmentVersion = 'short' | 'medium' | 'long'

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

export interface AssessmentFilter {
  importance?: AssessmentImportance[]
  category?: AssessmentCategory[]
  required?: boolean
  version?: AssessmentVersion
}

export interface AssessmentResponse {
  questionId: string
  answer: AssessmentAnswer
  timestamp: string
}

export interface AssessmentSession {
  sessionId: string
  status: AssessmentStatus
  responses: AssessmentResponse[]
  startedAt?: string
  completedAt?: string
  rating?: 'thumbs_up' | 'meh' | 'thumbs_down' | null
  surveyType?: 'quick' | 'standard'
}

// ===== Metric Calculation Helper Utilities =====
// Type-safe helper functions for extracting and analyzing content from sessions

import type {
  ContentBlock,
  TextContent,
  ThinkingContent,
  ToolResultContent,
  ToolUseContent,
} from './providers/shared/index.js'
import {
  isTextContent,
  isThinkingContent,
  isToolResultContent,
  isToolUseContent,
} from './providers/shared/index.js'
import type { ParsedMessage } from './session.js'

/**
 * Extract all tool uses from session messages
 */
export function extractToolUses(messages: ParsedMessage[]): ToolUseContent[] {
  const toolUses: ToolUseContent[] = []

  for (const msg of messages) {
    if (Array.isArray(msg.content)) {
      for (const block of msg.content) {
        if (isToolUseContent(block)) {
          toolUses.push(block)
        }
      }
    }
  }

  return toolUses
}

/**
 * Extract all tool results from session messages
 */
export function extractToolResults(messages: ParsedMessage[]): ToolResultContent[] {
  const results: ToolResultContent[] = []

  for (const msg of messages) {
    if (Array.isArray(msg.content)) {
      for (const block of msg.content) {
        if (isToolResultContent(block)) {
          results.push(block)
        }
      }
    }
  }

  return results
}

/**
 * Extract text content from a message
 */
export function extractTextFromMessage(message: ParsedMessage): string {
  if (typeof message.content === 'string') {
    return message.content
  }

  if (Array.isArray(message.content)) {
    return message.content
      .filter(isTextContent)
      .map((block: TextContent) => block.text)
      .join('\n')
  }

  // StructuredMessageContent
  const structured = message.content
  const texts: string[] = []
  if (structured.text) {
    texts.push(structured.text)
  }
  if (structured.structured) {
    texts.push(
      ...structured.structured.filter(isTextContent).map((block: TextContent) => block.text)
    )
  }
  return texts.join('\n')
}

/**
 * Count tool uses by name
 */
export function countToolUsesByName(toolUses: ToolUseContent[]): Record<string, number> {
  const counts: Record<string, number> = {}

  for (const tool of toolUses) {
    counts[tool.name] = (counts[tool.name] || 0) + 1
  }

  return counts
}

/**
 * Type guard: Check if tool result indicates an error
 */
export function isErrorResult(result: ToolResultContent): boolean {
  // Explicit error flag
  if (result.is_error) return true

  // Check content for error indicators
  const contentStr =
    typeof result.content === 'string' ? result.content : JSON.stringify(result.content)

  const errorKeywords = [
    'error',
    'failed',
    'exception',
    'cannot',
    'unable',
    'not found',
    'permission denied',
    'syntax error',
    'type error',
  ]

  const lowerContent = contentStr.toLowerCase()
  return errorKeywords.some(keyword => lowerContent.includes(keyword))
}

/**
 * Filter tool results by error status
 */
export function filterErrorResults(results: ToolResultContent[]): ToolResultContent[] {
  return results.filter(isErrorResult)
}

/**
 * Filter tool results by success status
 */
export function filterSuccessResults(results: ToolResultContent[]): ToolResultContent[] {
  return results.filter(result => !isErrorResult(result))
}

/**
 * Pair tool uses with their results
 */
export function pairToolUsesWithResults(
  toolUses: ToolUseContent[],
  toolResults: ToolResultContent[]
): Array<{ toolUse: ToolUseContent; result?: ToolResultContent }> {
  const resultsByToolId = new Map<string, ToolResultContent>()

  // Index results by tool_use_id
  for (const result of toolResults) {
    resultsByToolId.set(result.tool_use_id, result)
  }

  // Pair each tool use with its result
  return toolUses.map(toolUse => ({
    toolUse,
    result: resultsByToolId.get(toolUse.id),
  }))
}

/**
 * Get messages by type
 */
export function filterMessagesByType(
  messages: ParsedMessage[],
  type: ParsedMessage['type']
): ParsedMessage[] {
  return messages.filter(msg => msg.type === type)
}

/**
 * Get user messages
 */
export function getUserMessages(messages: ParsedMessage[]): ParsedMessage[] {
  return filterMessagesByType(messages, 'user')
}

/**
 * Get assistant messages
 */
export function getAssistantMessages(messages: ParsedMessage[]): ParsedMessage[] {
  return filterMessagesByType(messages, 'assistant')
}

/**
 * Count messages by type
 */
export function countMessagesByType(messages: ParsedMessage[]): Record<string, number> {
  const counts: Record<string, number> = {}

  for (const msg of messages) {
    counts[msg.type] = (counts[msg.type] || 0) + 1
  }

  return counts
}

/**
 * Calculate message length statistics
 */
export function calculateMessageLengthStats(messages: ParsedMessage[]): {
  min: number
  max: number
  avg: number
  total: number
} {
  if (messages.length === 0) {
    return { min: 0, max: 0, avg: 0, total: 0 }
  }

  const lengths = messages.map(msg => {
    const text = extractTextFromMessage(msg)
    return text.length
  })

  return {
    min: Math.min(...lengths),
    max: Math.max(...lengths),
    avg: lengths.reduce((sum, len) => sum + len, 0) / lengths.length,
    total: lengths.reduce((sum, len) => sum + len, 0),
  }
}

/**
 * Check if message contains tool uses
 */
export function messageHasToolUses(message: ParsedMessage): boolean {
  if (typeof message.content === 'string') return false
  if (Array.isArray(message.content)) {
    return message.content.some(isToolUseContent)
  }
  // StructuredMessageContent
  return message.content.toolUses.length > 0 || message.content.structured.some(isToolUseContent)
}

/**
 * Check if message contains tool results
 */
export function messageHasToolResults(message: ParsedMessage): boolean {
  if (typeof message.content === 'string') return false
  if (Array.isArray(message.content)) {
    return message.content.some(isToolResultContent)
  }
  // StructuredMessageContent
  return (
    message.content.toolResults.length > 0 || message.content.structured.some(isToolResultContent)
  )
}

/**
 * Check if message contains thinking
 */
export function messageHasThinking(message: ParsedMessage): boolean {
  if (typeof message.content === 'string') return false
  if (Array.isArray(message.content)) {
    return message.content.some(isThinkingContent)
  }
  // StructuredMessageContent
  return message.content.structured.some(isThinkingContent)
}
