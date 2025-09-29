// Auth context types
export interface User {
  id: string
  githubId: number
  username: string
  email: string
  name: string
  avatarUrl: string | null
}

export interface AuthContext {
  tenantId: string
  permissions: string[]
  apiKey?: string
  userId?: string
  user?: User
}

export interface SessionContext {
  tenantId: string
  userId?: string
  permissions: string[]
  user?: User
}