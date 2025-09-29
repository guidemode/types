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