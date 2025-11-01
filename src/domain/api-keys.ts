// API key types for programmatic access

/**
 * API key entity - represents a programmatic access token
 */
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

/**
 * Create API key request
 */
export interface CreateApiKeyRequest {
  name: string
  permissions?: string
  expiresAt?: string
}

/**
 * Create API key response - includes the plaintext key (only shown once)
 */
export interface CreateApiKeyResponse {
  key: ApiKey
  plainTextKey: string
}

/**
 * Revoke API key request
 */
export interface RevokeApiKeyRequest {
  keyId: string
}

/**
 * Auth session response - returned on authentication
 */
export interface AuthSessionResponse {
  authenticated: boolean
  user?: import('./users.js').User
}

/**
 * Hello world response - test endpoint
 */
export interface HelloWorldResponse {
  message: string
  user: string
  tenant: string
}
