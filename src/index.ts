// Re-export all types from sub-modules
export * from './auth'
export * from './session'
export * from './processor'
export * from './metrics'
export * from './settings'
export * from './permissions'
export * from './git'

// Shared content block types (used across all providers)
export type {
  ContentBlock,
  MessageContent,
  StructuredMessageContent,
  TextContent,
  ToolUseContent,
  ToolResultContent,
  ThinkingContent,
  ImageContent,
  SystemReminderContent,
  UnknownContent,
} from './providers/shared/index.js'

export {
  isTextContent,
  isToolUseContent,
  isToolResultContent,
  isThinkingContent,
  isImageContent,
  isSystemReminderContent,
  isStructuredMessageContent,
  extractContentBlocks,
  getTextFromContent,
  hasToolUses,
  hasToolResults,
} from './providers/shared/index.js'

// Provider-specific schemas (Zod)
export * as Providers from './providers'

// Gemini provider types
export type {
  GeminiMessage,
  Thought,
  TokenMetrics,
  GeminiMetadata,
} from './providers/gemini/index.js'
export {
  GeminiMessageSchema,
  isGeminiMessage,
  hasGeminiThoughts,
  hasGeminiTokens,
  calculateCacheHitRate,
  calculateThinkingOverhead,
} from './providers/gemini/index.js'

// GitHub Copilot provider types
export type {
  TimelineEntry,
  TimelineEntryType,
  ToolCallResult,
  CopilotSession,
  CopilotMetadata,
} from './providers/copilot/index.js'
export {
  TimelineEntrySchema,
  CopilotSessionSchema,
  isTimelineEntry,
  isUserEntry,
  isCopilotEntry,
  isToolCallEntry,
  isToolResultEntry,
  isInfoEntry,
  pairToolCallWithResult,
} from './providers/copilot/index.js'

// Domain model types
export interface User {
  id: string
  githubId: number | null
  username: string
  email: string
  name: string
  avatarUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface Tenant {
  id: string
  name: string
  slug: string
  createdAt: string
  updatedAt: string
}

export interface TenantUser {
  tenantId: string
  userId: string
  role: 'owner' | 'admin' | 'member' | 'support'
  joinedAt: string
}

export interface ApiKey {
  id: string
  tenantId: string
  name: string
  keyPrefix: string
  permissions: string
  expiresAt: string | null
  lastUsedAt: string | null
  isActive: boolean
  createdAt: string
  createdBy: string
  revokedAt: string | null
  revokedBy: string | null
}

// Team types
export interface TeamMember {
  id: string
  tenantId: string
  userId: string
  username: string
  name: string
  email: string
  avatarUrl?: string
  role: 'owner' | 'admin' | 'member' | 'support'
  joinedAt: string
  firstSessionUploadedAt?: Date | null
  status: 'active' | 'pending'
}

export interface InviteTeamMemberRequest {
  email: string
  role: 'admin' | 'member'
}

export interface TeamInvitation {
  id: string
  tenantId: string
  email: string
  role: 'admin' | 'member'
  invitedBy: string
  invitedAt: string
  expiresAt: string
  acceptedAt?: string
  status: 'pending' | 'accepted' | 'expired'
}

export interface UpdateTeamMemberRoleRequest {
  userId: string
  role: 'owner' | 'admin' | 'member' | 'support'
}

// GitHub Teams and Sync types
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

export interface TeamMemberAssignment {
  teamId: string
  userId: string
  role: 'member' | 'maintainer'
  createdAt: string
}

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

// GitHub integration types
export interface GitHubRepository {
  id: number
  name: string
  fullName: string
  private: boolean
}

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

export interface GitHubAppInstallationUpdate {
  repositorySelection?: 'all' | 'selected'
  selectedRepositories?: GitHubRepository[]
}

// GitHub Webhook Common Types
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

// GitHub Pull Request Webhook types
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

// GitHub Member Webhook (repository collaborator events)
export interface GitHubMemberWebhookPayload {
  action: 'added' | 'removed' | 'edited'
  member: GitHubWebhookUser
  repository: GitHubWebhookRepository
  organization?: GitHubWebhookOrganization
  installation: GitHubWebhookInstallation
  sender: GitHubWebhookSender
}

// GitHub Membership Webhook (team membership events)
export interface GitHubMembershipWebhookPayload {
  action: 'added' | 'removed'
  scope: 'team' | 'organization'
  member: GitHubWebhookUser
  team: GitHubWebhookTeam
  organization: GitHubWebhookOrganization
  installation: GitHubWebhookInstallation
  sender: GitHubWebhookSender
}

// GitHub Team Webhook (team lifecycle events)
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

// GitHub Repository Webhook (repository lifecycle events)
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

// API Key types
export interface CreateApiKeyRequest {
  name: string
  permissions?: string
  expiresAt?: string
}

export interface CreateApiKeyResponse {
  key: ApiKey
  plainTextKey: string
}

export interface RevokeApiKeyRequest {
  keyId: string
}

// API response types
export interface AuthSessionResponse {
  authenticated: boolean
  user?: User
}

export interface HelloWorldResponse {
  message: string
  user: string
  tenant: string
}
