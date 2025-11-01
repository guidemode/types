import type { BaseMetrics } from './types.js'

/**
 * Git diff metrics - desktop-only, all providers
 * Tracks code changes made during a session
 */
export interface GitDiffMetrics extends BaseMetrics {
  git_total_files_changed: number
  git_lines_added: number
  git_lines_removed: number
  git_lines_modified: number
  git_net_lines_changed: number
  git_lines_read_per_line_changed?: number
  git_reads_per_file_changed?: number
  git_lines_changed_per_minute?: number
  git_lines_changed_per_tool_use?: number
  total_lines_read?: number
  metadata?: {
    calculation_type: 'unstaged' | 'committed'
    first_commit?: string
    latest_commit?: string
    improvement_tips: string[]
  }
}
