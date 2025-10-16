/**
 * Auto-generated Zod schemas for Claude Code JSONL entries
 *
 * Generated: 2025-10-16T02:21:00.564Z
 * Source: claude-jsonl.json
 * Entry types: user, assistant, system, summary, unknown
 * Total files processed: 936
 * Total unique types: 67
 */

import { z } from 'zod';

// === USER ENTRIES ===

/**
 * User message entry from Claude Code session logs
 *
 * Required fields:
 * - type: Always 'user'
 * - uuid: Unique entry identifier
 * - sessionId: Session identifier
 * - timestamp: ISO 8601 timestamp
 * - parentUuid: Parent entry UUID (null for root entries)
 * - isSidechain: Whether this is a sidechain entry
 * - userType: User type (e.g., 'external')
 * - version: Claude Code version
 * - cwd: Current working directory
 * - gitBranch: Current git branch
 * - message: The user's message content
 *
 * Optional fields:
 * - isMeta: Present when this is a system metadata message
 * - isCompactSummary: Present when this is a compacted conversation summary
 * - isVisibleInTranscriptOnly: Present when entry is only visible in transcript
 * - logicalParentUuid: Logical parent UUID for conversation flow tracking
 * - thinkingMetadata: Present when extended thinking is configured
 * - toolUseResult: Present when this entry contains tool execution results
 * - requestId: API request identifier
 */
export const UserSchema = z.object({
  // === Core Required Fields ===
  type: z.literal('user'),
  uuid: z.string(),
  sessionId: z.string(),
  timestamp: z.string(),
  parentUuid: z.string().nullable(),
  isSidechain: z.boolean(),
  userType: z.string(),
  version: z.string(),
  cwd: z.string(),
  gitBranch: z.string(),

  // === Message Content ===
  message: z.object({
    role: z.literal('user'),
    content: z.union([
      z.string(),
      z.array(z.object({
        type: z.string(),
        tool_use_id: z.string().optional(),
        content: z.string().optional(),
        // Allow additional fields for different content block types
      }).passthrough())
    ])
  }),

  // === Optional Fields ===
  isMeta: z.boolean().optional(),
  isCompactSummary: z.boolean().optional(),
  isVisibleInTranscriptOnly: z.boolean().optional(),
  logicalParentUuid: z.string().optional(),
  requestId: z.string().optional(),

  // === Optional Metadata ===
  thinkingMetadata: z.object({
    level: z.string(),
    disabled: z.boolean(),
    triggers: z.array(z.string()),
  }).optional(),

  toolUseResult: z.object({
    type: z.string(),
    file: z.object({
      filePath: z.string(),
      content: z.string(),
      numLines: z.number(),
      startLine: z.number(),
      totalLines: z.number(),
    }).optional(),
    // Allow additional fields for different result types
  }).passthrough().optional(),
}).strict();

export type User = z.infer<typeof UserSchema>;

// === ASSISTANT ENTRIES ===

/**
 * Assistant message entry from Claude Code session logs
 *
 * Required fields:
 * - type: Always 'assistant'
 * - uuid: Unique entry identifier
 * - sessionId: Session identifier
 * - timestamp: ISO 8601 timestamp
 * - parentUuid: Parent entry UUID (nullable)
 * - isSidechain: Whether this is a sidechain entry
 * - userType: User type (e.g., 'external')
 * - version: Claude Code version
 * - cwd: Current working directory
 * - gitBranch: Current git branch
 * - message: The assistant's response message
 *
 * Optional fields:
 * - isApiErrorMessage: Present when this is an API error message
 * - requestId: API request identifier
 */
export const AssistantSchema = z.object({
  // === Core Required Fields ===
  type: z.literal('assistant'),
  uuid: z.string(),
  sessionId: z.string(),
  timestamp: z.string(),
  parentUuid: z.string().nullable(),
  isSidechain: z.boolean(),
  userType: z.string(),
  version: z.string(),
  cwd: z.string(),
  gitBranch: z.string(),

  // === Message Content ===
  message: z.object({
    id: z.string(),
    type: z.literal('message'),
    role: z.literal('assistant'),
    model: z.string(),
    content: z.array(z.object({
      type: z.string(),
      text: z.string().optional(),
      id: z.string().optional(),
      name: z.string().optional(),
      input: z.unknown().optional(),
      // Allow additional fields for different content block types
    }).passthrough()),
    stop_reason: z.string().nullable(),
    stop_sequence: z.string().nullable(),
    usage: z.object({
      input_tokens: z.number(),
      output_tokens: z.number(),
      cache_creation_input_tokens: z.number(),
      cache_read_input_tokens: z.number(),
      service_tier: z.string().nullable(),
      // Optional nested cache_creation object
      cache_creation: z.object({
        ephemeral_1h_input_tokens: z.number(),
        ephemeral_5m_input_tokens: z.number(),
      }).optional(),
      // Optional server_tool_use object
      server_tool_use: z.object({
        web_search_requests: z.number(),
      }).optional(),
    }),
    // Optional container field
    container: z.string().nullable().optional(),
  }),

  // === Optional Fields ===
  isApiErrorMessage: z.boolean().optional(),
  requestId: z.string().optional(),
}).strict();

export type Assistant = z.infer<typeof AssistantSchema>;

// === SYSTEM ENTRIES ===

/**
 * System message entry from Claude Code session logs
 *
 * Required fields:
 * - type: Always 'system'
 * - uuid: Unique entry identifier
 * - sessionId: Session identifier
 * - timestamp: ISO 8601 timestamp
 * - parentUuid: Parent entry UUID (null for root entries)
 * - isSidechain: Whether this is a sidechain entry
 * - userType: User type (e.g., 'external')
 * - version: Claude Code version
 * - cwd: Current working directory
 * - gitBranch: Current git branch
 * - subtype: System message subtype (e.g., 'compact_boundary', 'informational', 'local_command')
 * - content: System message content
 * - level: Log level (e.g., 'info', 'warning', 'error')
 * - isMeta: Whether this is a metadata message
 *
 * Optional fields:
 * - logicalParentUuid: Logical parent UUID for conversation flow tracking
 * - compactMetadata: Metadata about conversation compaction
 * - toolUseID: Associated tool use identifier
 */
export const SystemSchema = z.object({
  // === Core Required Fields ===
  type: z.literal('system'),
  uuid: z.string(),
  sessionId: z.string(),
  timestamp: z.string(),
  parentUuid: z.string().nullable(),
  isSidechain: z.boolean(),
  userType: z.string(),
  version: z.string(),
  cwd: z.string(),
  gitBranch: z.string(),
  subtype: z.string(),
  content: z.string(),
  level: z.string(),
  isMeta: z.boolean(),

  // === Optional Fields ===
  logicalParentUuid: z.string().optional(),
  toolUseID: z.string().optional(),

  // === Optional Metadata ===
  compactMetadata: z.object({
    trigger: z.string(),
    preTokens: z.number(),
  }).optional(),
}).strict();

export type System = z.infer<typeof SystemSchema>;

// === SUMMARY ENTRIES ===

/**
 * Summary entry from Claude Code session logs
 *
 * Required fields:
 * - type: Always 'summary'
 * - summary: Text summary of the session
 * - leafUuid: UUID of the leaf entry being summarized
 */
export const SummarySchema = z.object({
  type: z.literal('summary'),
  summary: z.string(),
  leafUuid: z.string(),
}).strict();

export type Summary = z.infer<typeof SummarySchema>;

// === UNKNOWN ENTRIES ===

/**
 * Unknown entry type from Claude Code session logs
 * Used for debugging or experimental entries that don't match known types
 */
export const UnknownSchema = z.object({
  action: z.string(),
  test: z.string(),
  timestamp: z.string(),
}).strict();

export type Unknown = z.infer<typeof UnknownSchema>;

// === UNION TYPE ===

/**
 * Union of all known JSONL entry types.
 * Use this when parsing entries of unknown type.
 *
 * Note: UnknownSchema is excluded from this union as it's only for debugging.
 * If you need to handle unknown entries, use a try/catch with AnyEntrySchema.safeParse().
 */
export const AnyEntrySchema = z.union([
  UserSchema,
  AssistantSchema,
  SystemSchema,
  SummarySchema,
]);

export type AnyEntry = z.infer<typeof AnyEntrySchema>;

// === TYPE GUARDS ===

/**
 * Type guard to check if an entry is a User entry
 */
export const isUserEntry = (entry: AnyEntry): entry is User =>
  entry.type === 'user';

/**
 * Type guard to check if an entry is an Assistant entry
 */
export const isAssistantEntry = (entry: AnyEntry): entry is Assistant =>
  entry.type === 'assistant';

/**
 * Type guard to check if an entry is a System entry
 */
export const isSystemEntry = (entry: AnyEntry): entry is System =>
  entry.type === 'system';

/**
 * Type guard to check if an entry is a Summary entry
 */
export const isSummaryEntry = (entry: AnyEntry): entry is Summary =>
  entry.type === 'summary';

// === UTILITY FUNCTIONS ===

/**
 * Parse a JSONL line into a typed entry
 * @throws ZodError if the entry doesn't match any known schema
 */
export function parseEntry(jsonLine: string): AnyEntry {
  const parsed = JSON.parse(jsonLine);
  return AnyEntrySchema.parse(parsed);
}

/**
 * Safely parse a JSONL line, returning null if parsing fails
 */
export function safeParseEntry(jsonLine: string): AnyEntry | null {
  try {
    const parsed = JSON.parse(jsonLine);
    const result = AnyEntrySchema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
