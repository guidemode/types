/**
 * Shared content block types used across all AI coding assistant providers
 * These types represent the standardized message content structure
 */

/**
 * Plain text content block
 * Used by: All providers
 */
export interface TextContent {
  type: 'text'
  text: string
}

/**
 * Tool/function invocation content block
 * Used by: Claude, Codex (as function_call), Gemini, OpenCode, Copilot
 */
export interface ToolUseContent {
  type: 'tool_use'
  id: string // Unique identifier for this tool use
  name: string // Tool name (e.g., 'Read', 'Bash', 'Edit')
  input: Record<string, unknown> // Tool parameters
}

/**
 * TodoWrite tool input structure
 * Used by: Claude Code, OpenCode for task tracking
 */
export interface TodoWriteInput {
  todos: Array<{
    content: string // Description of the todo item
    status: 'pending' | 'in_progress' | 'completed' // Current state
    activeForm: string // Present-tense version (e.g., "Creating..." vs "Create...")
  }>
}

/**
 * Type guard to check if a ToolUseContent is a TodoWrite call
 */
export function isTodoWriteTool(
  tool: ToolUseContent
): tool is ToolUseContent & { input: TodoWriteInput } {
  return tool.name === 'TodoWrite' && 'todos' in tool.input && Array.isArray(tool.input.todos)
}

/**
 * Tool/function execution result content block
 * Used by: Claude, Codex (as function_call_output), Gemini, OpenCode, Copilot
 */
export interface ToolResultContent {
  type: 'tool_result'
  tool_use_id: string // Links to ToolUseContent.id
  content: unknown // Result can be string, object, array, etc.
  is_error?: boolean // Explicit error flag
}

/**
 * Extended thinking/reasoning content block
 * Used by: Claude (encrypted signature), Codex (reasoning), Gemini (thoughts), OpenCode
 */
export interface ThinkingContent {
  type: 'thinking'
  thinking?: string // Plain text reasoning (OpenCode, some Claude)
  signature?: string // Encrypted/hashed thinking (Claude extended thinking)
}

/**
 * Image content block (base64 encoded)
 * Used by: Claude, OpenCode, Copilot
 */
export interface ImageContent {
  type: 'image'
  source: {
    type: 'base64'
    media_type: string // e.g., 'image/png', 'image/jpeg'
    data: string // Base64 encoded image data
  }
}

/**
 * System reminder content block
 * Used by: Claude, OpenCode
 */
export interface SystemReminderContent {
  type: 'system_reminder'
  text: string
}

/**
 * Unknown/extensible content block for future provider types
 * Allows graceful handling of new content types
 */
export interface UnknownContent {
  type: string // Any other type not explicitly defined
  [key: string]: unknown // Flexible structure
}

/**
 * Union type for all possible content blocks
 * This is the primary type used throughout the codebase
 */
export type ContentBlock =
  | TextContent
  | ToolUseContent
  | ToolResultContent
  | ThinkingContent
  | ImageContent
  | SystemReminderContent
  | UnknownContent

/**
 * Structured message content with parsed components
 * Used by parsers to provide easy access to different content types
 */
export interface StructuredMessageContent {
  text?: string
  toolUses: ToolUseContent[]
  toolResults: ToolResultContent[]
  structured: ContentBlock[]
}

/**
 * Message content can be:
 * - A simple string (common for user messages)
 * - An array of content blocks (common for assistant messages with tools)
 * - A structured object with parsed components (from parsers)
 */
export type MessageContent = string | ContentBlock[] | StructuredMessageContent

/**
 * Type guards for content blocks
 */

export function isTextContent(block: ContentBlock): block is TextContent {
  return block.type === 'text'
}

export function isToolUseContent(block: ContentBlock): block is ToolUseContent {
  return block.type === 'tool_use'
}

export function isToolResultContent(block: ContentBlock): block is ToolResultContent {
  return block.type === 'tool_result'
}

export function isThinkingContent(block: ContentBlock): block is ThinkingContent {
  return block.type === 'thinking'
}

export function isImageContent(block: ContentBlock): block is ImageContent {
  return block.type === 'image'
}

export function isSystemReminderContent(block: ContentBlock): block is SystemReminderContent {
  return block.type === 'system_reminder'
}

/**
 * Type guard to check if content is StructuredMessageContent
 */
export function isStructuredMessageContent(
  content: MessageContent
): content is StructuredMessageContent {
  return (
    typeof content === 'object' &&
    content !== null &&
    !Array.isArray(content) &&
    'structured' in content
  )
}

/**
 * Helper to extract specific content block types from message content
 */
export function extractContentBlocks<T extends ContentBlock>(
  content: MessageContent,
  predicate: (block: ContentBlock) => block is T
): T[] {
  if (typeof content === 'string') {
    return []
  }
  if (isStructuredMessageContent(content)) {
    return content.structured.filter(predicate)
  }
  return content.filter(predicate)
}

/**
 * Helper to get text from content (handles all content types)
 */
export function getTextFromContent(content: MessageContent): string {
  if (typeof content === 'string') {
    return content
  }

  if (isStructuredMessageContent(content)) {
    return content.text || ''
  }

  return content
    .filter(isTextContent)
    .map(block => block.text)
    .join('\n')
}

/**
 * Helper to check if content contains any tool uses
 */
export function hasToolUses(content: MessageContent): boolean {
  if (typeof content === 'string') return false
  if (isStructuredMessageContent(content)) {
    return content.toolUses.length > 0
  }
  return content.some(isToolUseContent)
}

/**
 * Helper to check if content contains any tool results
 */
export function hasToolResults(content: MessageContent): boolean {
  if (typeof content === 'string') return false
  if (isStructuredMessageContent(content)) {
    return content.toolResults.length > 0
  }
  return content.some(isToolResultContent)
}
