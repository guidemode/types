/**
 * Shared types used across all provider implementations
 */

export type {
  TextContent,
  ToolUseContent,
  ToolResultContent,
  ThinkingContent,
  ImageContent,
  SystemReminderContent,
  UnknownContent,
  ContentBlock,
  MessageContent,
  StructuredMessageContent,
} from './content-blocks.js'

export {
  isTextContent,
  isToolUseContent,
  isToolResultContent,
  isThinkingContent,
  isImageContent,
  isSystemReminderContent,
  isStructuredMessageContent,
  extractContentBlocks,
  getTextFromContent,
  hasToolUses,
  hasToolResults,
} from './content-blocks.js'
