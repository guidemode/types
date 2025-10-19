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

export interface CreateTenantRequest {
  name: string
}

export interface DeleteTenantRequest {
  slug: string
  confirm: string
}

export interface CreateTenantResponse {
  logout?: boolean
}

export interface DeleteTenantResponse {
  logout?: boolean
}

export interface GitHubManageInfo {
  manageUrl: string
  installationId: number
  accountLogin: string
}

export interface GitHubAppNameResponse {
  appName: string
}

export interface DeleteUserRequest {
  email: string
  confirm: string
}

export interface DeleteUserResponse {
  logout: boolean
}

// Queue message types
export interface SessionProcessingMessage {
  sessionId: string
  tenantId: string
  userId: string
  provider: string
  forceReprocess?: boolean
  specificProcessor?: string
  enableAIModels?: boolean
  aiModelAdapter?: string
}

/**
 * Message for billing quantity updates
 */
export interface BillingUpdateMessage {
  type: 'user_activated' | 'user_deactivated'
  tenantId: string
  userId: string
  username: string
  timestamp: string
}
