// Auth context types
export interface User {
  id: string
  githubId: number | null
  username: string
  email: string
  name: string
  avatarUrl: string | null
  isGlobalAdmin?: boolean
  firstSessionUploadedAt?: Date | null
}

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
  plan?: 'individual' | 'team' | 'enterprise'
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