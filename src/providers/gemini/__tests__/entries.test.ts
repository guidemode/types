import { describe, it, expect } from 'vitest'
import {
	GeminiMessageSchema,
	isGeminiMessage,
	calculateCacheHitRate,
	calculateThinkingOverhead,
} from '../entries.js'

describe('Gemini Entries', () => {
	it('should validate a valid Gemini message with thoughts and tokens', () => {
		const message = {
			uuid: 'test-uuid',
			timestamp: '2025-10-19T12:00:00Z',
			type: 'assistant',
			message: {
				role: 'assistant',
				content: 'Hello world',
			},
			sessionId: 'test-session',
			thoughts: [
				{
					subject: 'Planning',
					description: 'Analyzing the request',
					timestamp: '2025-10-19T12:00:00Z',
				},
			],
			tokens: {
				input: 100,
				output: 50,
				cached: 20,
				thoughts: 10,
				total: 180,
			},
			model: 'gemini-1.5-pro',
		}

		const result = GeminiMessageSchema.safeParse(message)
		expect(result.success).toBe(true)
		expect(isGeminiMessage(message)).toBe(true)
	})

	it('should validate a message without optional fields', () => {
		const message = {
			uuid: 'test-uuid',
			timestamp: '2025-10-19T12:00:00Z',
			type: 'user',
			message: {
				role: 'user',
				content: 'Hello',
			},
			sessionId: 'test-session',
		}

		const result = GeminiMessageSchema.safeParse(message)
		expect(result.success).toBe(true)
	})

	it('should reject invalid message missing required fields', () => {
		const invalid = {
			// Missing required fields
			type: 'user',
		}

		const result = GeminiMessageSchema.safeParse(invalid)
		expect(result.success).toBe(false)
	})

	it('should calculate cache hit rate correctly', () => {
		const tokens = {
			input: 100,
			output: 50,
			cached: 20,
			total: 170,
		}

		const hitRate = calculateCacheHitRate(tokens)
		expect(hitRate).toBeCloseTo(11.76, 2) // 20/170 * 100
	})

	it('should return 0 for cache hit rate when no cached tokens', () => {
		const tokens = {
			input: 100,
			output: 50,
			total: 150,
		}

		const hitRate = calculateCacheHitRate(tokens)
		expect(hitRate).toBe(0)
	})

	it('should calculate thinking overhead correctly', () => {
		const tokens = {
			input: 100,
			output: 50,
			thoughts: 10,
			total: 160,
		}

		const overhead = calculateThinkingOverhead(tokens)
		expect(overhead).toBe(0.2) // 10/50
	})

	it('should return 0 for thinking overhead when no thinking tokens', () => {
		const tokens = {
			input: 100,
			output: 50,
			total: 150,
		}

		const overhead = calculateThinkingOverhead(tokens)
		expect(overhead).toBe(0)
	})
})
