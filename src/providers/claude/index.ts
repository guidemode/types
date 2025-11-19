/**
 * Claude Code provider type exports
 *
 * Zod schemas and TypeScript types for Claude Code JSONL session entries.
 *
 * @example
 * ```typescript
 * import { UserSchema, AnyEntrySchema, isUserEntry } from '@guidemode/types/providers/claude';
 *
 * // Parse and validate an entry
 * const entry = AnyEntrySchema.parse(jsonData);
 *
 * // Type-safe access
 * if (isUserEntry(entry)) {
 *   console.log(entry.message.content);
 * }
 * ```
 */

export * from './entries.js'
