// Tenant and tenant settings types

/**
 * Tenant entity - represents an organization in GuideMode
 */
export interface Tenant {
  id: string
  name: string
  slug: string
  createdAt: string
  updatedAt: string
}

/**
 * Tenant settings - configuration for tenant-specific features
 */
export interface TenantSettings {
  id: string
  tenantId: string
  tenantName: string
  autoCleanupEnabled: boolean
  autoCleanupDays: number
  dataRetentionDays: number
  notificationsEnabled: boolean
  surveyMinimumIntervalDays: number
  surveyMaxActivePerUser: number
  timezone: string // IANA timezone (e.g., "America/New_York", "UTC")
  updatedAt: Date
  updatedBy: string
}

/**
 * Tenant settings update request
 */
export interface TenantSettingsUpdate {
  tenantName?: string
  autoCleanupEnabled?: boolean
  autoCleanupDays?: number
  dataRetentionDays?: number
  notificationsEnabled?: boolean
  surveyMinimumIntervalDays?: number
  surveyMaxActivePerUser?: number
  timezone?: string
}

/**
 * Create tenant request
 */
export interface CreateTenantRequest {
  name: string
  timezone?: string // Optional timezone from browser detection
}

/**
 * Delete tenant request
 */
export interface DeleteTenantRequest {
  slug: string
  confirm: string
}

/**
 * Create tenant response
 */
export interface CreateTenantResponse {
  logout?: boolean
}

/**
 * Delete tenant response
 */
export interface DeleteTenantResponse {
  logout?: boolean
}
