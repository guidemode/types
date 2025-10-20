import type { CopilotMetadata } from './providers/copilot/index.js'
import type { GeminiMetadata } from './providers/gemini/index.js'
import type { MessageContent } from './providers/shared/index.js'

// Session and message types
export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed'

/**
 * Provider-specific metadata
 * Use discriminated union to enable type narrowing
 */
export type ProviderMetadata =
  | { provider: 'claude-code'; metadata?: Record<string, unknown> }
  | { provider: 'codex'; metadata?: Record<string, unknown> }
  | { provider: 'opencode'; metadata?: Record<string, unknown> }
  | { provider: 'gemini-code'; metadata?: GeminiMetadata }
  | { provider: 'github-copilot'; metadata?: CopilotMetadata }
  | { provider: string; metadata?: Record<string, unknown> } // Catch-all

/**
 * Session Phase Types
 * Represents the different phases a coding session can go through
 */
export type SessionPhaseType =
  | 'initial_specification'
  | 'analysis_planning'
  | 'plan_modification'
  | 'plan_agreement'
  | 'execution'
  | 'interruption'
  | 'task_assignment'
  | 'completion'
  | 'correction'
  | 'final_completion'
  | 'other'

/**
 * Phase in the session timeline
 */
export interface SessionPhase {
  phaseType: SessionPhaseType
  startStep: number
  endStep: number
  stepCount: number
  summary: string
  durationMs: number
  timestamp?: string
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

export interface SessionsResponse {
  sessions: AgentSession[]
  pagination: {
    limit: number
    offset: number
    hasMore: boolean
  }
  totalSessionsOtherUsers?: number // Count of sessions by other users (when userFilter is 'mine' and no results)
}

/**
 * AI Model Metadata Types
 * These represent the results from various AI analysis tasks
 */

export interface IntentExtractionResult {
  primaryGoal?: string
  secondaryGoals?: string[]
  technologies?: string[] | Record<string, string>
  challenges?: string[]
  taskType?: string
}

export interface QualityAssessmentResult {
  score?: number
  improvements?: string[]
  strengths?: string[]
  reasoning?: string
}

export interface SessionSummaryResult {
  summary?: string
  keyPoints?: string[]
}

export interface AIModelMetadata {
  'intent-extraction'?: IntentExtractionResult
  'quality-assessment'?: QualityAssessmentResult
  'session-summary'?: SessionSummaryResult
  [key: string]: unknown // Allow additional analysis types
}

export interface SessionDetailResponse {
  id: string
  sessionId: string
  provider: string
  projectName: string
  sessionStartTime: string | null
  sessionEndTime: string | null
  durationMs: number | null
  fileName: string | null
  filePathR2: string | null
  fileSize: number | null
  uploadedAt: string
  processingStatus: ProcessingStatus
  queuedAt: string | null
  processedAt: string | null
  coreMetricsStatus: ProcessingStatus
  coreMetricsProcessedAt: string | null
  assessmentStatus: 'not_started' | 'rating_only' | 'in_progress' | 'completed'
  assessmentCompletedAt: string | null
  assessmentRating: 'thumbs_up' | 'meh' | 'thumbs_down' | null
  aiModelSummary: string | null
  aiModelQualityScore: number | null
  aiModelMetadata: AIModelMetadata | null
  aiModelPhaseAnalysis: SessionPhaseAnalysis | null
  // Git tracking fields (session-specific)
  gitBranch: string | null
  firstCommitHash: string | null
  latestCommitHash: string | null
  username: string
  userAvatarUrl: string | null
  project: {
    id: string
    name: string
    gitRemoteUrl: string | null
    cwd: string
    detectedType: string | null
  } | null
  // Pull request information (if linked to a GitHub PR)
  pullRequest?: {
    url: string
    number: number
    title: string | null
    state: string
    headBranch: string
    baseBranch: string
    repoFullName: string
  } | null
}

/** @deprecated Use SessionDetailResponse instead */
export interface SessionFilesResponse {
  sessionId: string
  provider: string
  projectName: string
  sessionStartTime: string | null
  sessionEndTime: string | null
  durationMs: number | null
  processingStatus: ProcessingStatus
  processedAt: string | null
  aiModelSummary: string | null
  aiModelQualityScore: number | null
  aiModelMetadata: AIModelMetadata | null
  aiModelPhaseAnalysis: SessionPhaseAnalysis | null
  username: string
  userAvatarUrl: string | null
  project?: {
    id: string
    name: string
    gitRemoteUrl: string | null
    cwd: string
    detectedType: string | null
  } | null
  files: SessionFile[]
}

export interface AgentSession {
  id: string
  provider: string
  projectName: string
  sessionId: string
  fileName: string | null
  filePath: string | null // Path to session file (R2 path for server, local path for desktop)
  fileSize: number | null
  userId: string
  username: string
  sessionStartTime: string | null
  sessionEndTime: string | null
  durationMs: number | null
  processingStatus: ProcessingStatus
  processedAt: string | null
  coreMetricsStatus: ProcessingStatus
  coreMetricsProcessedAt: string | null
  assessmentStatus: 'not_started' | 'rating_only' | 'in_progress' | 'completed'
  assessmentCompletedAt: string | null
  assessmentRating: 'thumbs_up' | 'meh' | 'thumbs_down' | null
  aiModelSummary: string | null
  aiModelQualityScore: number | null
  aiModelMetadata: AIModelMetadata | null
  aiModelPhaseAnalysis: SessionPhaseAnalysis | null
  // Git tracking fields (session-specific)
  gitBranch: string | null
  firstCommitHash: string | null
  latestCommitHash: string | null
  createdAt: string
  uploadedAt: string
}

export interface SessionFile {
  id: string
  fileName: string
  filePathR2: string
  fileSize: number
  uploadedAt: string
}

export interface SessionFileContent {
  fileName: string
  content: string
  size: number
  lastModified: string
}

export interface SessionsResponse {
  sessions: AgentSession[]
  pagination: {
    limit: number
    offset: number
    hasMore: boolean
  }
  totalSessionsOtherUsers?: number // Count of sessions by other users (when userFilter is 'mine' and no results)
}

export interface SessionFilters {
  provider?: string
  projectId?: string
  userFilter?: 'everyone' | 'mine'
  sortOrder?: 'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'size-asc' | 'size-desc'
  dateFilter?: 'all' | 'last24hrs' | 'today' | 'yesterday' | 'this-week' | 'last-week' | 'range'
  dateRange?: { from: string; to: string }
  limit?: number
  offset?: number
}

// Moved SessionsResponse and SessionFilesResponse interfaces here (defined above)

// Message types for session parsing
export type MessageType =
  | 'user'
  | 'assistant'
  | 'system'
  | 'meta'
  | 'command'
  | 'command_output'
  | 'interruption'
  | 'user_input'
  | 'assistant_response'
  | 'tool_use'
  | 'tool_result'

export interface ParsedMessage {
  id: string
  timestamp: Date
  type: MessageType
  content: MessageContent
  metadata?: Record<string, unknown>
  providerMetadata?: ProviderMetadata // Provider-specific typed metadata
  parentId?: string
  linkedTo?: string
}

export interface ParsedSession {
  sessionId: string
  provider: string
  messages: ParsedMessage[]
  startTime: Date
  endTime: Date
  duration: number
  // biome-ignore lint/suspicious/noExplicitAny: TODO: Define specific metadata schema
  metadata?: Record<string, any>
}

// Legacy UI message types (for backward compatibility)
export interface BaseSessionMessage {
  id: string
  timestamp: string
  type: MessageType
  // biome-ignore lint/suspicious/noExplicitAny: TODO: Create proper content type union for different message types
  content: any
  // biome-ignore lint/suspicious/noExplicitAny: TODO: Define specific metadata schema
  metadata?: Record<string, any>
  parentId?: string
  linkedTo?: string
}

export interface ConversationTurn {
  id: string
  timestamp: string
  userInput?: {
    content: string
    timestamp: string
  }
  assistantResponse?: {
    content: string
    timestamp: string
    toolUses?: Array<{
      name: string
      // biome-ignore lint/suspicious/noExplicitAny: TODO: Create proper tool input type
      input: any
      // biome-ignore lint/suspicious/noExplicitAny: TODO: Create proper tool result type
      result?: any
    }>
  }
  // biome-ignore lint/suspicious/noExplicitAny: TODO: Define specific metadata schema
  metadata?: Record<string, any>
}

export interface SessionParser {
  name: string
  parse(content: string, provider: string): BaseSessionMessage[]
  canParse(content: string): boolean
}

export interface ProviderAdapter {
  name: string
  // biome-ignore lint/suspicious/noExplicitAny: Adapters handle multiple unknown message formats
  transform(rawMessage: any): BaseSessionMessage[]
}

export interface SessionViewerProps {
  content: string
  fileName: string
  provider?: string
}

export interface ClaudeMessage {
  uuid: string
  timestamp: string
  type: 'user' | 'assistant'
  message: {
    role: string
    content:
      | string
      // biome-ignore lint/suspicious/noExplicitAny: TODO: Define proper Claude message content blocks
      | Array<{ type: string; text?: string; tool_use_id?: string; content?: any }>
  }
  parentUuid?: string
  isMeta?: boolean
  sessionId: string
  userType?: string
  requestId?: string
}

// Session upload types for desktop -> server sync
export interface SessionUploadRequest {
  provider: string
  projectName: string
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

export interface SessionUploadResponse {
  success: boolean
  sessionId: string
  filePath?: string
  size?: number
}

// Session metrics upload types
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

export interface SessionMetricsUploadRequest {
  metrics: SessionMetricUpload[]
}

export interface SessionMetricsUploadResponse {
  success: boolean
  insertedCount: number
}
