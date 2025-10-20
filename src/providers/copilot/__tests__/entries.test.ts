import { describe, it, expect } from 'vitest'
import {
	TimelineEntrySchema,
	isTimelineEntry,
	isUserEntry,
	isToolCallEntry,
	isToolResultEntry,
	pairToolCallWithResult,
	type TimelineEntry,
} from '../entries.js'

describe('Copilot Entries', () => {
	it('should validate a user entry', () => {
		const entry = {
			type: 'user',
			text: 'Read the config file',
			timestamp: '2025-10-19T12:00:00Z',
		}

		const result = TimelineEntrySchema.safeParse(entry)
		expect(result.success).toBe(true)
		expect(isTimelineEntry(entry)).toBe(true)
		expect(isUserEntry(entry as TimelineEntry)).toBe(true)
	})

	it('should validate a copilot response entry', () => {
		const entry = {
			type: 'copilot',
			text: 'I will read the file for you',
			timestamp: '2025-10-19T12:00:00Z',
		}

		const result = TimelineEntrySchema.safeParse(entry)
		expect(result.success).toBe(true)
	})

	it('should validate a tool call entry', () => {
		const entry = {
			type: 'tool_call_requested',
			callId: 'call_123',
			name: 'read',
			toolTitle: 'Read File',
			intentionSummary: 'Reading configuration',
			arguments: { path: '/config.json' },
		}

		const result = TimelineEntrySchema.safeParse(entry)
		expect(result.success).toBe(true)
		expect(isToolCallEntry(entry as TimelineEntry)).toBe(true)
	})

	it('should validate a tool result entry', () => {
		const entry = {
			type: 'tool_call_completed',
			callId: 'call_123',
			result: {
				type: 'success',
				log: 'File read successfully',
			},
		}

		const result = TimelineEntrySchema.safeParse(entry)
		expect(result.success).toBe(true)
		expect(isToolResultEntry(entry as TimelineEntry)).toBe(true)
	})

	it('should validate an info entry', () => {
		const entry = {
			type: 'info',
			text: 'Processing...',
			timestamp: '2025-10-19T12:00:00Z',
		}

		const result = TimelineEntrySchema.safeParse(entry)
		expect(result.success).toBe(true)
	})

	it('should pair tool calls with results', () => {
		const entries: TimelineEntry[] = [
			{
				type: 'tool_call_requested',
				callId: 'call_1',
				name: 'read',
			},
			{
				type: 'tool_call_completed',
				callId: 'call_1',
				result: { type: 'success', log: 'File read' },
			},
			{
				type: 'tool_call_requested',
				callId: 'call_2',
				name: 'write',
			},
		]

		const pairs = pairToolCallWithResult(entries)
		expect(pairs).toHaveLength(2)
		expect(pairs[0].call.callId).toBe('call_1')
		expect(pairs[0].result?.callId).toBe('call_1')
		expect(pairs[1].call.callId).toBe('call_2')
		expect(pairs[1].result).toBeUndefined()
	})

	it('should handle empty entries array', () => {
		const pairs = pairToolCallWithResult([])
		expect(pairs).toHaveLength(0)
	})

	it('should handle orphaned tool results', () => {
		const entries: TimelineEntry[] = [
			{
				type: 'tool_call_completed',
				callId: 'call_orphan',
				result: { type: 'success' },
			},
		]

		const pairs = pairToolCallWithResult(entries)
		expect(pairs).toHaveLength(0) // No calls to pair with
	})
})
