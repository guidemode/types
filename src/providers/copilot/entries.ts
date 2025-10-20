/**
 * GitHub Copilot provider type definitions
 * Copilot uses a timeline-based event structure
 */

import { z } from 'zod'

/**
 * Copilot timeline entry types
 */
export const TimelineEntryTypeSchema = z.enum([
  'user', // User input message
  'copilot', // Assistant response
  'tool_call_requested', // Tool invocation
  'tool_call_completed', // Tool result
  'info', // Informational message
])

export type TimelineEntryType = z.infer<typeof TimelineEntryTypeSchema>

/**
 * Tool call result
 */
export const ToolCallResultSchema = z.object({
  type: z.string(), // 'success', 'error', etc.
  log: z.string().optional(),
})

export type ToolCallResult = z.infer<typeof ToolCallResultSchema>

/**
 * Timeline entry (all types)
 */
export const TimelineEntrySchema = z.object({
  // Common fields
  id: z.string().optional(),
  timestamp: z.string().optional(),
  type: TimelineEntryTypeSchema,

  // User message fields
  text: z.string().optional(),
  mentions: z.array(z.unknown()).optional(),
  expandedText: z.string().optional(),
  imageAttachments: z.array(z.unknown()).optional(),

  // Tool call fields
  callId: z.string().optional(),
  name: z.string().optional(),
  toolTitle: z.string().optional(), // Human-readable tool name
  intentionSummary: z.string().optional(), // What the tool does
  arguments: z.unknown().optional(),

  // Tool result fields
  result: ToolCallResultSchema.optional(),
})

export type TimelineEntry = z.infer<typeof TimelineEntrySchema>

/**
 * Copilot session structure
 * Each JSONL line is a timeline entry
 */
export const CopilotSessionSchema = z.object({
  timeline: z.array(TimelineEntrySchema),
})

export type CopilotSession = z.infer<typeof CopilotSessionSchema>

/**
 * Copilot metadata extension for ParsedMessage
 */
export interface CopilotMetadata {
  // User message metadata
  mentions?: unknown[]
  expandedText?: string
  hasImageAttachments: boolean

  // Tool call metadata
  toolTitle?: string
  intentionSummary?: string
  callId?: string

  // Tool result metadata
  resultType?: string
  isSuccess: boolean
}

/**
 * Type guards
 */
export function isTimelineEntry(entry: unknown): entry is TimelineEntry {
  const result = TimelineEntrySchema.safeParse(entry)
  return result.success
}

export function isUserEntry(entry: TimelineEntry): boolean {
  return entry.type === 'user'
}

export function isCopilotEntry(entry: TimelineEntry): boolean {
  return entry.type === 'copilot'
}

export function isToolCallEntry(entry: TimelineEntry): boolean {
  return entry.type === 'tool_call_requested'
}

export function isToolResultEntry(entry: TimelineEntry): boolean {
  return entry.type === 'tool_call_completed'
}

export function isInfoEntry(entry: TimelineEntry): boolean {
  return entry.type === 'info'
}

/**
 * Helper to pair tool calls with results
 */
export function pairToolCallWithResult(
  entries: TimelineEntry[]
): Array<{ call: TimelineEntry; result?: TimelineEntry }> {
  const pairs: Array<{ call: TimelineEntry; result?: TimelineEntry }> = []
  const resultsByCallId = new Map<string, TimelineEntry>()

  // Index results by callId
  for (const entry of entries) {
    if (isToolResultEntry(entry) && entry.callId) {
      resultsByCallId.set(entry.callId, entry)
    }
  }

  // Pair calls with results
  for (const entry of entries) {
    if (isToolCallEntry(entry) && entry.callId) {
      pairs.push({
        call: entry,
        result: resultsByCallId.get(entry.callId),
      })
    }
  }

  return pairs
}
