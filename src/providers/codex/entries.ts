/**
 * Auto-generated Zod schemas for Codex JSONL entries
 *
 * Generated: 2025-10-16T02:20:58.929Z
 * Source: codex-jsonl.json
 * Entry types: user, assistant, system, summary, unknown
 * Total files processed: 495
 */

import { z } from 'zod'
import type { ContentBlock } from '../shared/index.js'

// === SHARED SCHEMAS ===

/**
 * Base message content block types
 */
const TextContentBlockSchema = z.object({
  type: z.literal('text'),
  text: z.string(),
})

const ThinkingContentBlockSchema = z.object({
  type: z.literal('thinking'),
  thinking: z.string(),
  signature: z.string().optional(),
})

const ToolUseContentBlockSchema = z.object({
  type: z.literal('tool_use'),
  id: z.string(),
  name: z.string(),
  input: z.record(z.unknown()),
})

const ContentBlockSchema = z.union([
  TextContentBlockSchema,
  ThinkingContentBlockSchema,
  ToolUseContentBlockSchema,
])

/**
 * Shared usage statistics structure
 */
const UsageSchema = z.object({
  input_tokens: z.number(),
  output_tokens: z.number(),
  cache_creation_input_tokens: z.number(),
  cache_read_input_tokens: z.number(),
  service_tier: z.string().nullable(),
  cache_creation: z.object({
    ephemeral_5m_input_tokens: z.number(),
    ephemeral_1h_input_tokens: z.number(),
  }),
  server_tool_use: z
    .object({
      web_search_requests: z.number(),
    })
    .optional(),
})

/**
 * Thinking metadata configuration
 */
const ThinkingMetadataSchema = z.object({
  level: z.string(),
  disabled: z.boolean(),
  triggers: z.array(z.unknown()),
})

/**
 * Compact metadata for conversation compaction
 */
const CompactMetadataSchema = z.object({
  trigger: z.string(),
  preTokens: z.number(),
})

// === USER ENTRIES ===

/**
 * User message entry from Codex session logs
 *
 * Required fields:
 * - type: Always 'user'
 * - uuid: Unique entry identifier
 * - timestamp: ISO 8601 timestamp
 * - sessionId: Session identifier
 * - version: Codex version string
 * - cwd: Current working directory
 * - gitBranch: Git branch name
 * - userType: User type (typically 'external')
 * - isSidechain: Whether this is a sidechain conversation
 * - parentUuid: Parent entry UUID (null for root entries)
 * - message: User message content
 *
 * Optional fields:
 * - isMeta: Indicates system metadata message
 * - isVisibleInTranscriptOnly: Only visible in transcript view
 * - isCompactSummary: Indicates a conversation compaction summary
 * - thinkingMetadata: Extended thinking configuration
 */
export const UserSchema = z
  .object({
    // === Core Required Fields ===
    type: z.literal('user'),
    uuid: z.string(),
    timestamp: z.string(),
    sessionId: z.string(),
    version: z.string(),
    cwd: z.string(),
    gitBranch: z.string(),
    userType: z.string(),
    isSidechain: z.boolean(),
    parentUuid: z.string().nullable(),

    // === Message Content ===
    message: z.object({
      role: z.literal('user'),
      content: z.string(),
    }),

    // === Optional Fields ===
    isMeta: z.boolean().optional(),
    isVisibleInTranscriptOnly: z.boolean().optional(),
    isCompactSummary: z.boolean().optional(),
    thinkingMetadata: ThinkingMetadataSchema.optional(),
  })
  .strict()

export type User = z.infer<typeof UserSchema>

// === ASSISTANT ENTRIES ===

/**
 * Assistant response entry from Codex session logs
 *
 * Required fields:
 * - type: Always 'assistant'
 * - uuid: Unique entry identifier
 * - timestamp: ISO 8601 timestamp
 * - sessionId: Session identifier
 * - version: Codex version string
 * - cwd: Current working directory
 * - gitBranch: Git branch name
 * - userType: User type (typically 'external')
 * - isSidechain: Whether this is a sidechain conversation
 * - parentUuid: Parent entry UUID
 * - message: Assistant message with content and metadata
 *
 * Optional fields:
 * - requestId: API request identifier
 * - isApiErrorMessage: Indicates an API error response
 */
export const AssistantSchema = z
  .object({
    // === Core Required Fields ===
    type: z.literal('assistant'),
    uuid: z.string(),
    timestamp: z.string(),
    sessionId: z.string(),
    version: z.string(),
    cwd: z.string(),
    gitBranch: z.string(),
    userType: z.string(),
    isSidechain: z.boolean(),
    parentUuid: z.string(),

    // === Message Content ===
    message: z.object({
      id: z.string(),
      type: z.literal('message'),
      role: z.literal('assistant'),
      model: z.string(),
      content: z.array(ContentBlockSchema),
      stop_reason: z.string().nullable(),
      stop_sequence: z.string().nullable(),
      usage: UsageSchema,
      container: z.null().optional(),
    }),

    // === Optional Fields ===
    requestId: z.string().optional(),
    isApiErrorMessage: z.boolean().optional(),
  })
  .strict()

export type Assistant = z.infer<typeof AssistantSchema>

// === SYSTEM ENTRIES ===

/**
 * System event entry from Codex session logs
 *
 * Required fields:
 * - type: Always 'system'
 * - uuid: Unique entry identifier
 * - timestamp: ISO 8601 timestamp
 * - sessionId: Session identifier
 * - version: Codex version string
 * - cwd: Current working directory
 * - gitBranch: Git branch name
 * - userType: User type (typically 'external')
 * - isSidechain: Whether this is a sidechain conversation
 * - parentUuid: Parent entry UUID (nullable)
 * - subtype: System event subtype
 * - content: Event content/message
 * - level: Log level (info, warn, error, etc.)
 * - isMeta: Whether this is metadata
 *
 * Optional fields:
 * - logicalParentUuid: Logical parent for compaction events
 * - compactMetadata: Metadata for compaction events
 * - toolUseID: Tool use identifier for tool-related events
 */
export const SystemSchema = z
  .object({
    // === Core Required Fields ===
    type: z.literal('system'),
    uuid: z.string(),
    timestamp: z.string(),
    sessionId: z.string(),
    version: z.string(),
    cwd: z.string(),
    gitBranch: z.string(),
    userType: z.string(),
    isSidechain: z.boolean(),
    parentUuid: z.string().nullable(),
    subtype: z.string(),
    content: z.string(),
    level: z.string(),
    isMeta: z.boolean(),

    // === Optional Fields ===
    logicalParentUuid: z.string().optional(),
    compactMetadata: CompactMetadataSchema.optional(),
    toolUseID: z.string().optional(),
  })
  .strict()

export type System = z.infer<typeof SystemSchema>

// === SUMMARY ENTRIES ===

/**
 * Session summary entry from Codex
 *
 * Required fields:
 * - type: Always 'summary'
 * - summary: Summary text content
 * - leafUuid: UUID of the last entry in the summarized conversation
 */
export const SummarySchema = z
  .object({
    type: z.literal('summary'),
    summary: z.string(),
    leafUuid: z.string(),
  })
  .strict()

export type Summary = z.infer<typeof SummarySchema>

// === UNKNOWN ENTRIES ===

/**
 * Unknown/unrecognized entry type from Codex logs
 * Used for debugging and handling unexpected entry formats
 *
 * Required fields:
 * - action: Action identifier
 * - timestamp: ISO 8601 timestamp
 * - test: Test data field
 */
export const UnknownSchema = z
  .object({
    action: z.string(),
    timestamp: z.string(),
    test: z.string(),
  })
  .strict()

export type Unknown = z.infer<typeof UnknownSchema>

// === UNION TYPE ===

/**
 * Union of all known JSONL entry types.
 * Use this when parsing entries of unknown type.
 *
 * Note: UnknownSchema is excluded from this union as it's only for debugging.
 * Unknown entries should be handled separately or will fail validation.
 */
export const AnyEntrySchema = z.union([UserSchema, AssistantSchema, SystemSchema, SummarySchema])

export type AnyEntry = z.infer<typeof AnyEntrySchema>

// === TYPE GUARDS ===

export const isUserEntry = (entry: AnyEntry): entry is User => entry.type === 'user'

export const isAssistantEntry = (entry: AnyEntry): entry is Assistant => entry.type === 'assistant'

export const isSystemEntry = (entry: AnyEntry): entry is System => entry.type === 'system'

export const isSummaryEntry = (entry: AnyEntry): entry is Summary => entry.type === 'summary'
