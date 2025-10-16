/**
 * Provider-specific type schemas
 *
 * Each provider (Claude Code, Cursor, Windsurf, etc.) has its own
 * JSONL entry format. This module provides Zod schemas and TypeScript
 * types for runtime validation and type safety.
 *
 * @example
 * ```typescript
 * import { Claude } from '@guideai-dev/types/providers';
 *
 * // Parse JSONL entry
 * const entry = Claude.AnyEntrySchema.parse(jsonData);
 *
 * // Type-safe access
 * if (Claude.isUserEntry(entry)) {
 *   console.log(entry.message.content);
 * }
 * ```
 */

// Export provider namespaces as they are added
export * as Claude from './claude';
export * as Codex from './codex';
export * as OpenCode from './opencode';
// export * as Cursor from './cursor';
// export * as Windsurf from './windsurf';
