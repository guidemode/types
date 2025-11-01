// GitHub webhook payload types

/**
 * Common webhook types used across different webhook payloads
 */

export interface GitHubWebhookUser {
  login: string
  id: number
  avatar_url: string
  name?: string
  email?: string
}

export interface GitHubWebhookRepository {
  id: number
  name: string
  full_name: string
  private: boolean
  archived?: boolean
  owner: {
    login: string
    id: number
  }
  html_url?: string
}

export interface GitHubWebhookOrganization {
  login: string
  id: number
  name?: string
  avatar_url?: string
}

export interface GitHubWebhookInstallation {
  id: number
}

export interface GitHubWebhookSender {
  login: string
  id: number
}

export interface GitHubWebhookTeam {
  id: number
  name: string
  slug: string
  description?: string
  privacy: 'secret' | 'closed'
  parent?: {
    id: number
    name: string
    slug: string
  }
}

/**
 * GitHub Pull Request Webhook Payload
 */
export interface GitHubPRWebhookPayload {
  action:
    | 'opened'
    | 'synchronize'
    | 'reopened'
    | 'closed'
    | 'edited'
    | 'assigned'
    | 'unassigned'
    | 'labeled'
    | 'unlabeled'
  number: number
  pull_request: {
    id: number
    number: number
    state: 'open' | 'closed'
    title: string
    body?: string
    html_url: string
    created_at: string
    updated_at: string
    merged: boolean
    merged_at?: string
    head: {
      ref: string // branch name
      sha: string // commit SHA
      repo?: {
        id: number
        full_name: string
      }
    }
    base: {
      ref: string // branch name
      sha: string // commit SHA
      repo: {
        id: number
        full_name: string
      }
    }
    user: {
      login: string
      id: number
      avatar_url: string
    }
    commits: number
  }
  repository: GitHubWebhookRepository
  installation: GitHubWebhookInstallation
  sender: GitHubWebhookSender
}

/**
 * GitHub Member Webhook (repository collaborator events)
 */
export interface GitHubMemberWebhookPayload {
  action: 'added' | 'removed' | 'edited'
  member: GitHubWebhookUser
  repository: GitHubWebhookRepository
  organization?: GitHubWebhookOrganization
  installation: GitHubWebhookInstallation
  sender: GitHubWebhookSender
}

/**
 * GitHub Membership Webhook (team membership events)
 */
export interface GitHubMembershipWebhookPayload {
  action: 'added' | 'removed'
  scope: 'team' | 'organization'
  member: GitHubWebhookUser
  team: GitHubWebhookTeam
  organization: GitHubWebhookOrganization
  installation: GitHubWebhookInstallation
  sender: GitHubWebhookSender
}

/**
 * GitHub Team Webhook (team lifecycle events)
 */
export interface GitHubTeamWebhookPayload {
  action: 'created' | 'deleted' | 'edited' | 'added_to_repository' | 'removed_from_repository'
  team: GitHubWebhookTeam
  repository?: GitHubWebhookRepository // only present for added_to_repository and removed_from_repository
  organization: GitHubWebhookOrganization
  installation: GitHubWebhookInstallation
  sender: GitHubWebhookSender
  changes?: {
    name?: { from: string }
    description?: { from: string }
    privacy?: { from: 'secret' | 'closed' }
    repository?: {
      permissions?: {
        from: {
          admin?: boolean
          pull?: boolean
          push?: boolean
        }
      }
    }
  }
}

/**
 * GitHub Repository Webhook (repository lifecycle events)
 */
export interface GitHubRepositoryWebhookPayload {
  action:
    | 'created'
    | 'deleted'
    | 'archived'
    | 'unarchived'
    | 'edited'
    | 'renamed'
    | 'transferred'
    | 'publicized'
    | 'privatized'
  repository: GitHubWebhookRepository
  organization?: GitHubWebhookOrganization
  installation: GitHubWebhookInstallation
  sender: GitHubWebhookSender
  changes?: {
    repository?: {
      name?: { from: string }
      owner?: {
        from: {
          login: string
          id: number
        }
      }
    }
  }
}
