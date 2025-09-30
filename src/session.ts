// Session and message types
export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface SessionsResponse {
  sessions: AgentSession[]
  pagination: {
    limit: number
    offset: number
    hasMore: boolean
  }
}

export interface SessionFilesResponse {
  sessionId: string
  provider: string
  projectName: string
  sessionStartTime: string | null
  sessionEndTime: string | null
  durationMs: number | null
  files: SessionFile[]
}

export interface AgentSession {
  id: string
  provider: string
  projectName: string
  sessionId: string
  fileName: string
  fileSize: number
  userId: string
  username: string
  sessionStartTime: string | null
  sessionEndTime: string | null
  durationMs: number | null
  processingStatus: ProcessingStatus
  processedAt: string | null
  assessmentStatus: 'not_started' | 'in_progress' | 'completed'
  assessmentCompletedAt: string | null
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
}

export interface SessionFilesResponse {
  sessionId: string
  provider: string
  projectName: string
  sessionStartTime: string | null
  sessionEndTime: string | null
  durationMs: number | null
  files: SessionFile[]
}

export interface SessionFilters {
  provider?: string
  userFilter?: 'everyone' | 'mine'
  sortOrder?: 'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'size-asc' | 'size-desc'
  dateFilter?: 'last24hrs' | 'today' | 'yesterday' | 'this-week' | 'last-week' | 'range'
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
  content: any
  metadata?: Record<string, any>
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
  metadata?: Record<string, any>
}

// Legacy UI message types (for backward compatibility)
export interface BaseSessionMessage {
  id: string
  timestamp: string
  type: MessageType
  content: any
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
      input: any
      result?: any
    }>
  }
  metadata?: Record<string, any>
}

export interface SessionParser {
  name: string
  parse(content: string, provider?: string): BaseSessionMessage[]
  canParse(content: string): boolean
}

export interface ProviderAdapter {
  name: string
  transform(rawMessage: any): BaseSessionMessage[]
  detect(content: any): boolean
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
    content: string | Array<{ type: string; text?: string; tool_use_id?: string; content?: any }>
  }
  parentUuid?: string
  isMeta?: boolean
  sessionId: string
  userType?: string
  requestId?: string
}

export interface ToolUseContent {
  type: 'tool_use'
  id: string
  name: string
  input: Record<string, any>
}

export interface ToolResultContent {
  type: 'tool_result'
  tool_use_id: string
  content: any
}

export interface TextContent {
  type: 'text'
  text: string
}