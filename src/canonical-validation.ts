/**
 * Canonical JSONL Format Validation
 *
 * Comprehensive Zod-based validation for canonical JSONL format.
 * Supports tiered validation (critical errors vs warnings) and semantic checks.
 */

import { z } from 'zod'

// ============================================================================
// Core Schemas
// ============================================================================

/**
 * RFC3339 timestamp validator
 * Validates ISO 8601 / RFC3339 format timestamps
 */
const RFC3339Schema = z.string().refine(
  val => {
    try {
      const date = new Date(val)
      return !Number.isNaN(date.getTime()) && val === date.toISOString()
    } catch {
      return false
    }
  },
  { message: 'Must be a valid RFC3339/ISO 8601 timestamp' }
)

/**
 * Non-empty string validator
 */
const NonEmptyStringSchema = z.string().min(1, 'Must not be empty')

/**
 * Message type enum
 */
const MessageTypeSchema = z.enum(['user', 'assistant', 'meta'], {
  errorMap: () => ({ message: "Must be 'user', 'assistant', or 'meta'" }),
})

/**
 * Token usage statistics
 */
const TokenUsageSchema = z.object({
  input_tokens: z.number().int().nonnegative().optional(),
  output_tokens: z.number().int().nonnegative().optional(),
  cache_creation_input_tokens: z.number().int().nonnegative().optional(),
  cache_read_input_tokens: z.number().int().nonnegative().optional(),
})

// ============================================================================
// Content Block Schemas
// ============================================================================

/**
 * Text content block
 */
const TextBlockSchema = z.object({
  type: z.literal('text'),
  text: NonEmptyStringSchema,
})

/**
 * Thinking content block
 */
const ThinkingBlockSchema = z.object({
  type: z.literal('thinking'),
  thinking: z.string().optional(),
  signature: z.string().optional(), // For Claude encrypted thinking
})

/**
 * Tool use content block
 */
const ToolUseBlockSchema = z.object({
  type: z.literal('tool_use'),
  id: NonEmptyStringSchema,
  name: NonEmptyStringSchema,
  input: z.record(z.unknown()),
})

/**
 * Tool result content block
 * CRITICAL: tool_use_id and content must not be empty
 */
const ToolResultBlockSchema = z.object({
  type: z.literal('tool_result'),
  tool_use_id: NonEmptyStringSchema,
  content: NonEmptyStringSchema,
  is_error: z.boolean().optional(),
})

/**
 * Union of all content block types
 */
const ContentBlockSchema = z.discriminatedUnion('type', [
  TextBlockSchema,
  ThinkingBlockSchema,
  ToolUseBlockSchema,
  ToolResultBlockSchema,
])

/**
 * Content value - can be plain text or structured blocks
 */
const ContentValueSchema = z.union([z.string(), z.array(ContentBlockSchema)])

/**
 * Message content structure
 */
const MessageContentSchema = z.object({
  role: NonEmptyStringSchema,
  content: ContentValueSchema,
  model: z.string().optional(),
  usage: TokenUsageSchema.optional(),
})

/**
 * Complete canonical message schema
 *
 * IMPORTANT: This validates the CANONICAL format (post-conversion)
 * - Native Claude logs need filtering (remove file-history-snapshot, etc.)
 * - All converters must add `provider` field
 * - Only conversational messages (user, assistant, meta) are allowed
 */
export const CanonicalMessageSchema = z.object({
  // Required fields
  uuid: NonEmptyStringSchema,
  timestamp: RFC3339Schema,
  type: MessageTypeSchema, // Only: user, assistant, meta
  sessionId: NonEmptyStringSchema,
  provider: NonEmptyStringSchema, // REQUIRED - added by converters
  message: MessageContentSchema, // REQUIRED - all canonical messages have content

  // Optional context fields
  cwd: z.string().optional(),
  gitBranch: z.string().optional(),
  version: z.string().optional(),

  // Threading and metadata
  parentUuid: z.string().nullable().optional(), // Can be null in Claude format
  logicalParentUuid: z.string().optional(), // Claude-specific field
  isSidechain: z.boolean().optional(),
  userType: z.string().optional(),
  providerMetadata: z.record(z.unknown()).optional(),
  isMeta: z.boolean().optional(),
  requestId: z.string().optional(),
  toolUseResult: z.unknown().optional(),

  // Claude-specific optional fields
  level: z.string().optional(),
  subtype: z.string().optional(),
  content: z.string().optional(), // For system messages
  compactMetadata: z.record(z.unknown()).optional(),
  toolUseID: z.string().optional(),
})

export type CanonicalMessage = z.infer<typeof CanonicalMessageSchema>
export type ContentBlock = z.infer<typeof ContentBlockSchema>

// ============================================================================
// Validation Result Types
// ============================================================================

export type ValidationSeverity = 'error' | 'warning'

export interface ValidationIssue {
  severity: ValidationSeverity
  code: string
  message: string
  path?: string
  line?: number
  details?: unknown
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationIssue[]
  warnings: ValidationIssue[]
  messageCount: number
  validCount: number
}

// ============================================================================
// Critical Validation Rules
// ============================================================================

/**
 * Validates message type and role consistency
 * CRITICAL: tool_result blocks must be in user messages
 */
function validateMessageTypeRoleConsistency(
  message: CanonicalMessage,
  line?: number
): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const { type, message: messageContent } = message

  // Extract content blocks if structured
  const blocks =
    typeof messageContent.content === 'string' ? [] : (messageContent.content as ContentBlock[])

  // Check for tool_result blocks
  const hasToolResult = blocks.some(block => block.type === 'tool_result')

  if (hasToolResult) {
    // CRITICAL: tool_result must be in user messages
    if (type !== 'user') {
      issues.push({
        severity: 'error',
        code: 'INVALID_TOOL_RESULT_MESSAGE_TYPE',
        message: `tool_result blocks must be in user messages, found in ${type} message`,
        path: 'type',
        line,
        details: { type, role: messageContent.role },
      })
    }

    // CRITICAL: tool_result messages must have role "user"
    if (messageContent.role !== 'user') {
      issues.push({
        severity: 'error',
        code: 'INVALID_TOOL_RESULT_ROLE',
        message: `tool_result messages must have role "user", found "${messageContent.role}"`,
        path: 'message.role',
        line,
        details: { role: messageContent.role },
      })
    }
  }

  // Check message type and role alignment
  if (type === 'user' && messageContent.role !== 'user') {
    issues.push({
      severity: 'warning',
      code: 'MISALIGNED_USER_ROLE',
      message: `User message type should have role "user", found "${messageContent.role}"`,
      path: 'message.role',
      line,
    })
  }

  if (type === 'assistant' && messageContent.role !== 'assistant') {
    issues.push({
      severity: 'warning',
      code: 'MISALIGNED_ASSISTANT_ROLE',
      message: `Assistant message type should have role "assistant", found "${messageContent.role}"`,
      path: 'message.role',
      line,
    })
  }

  return issues
}

/**
 * Validates timestamp format and value
 */
function validateTimestamp(message: CanonicalMessage, line?: number): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  try {
    const date = new Date(message.timestamp)
    if (Number.isNaN(date.getTime())) {
      issues.push({
        severity: 'error',
        code: 'INVALID_TIMESTAMP_FORMAT',
        message: 'Timestamp is not a valid date',
        path: 'timestamp',
        line,
        details: { timestamp: message.timestamp },
      })
    }

    // Check if timestamp is too far in the future (> 1 day)
    const now = new Date()
    const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    if (date > oneDayFromNow) {
      issues.push({
        severity: 'warning',
        code: 'FUTURE_TIMESTAMP',
        message: 'Timestamp is more than 1 day in the future',
        path: 'timestamp',
        line,
        details: { timestamp: message.timestamp },
      })
    }

    // Check if timestamp is too far in the past (> 5 years)
    const fiveYearsAgo = new Date(now.getTime() - 5 * 365 * 24 * 60 * 60 * 1000)
    if (date < fiveYearsAgo) {
      issues.push({
        severity: 'warning',
        code: 'OLD_TIMESTAMP',
        message: 'Timestamp is more than 5 years in the past',
        path: 'timestamp',
        line,
        details: { timestamp: message.timestamp },
      })
    }
  } catch (error) {
    issues.push({
      severity: 'error',
      code: 'TIMESTAMP_PARSE_ERROR',
      message: `Failed to parse timestamp: ${error}`,
      path: 'timestamp',
      line,
      details: { timestamp: message.timestamp, error: String(error) },
    })
  }

  return issues
}

/**
 * Validates content blocks for common issues
 */
function validateContentBlocks(message: CanonicalMessage, line?: number): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const { content } = message.message

  // Skip if content is plain text
  if (typeof content === 'string') {
    return issues
  }

  const blocks = content as ContentBlock[]

  // Validate each block
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]

    // Tool use validation
    if (block.type === 'tool_use') {
      // Check for valid JSON in input
      try {
        JSON.stringify(block.input)
      } catch (error) {
        issues.push({
          severity: 'error',
          code: 'INVALID_TOOL_USE_INPUT',
          message: `tool_use input is not valid JSON: ${error}`,
          path: `message.content[${i}].input`,
          line,
          details: { blockIndex: i, error: String(error) },
        })
      }

      // Warn about empty tool use ID
      if (!block.id || block.id.trim().length === 0) {
        issues.push({
          severity: 'error',
          code: 'EMPTY_TOOL_USE_ID',
          message: 'tool_use block has empty ID',
          path: `message.content[${i}].id`,
          line,
          details: { blockIndex: i },
        })
      }
    }

    // Tool result validation
    if (block.type === 'tool_result') {
      // CRITICAL: tool_use_id must not be empty
      if (!block.tool_use_id || block.tool_use_id.trim().length === 0) {
        issues.push({
          severity: 'error',
          code: 'EMPTY_TOOL_USE_ID',
          message: 'tool_result block has empty tool_use_id',
          path: `message.content[${i}].tool_use_id`,
          line,
          details: { blockIndex: i },
        })
      }

      // CRITICAL: content must not be empty
      if (!block.content || block.content.trim().length === 0) {
        issues.push({
          severity: 'error',
          code: 'EMPTY_TOOL_RESULT_CONTENT',
          message: 'tool_result block has empty content',
          path: `message.content[${i}].content`,
          line,
          details: { blockIndex: i },
        })
      }
    }
  }

  return issues
}

/**
 * Validates provider metadata for data duplication issues
 */
function validateProviderMetadata(message: CanonicalMessage, line?: number): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const { providerMetadata, message: messageContent } = message

  if (!providerMetadata) {
    return issues
  }

  // Check for content duplication in metadata
  const contentStr =
    typeof messageContent.content === 'string'
      ? messageContent.content
      : JSON.stringify(messageContent.content)

  const metadataStr = JSON.stringify(providerMetadata)

  // If the entire content appears in metadata, warn about duplication
  if (contentStr.length > 50 && metadataStr.includes(contentStr.substring(0, 50))) {
    issues.push({
      severity: 'warning',
      code: 'DUPLICATE_CONTENT_IN_METADATA',
      message: 'Content appears to be duplicated in providerMetadata',
      path: 'providerMetadata',
      line,
      details: { metadataSize: metadataStr.length, contentSize: contentStr.length },
    })
  }

  return issues
}

/**
 * Validate a single canonical message
 */
export function validateCanonicalMessage(message: unknown, line?: number): ValidationResult {
  const errors: ValidationIssue[] = []
  const warnings: ValidationIssue[] = []

  // Schema validation
  const parseResult = CanonicalMessageSchema.safeParse(message)

  if (!parseResult.success) {
    // Extract Zod errors
    for (const issue of parseResult.error.issues) {
      errors.push({
        severity: 'error',
        code: 'SCHEMA_VALIDATION_ERROR',
        message: issue.message,
        path: issue.path.join('.'),
        line,
        details: issue,
      })
    }

    return {
      valid: false,
      errors,
      warnings,
      messageCount: 1,
      validCount: 0,
    }
  }

  const validMessage = parseResult.data

  // Semantic validation
  const messageTypeIssues = validateMessageTypeRoleConsistency(validMessage, line)
  const timestampIssues = validateTimestamp(validMessage, line)
  const contentIssues = validateContentBlocks(validMessage, line)
  const metadataIssues = validateProviderMetadata(validMessage, line)

  const allIssues = [...messageTypeIssues, ...timestampIssues, ...contentIssues, ...metadataIssues]

  // Separate errors and warnings
  for (const issue of allIssues) {
    if (issue.severity === 'error') {
      errors.push(issue)
    } else {
      warnings.push(issue)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    messageCount: 1,
    validCount: errors.length === 0 ? 1 : 0,
  }
}

// ============================================================================
// Session-Wide Validation
// ============================================================================

export interface SessionValidationResult extends ValidationResult {
  sessionId: string
  provider: string | undefined // Extracted from first message (will be undefined if validation fails)
  startTime?: string
  endTime?: string
  duration?: number
  toolChainIssues: ValidationIssue[]
}

/**
 * Validates tool use/result matching across a session
 * IMPORTANT: tool_use can exist without tool_result (waiting for result)
 * BUT tool_result MUST have a corresponding tool_use (no orphans)
 */
export function validateToolChain(messages: CanonicalMessage[]): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const toolUseMap = new Map<string, { messageIndex: number; name: string }>()
  const toolResultsSeen = new Set<string>()

  // First pass: collect all tool_use blocks
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i]
    const { content } = message.message

    if (typeof content === 'string') continue

    const blocks = content as ContentBlock[]

    for (const block of blocks) {
      if (block.type === 'tool_use') {
        toolUseMap.set(block.id, {
          messageIndex: i,
          name: block.name,
        })
      }
    }
  }

  // Second pass: validate tool_result blocks
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i]
    const { content } = message.message

    if (typeof content === 'string') continue

    const blocks = content as ContentBlock[]

    for (const block of blocks) {
      if (block.type === 'tool_result') {
        const toolUseId = block.tool_use_id

        // CRITICAL: tool_result must have corresponding tool_use
        if (!toolUseMap.has(toolUseId)) {
          issues.push({
            severity: 'error',
            code: 'ORPHAN_TOOL_RESULT',
            message: `tool_result references tool_use_id "${toolUseId}" which doesn't exist`,
            path: `messages[${i}]`,
            line: i + 1,
            details: {
              messageIndex: i,
              toolUseId,
              uuid: message.uuid,
            },
          })
        }

        // Track duplicate tool results
        if (toolResultsSeen.has(toolUseId)) {
          issues.push({
            severity: 'warning',
            code: 'DUPLICATE_TOOL_RESULT',
            message: `Multiple tool_result blocks for tool_use_id "${toolUseId}"`,
            path: `messages[${i}]`,
            line: i + 1,
            details: {
              messageIndex: i,
              toolUseId,
              uuid: message.uuid,
            },
          })
        }

        toolResultsSeen.add(toolUseId)
      }
    }
  }

  // NOTE: We do NOT warn about tool_use without tool_result
  // This is valid - tool may be waiting for result or never completed

  return issues
}

/**
 * Validates UUID uniqueness across messages
 * CRITICAL: Each message must have a unique UUID
 */
export function validateUUIDUniqueness(messages: CanonicalMessage[]): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const uuidMap = new Map<string, number[]>() // UUID -> array of message indices

  // Collect all UUIDs and their locations
  for (let i = 0; i < messages.length; i++) {
    const uuid = messages[i].uuid
    if (!uuidMap.has(uuid)) {
      uuidMap.set(uuid, [])
    }
    uuidMap.get(uuid)?.push(i)
  }

  // Report duplicates
  for (const [uuid, indices] of uuidMap.entries()) {
    if (indices.length > 1) {
      issues.push({
        severity: 'error',
        code: 'DUPLICATE_UUID',
        message: `UUID "${uuid}" appears in ${indices.length} messages (indices: ${indices.join(', ')})`,
        path: 'uuid',
        details: {
          uuid,
          messageIndices: indices,
          count: indices.length,
        },
      })
    }
  }

  return issues
}

/**
 * Validates timestamp ordering across messages
 */
export function validateTimestampOrdering(messages: CanonicalMessage[]): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  for (let i = 1; i < messages.length; i++) {
    const prevMessage = messages[i - 1]
    const currMessage = messages[i]

    try {
      const prevTime = new Date(prevMessage.timestamp).getTime()
      const currTime = new Date(currMessage.timestamp).getTime()

      if (currTime < prevTime) {
        issues.push({
          severity: 'warning',
          code: 'OUT_OF_ORDER_TIMESTAMP',
          message: 'Message timestamp is earlier than previous message',
          path: `messages[${i}]`,
          line: i + 1,
          details: {
            messageIndex: i,
            timestamp: currMessage.timestamp,
            previousTimestamp: prevMessage.timestamp,
            uuid: currMessage.uuid,
          },
        })
      }

      // Warn about large time gaps (> 1 hour)
      const timeDiff = currTime - prevTime
      if (timeDiff > 60 * 60 * 1000) {
        issues.push({
          severity: 'warning',
          code: 'LARGE_TIME_GAP',
          message: `Large time gap (${Math.round(timeDiff / 1000 / 60)} minutes) between messages`,
          path: `messages[${i}]`,
          line: i + 1,
          details: {
            messageIndex: i,
            gapMs: timeDiff,
            uuid: currMessage.uuid,
          },
        })
      }
    } catch (_error) {
      // Timestamp parse errors already caught by validateTimestamp
    }
  }

  return issues
}

/**
 * Validates a complete session (array of messages)
 */
export function validateSession(messages: CanonicalMessage[]): SessionValidationResult {
  if (messages.length === 0) {
    return {
      valid: true,
      errors: [],
      warnings: [],
      messageCount: 0,
      validCount: 0,
      sessionId: '',
      provider: '',
      toolChainIssues: [],
    }
  }

  // Validate each message
  let totalErrors: ValidationIssue[] = []
  let totalWarnings: ValidationIssue[] = []
  let validCount = 0

  for (let i = 0; i < messages.length; i++) {
    const result = validateCanonicalMessage(messages[i], i + 1)
    totalErrors = totalErrors.concat(result.errors)
    totalWarnings = totalWarnings.concat(result.warnings)
    if (result.valid) {
      validCount++
    }
  }

  // Session-wide validation
  const uuidIssues = validateUUIDUniqueness(messages)
  const toolChainIssues = validateToolChain(messages)
  const timestampIssues = validateTimestampOrdering(messages)

  // Merge issues
  for (const issue of [...uuidIssues, ...toolChainIssues, ...timestampIssues]) {
    if (issue.severity === 'error') {
      totalErrors.push(issue)
    } else {
      totalWarnings.push(issue)
    }
  }

  // Extract session metadata
  const firstMessage = messages[0]
  const lastMessage = messages[messages.length - 1]

  let duration: number | undefined
  try {
    const start = new Date(firstMessage.timestamp).getTime()
    const end = new Date(lastMessage.timestamp).getTime()
    duration = end - start
  } catch {
    // Ignore parse errors
  }

  return {
    valid: totalErrors.length === 0,
    errors: totalErrors,
    warnings: totalWarnings,
    messageCount: messages.length,
    validCount,
    sessionId: firstMessage.sessionId,
    provider: firstMessage.provider,
    startTime: firstMessage.timestamp,
    endTime: lastMessage.timestamp,
    duration,
    toolChainIssues,
  }
}
