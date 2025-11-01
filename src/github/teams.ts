// GitHub Teams and team management types

/**
 * GitHub team entity - synced from GitHub
 */
export interface Team {
  id: string
  tenantId: string
  githubOrgId: number
  githubOrgLogin: string
  githubOrgName: string
  githubTeamId: number
  name: string
  slug: string
  description?: string
  avatarUrl?: string
  parentTeamId?: string
  privacy: 'secret' | 'closed'
  githubCreatedAt: string
  createdAt: string
  updatedAt: string
  lastSyncedAt: string
}

/**
 * Team member assignment - links users to GitHub teams
 */
export interface TeamMemberAssignment {
  teamId: string
  userId: string
  role: 'member' | 'maintainer'
  createdAt: string
}
