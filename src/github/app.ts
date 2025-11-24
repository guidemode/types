// GitHub App integration types

/**
 * GitHub repository information
 */
export interface GitHubRepository {
  id: number
  name: string
  fullName: string
  private: boolean
}

/**
 * GitHub App installation entity
 */
export interface GitHubAppInstallation {
  id: string
  tenantId: string
  installationId: number
  accountType: 'user' | 'organization'
  accountLogin: string
  targetType: 'User' | 'Organization'
  permissions: Record<string, string>
  repositorySelection: 'all' | 'selected'
  selectedRepositories: GitHubRepository[]
  suspendedAt?: string
  installedAt: string
  updatedAt: string
}

/**
 * GitHub App installation update request
 */
export interface GitHubAppInstallationUpdate {
  repositorySelection?: 'all' | 'selected'
  selectedRepositories?: GitHubRepository[]
}

/**
 * GitHub App management info
 */
export interface GitHubManageInfo {
  manageUrl: string
  installationId: number
  accountLogin: string
}

/**
 * GitHub App name response
 */
export interface GitHubAppNameResponse {
  appName: string
}

/**
 * GitHub commit information
 */
export interface GitHubCommit {
  sha: string
  commit: {
    author: {
      name: string
      email: string
      date: string
    }
    committer: {
      name: string
      email: string
      date: string
    }
    message: string
  }
  author?: {
    login: string
    id: number
  }
  html_url: string
}

/**
 * GitHub user information
 */
export interface GitHubUser {
  login: string
  avatarUrl: string
  id: number
}

/**
 * GitHub organization with installation status
 */
export interface GitHubOrganization {
  login: string
  name: string
  avatarUrl: string
  role: 'admin' | 'member'
  hasAppInstalled: boolean
  installationId: number | null
}

/**
 * Response from /api/settings/github/user-organizations endpoint
 */
export interface GitHubUserOrganizationsResponse {
  connected: boolean
  githubUser?: GitHubUser
  personalAccount?: {
    login: string
    avatarUrl: string
    hasAppInstalled: boolean
    installationId: number | null
  }
  organizations?: GitHubOrganization[]
  error?: string
}
