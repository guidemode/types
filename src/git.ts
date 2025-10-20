/**
 * Git diff and repository types
 * Used for tracking code changes across sessions
 */

/**
 * Git statistics for additions/deletions
 */
export interface GitStats {
  additions: number
  deletions: number
  changes?: number
}

/**
 * Git file diff information
 */
export interface GitFileDiff {
  path: string
  stats: GitStats
  status?: 'added' | 'modified' | 'deleted' | 'renamed'
  oldPath?: string // For renamed files
}

/**
 * Complete git diff structure
 */
export interface GitDiff {
  files: GitFileDiff[]
  totalStats: GitStats
  commit?: string
  branch?: string
  isUnstaged?: boolean // True if diff represents uncommitted changes
}

/**
 * Git commit information
 */
export interface GitCommit {
  hash: string
  message: string
  author: string
  email: string
  timestamp: string
  stats?: GitStats
}

/**
 * Git repository information
 */
export interface GitRepository {
  remoteUrl?: string
  branch: string
  cwd: string
  latestCommit?: GitCommit
}
