// GitHub synchronization and linking types

/**
 * GitHub sync log - tracks GitHub organization sync operations
 */
export interface GitHubSyncLog {
  id: string
  tenantId: string
  githubOrgId: number
  githubOrgLogin: string
  githubOrgName: string
  syncType: 'full' | 'members' | 'teams'
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  startedAt: string
  completedAt?: string
  stats?: {
    usersCreated: number
    usersUpdated: number
    teamsCreated: number
    teamsUpdated: number
    membershipsCreated: number
  }
  errorMessage?: string
}

/**
 * Pull request session link - links sessions to GitHub PRs
 */
export interface PRSessionLink {
  id: string
  tenantId: string
  sessionId: string
  prUrl: string
  prNumber: number
  repoFullName: string
  repoId: number
  prTitle?: string
  prHeadBranch?: string
  prBaseBranch?: string
  prHeadSha?: string
  prState?: string
  commentPosted: boolean
  commentUrl?: string
  linkedAt: string
  updatedAt: string
}
