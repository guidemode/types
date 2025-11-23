import type { User } from './domain/users.js'

// Auth context types

// Re-export User for backward compatibility
export type { User }

export interface AuthContext {
  tenantId: string
  permissions: string[]
  apiKey?: string
  userId?: string
  user?: User
}

export interface SubscriptionInfo {
  status: 'active' | 'canceled' | 'paused' | 'trialing' | 'past_due'
  isActive: boolean // true if status === 'active' || status === 'trialing'
  plan?: 'individual' | 'smallTeam' | 'largeTeam' | 'enterprise'
  paddleCustomerId?: string
  paddleSubscriptionId?: string
  billingCycle?: string
}

export interface SessionContext {
  tenantId: string
  userId?: string
  permissions: string[]
  user?: User
  subscription?: SubscriptionInfo
}
