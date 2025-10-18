/**
 * Auto-generated Zod schemas for OpenCode JSONL entries
 *
 * Generated: 2025-10-16T03:22:32.267Z
 * Source: provider-docs/opencode/opencode-jsonl.json
 * Entry types: user
 * Total files processed: 51
 */

import { z } from 'zod'

// === USER ENTRIES ===

/**
 * User message entry from OpenCode session logs
 *
 * Required fields:
 * - type: Always 'user'
 * - sessionId: Session identifier
 * - timestamp: ISO 8601 timestamp
 * - cwd: Current working directory
 * - message: User message object with role and content
 */
export const UserSchema = z
  .object({
    // === Core Required Fields ===
    type: z.literal('user'),
    sessionId: z.string(),
    timestamp: z.string().datetime(),
    cwd: z.string(),
    message: z.object({
      role: z.literal('user'),
      content: z.array(
        z.object({
          type: z.string(),
          text: z.string().optional(),
        })
      ),
    }),
  })
  .strict()

export type User = z.infer<typeof UserSchema>

// === UNION TYPE ===

/**
 * Union of all known JSONL entry types.
 * Use this when parsing entries of unknown type.
 *
 * Note: Currently only contains UserSchema as OpenCode only exports user entries.
 */
export const AnyEntrySchema = UserSchema

export type AnyEntry = z.infer<typeof AnyEntrySchema>

// === TYPE GUARDS ===

export const isUserEntry = (entry: AnyEntry): entry is User => entry.type === 'user'
