// User and authentication types
export interface User {
  id: string
  githubId: number
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
  role: 'owner' | 'admin' | 'member'
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

// Settings types
export interface TenantSettings {
  id: string
  tenantId: string
  tenantName: string
  autoCleanupEnabled: boolean
  autoCleanupDays: number
  dataRetentionDays: number
  notificationsEnabled: boolean
  updatedAt: Date
  updatedBy: string
}

export interface TenantSettingsUpdate {
  tenantName?: string
  autoCleanupEnabled?: boolean
  autoCleanupDays?: number
  dataRetentionDays?: number
  notificationsEnabled?: boolean
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
  role: 'owner' | 'admin' | 'member'
  joinedAt: string
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
  role: 'admin' | 'member'
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