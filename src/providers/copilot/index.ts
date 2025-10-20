/**
 * GitHub Copilot provider types and schemas
 */

export {
  TimelineEntryTypeSchema,
  ToolCallResultSchema,
  TimelineEntrySchema,
  CopilotSessionSchema,
  isTimelineEntry,
  isUserEntry,
  isCopilotEntry,
  isToolCallEntry,
  isToolResultEntry,
  isInfoEntry,
  pairToolCallWithResult,
} from './entries.js'

export type {
  TimelineEntryType,
  ToolCallResult,
  TimelineEntry,
  CopilotSession,
  CopilotMetadata,
} from './entries.js'
