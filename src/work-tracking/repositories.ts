/**
 * Repository types for work tracking
 * Provider-agnostic repository tracking across GitHub, GitLab, Bitbucket, etc.
 */

export type Provider = 'github' | 'gitlab' | 'bitbucket' | string

/**
 * Repository record from database
 */
export interface Repository {
  id: string
  tenantId: string
  provider: Provider
  externalId: string
  name: string
  fullName: string
  owner: string
  url: string
  apiUrl: string | null
  defaultBranch: string | null
  isPrivate: 'true' | 'false'
  syncIssues: 'true' | 'false'
  syncPullRequests: 'true' | 'false'
  syncDeployments: 'true' | 'false'
  lastSyncedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

/**
 * Repository insert type (for creating new repositories)
 */
export interface RepositoryInsert {
  tenantId: string
  provider: Provider
  externalId: string
  name: string
  fullName: string
  owner: string
  url: string
  apiUrl?: string | null
  defaultBranch?: string | null
  isPrivate?: 'true' | 'false'
  syncIssues?: 'true' | 'false'
  syncPullRequests?: 'true' | 'false'
  syncDeployments?: 'true' | 'false'
}

/**
 * Repository update type
 */
export interface RepositoryUpdate {
  name?: string
  fullName?: string
  owner?: string
  url?: string
  apiUrl?: string | null
  defaultBranch?: string | null
  isPrivate?: 'true' | 'false'
  syncIssues?: 'true' | 'false'
  syncPullRequests?: 'true' | 'false'
  syncDeployments?: 'true' | 'false'
  lastSyncedAt?: Date
  updatedAt?: Date
}

/**
 * Repository API response
 */
export interface RepositoryResponse {
  id: string
  tenantId: string
  provider: Provider
  externalId: string
  name: string
  fullName: string
  owner: string
  url: string
  apiUrl: string | null
  defaultBranch: string | null
  isPrivate: boolean
  syncIssues: boolean
  syncPullRequests: boolean
  syncDeployments: boolean
  lastSyncedAt: string | null
  createdAt: string
  updatedAt: string
}

/**
 * Repository list filters
 */
export interface RepositoryFilters {
  tenantId?: string
  provider?: Provider
  syncIssues?: boolean
  syncPullRequests?: boolean
  syncDeployments?: boolean
  search?: string // Search by name or fullName
}

/**
 * Repository sync request
 */
export interface RepositorySyncRequest {
  syncIssues?: boolean
  syncPullRequests?: boolean
  syncDeployments?: boolean
}
