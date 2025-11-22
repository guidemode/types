/**
 * Deployment types for work tracking
 * Provider-agnostic deployment tracking for DORA metrics
 */

import type { Provider } from './repositories.js'

/**
 * Deployment environment
 */
export type DeploymentEnvironment =
  | 'production'
  | 'staging'
  | 'development'
  | 'qa'
  | 'preview'
  | 'other'

/**
 * Deployment status
 */
export type DeploymentStatus =
  | 'pending'
  | 'queued'
  | 'in_progress'
  | 'success'
  | 'failure'
  | 'error'
  | 'inactive'

/**
 * Deployment record from database
 */
export interface Deployment {
  id: string
  tenantId: string
  repositoryId: string
  provider: Provider
  externalId: string
  ref: string // Branch, tag, or SHA
  sha: string // Commit SHA
  environment: DeploymentEnvironment
  task: string // deploy, deploy:migrations, etc.
  description: string | null
  url: string | null
  apiUrl: string | null
  creatorId: string | null
  creatorExternalId: string | null
  creatorUsername: string | null
  currentStatus: DeploymentStatus
  currentStatusUpdatedAt: Date | null
  isProduction: 'true' | 'false'
  isTransient: 'true' | 'false'
  metadata: Record<string, unknown> | null
  createdAt: Date
  updatedAt: Date
  lastSyncedAt: Date
}

/**
 * Deployment insert type
 */
export interface DeploymentInsert {
  tenantId: string
  repositoryId: string
  provider: Provider
  externalId: string
  ref: string
  sha: string
  environment: DeploymentEnvironment
  task?: string
  description?: string | null
  url?: string | null
  apiUrl?: string | null
  creatorId?: string | null
  creatorExternalId?: string | null
  creatorUsername?: string | null
  currentStatus?: DeploymentStatus
  currentStatusUpdatedAt?: Date | null
  isProduction?: 'true' | 'false'
  isTransient?: 'true' | 'false'
  metadata?: Record<string, unknown> | null
  createdAt: Date
  updatedAt: Date
}

/**
 * Deployment update type
 */
export interface DeploymentUpdate {
  currentStatus?: DeploymentStatus
  currentStatusUpdatedAt?: Date
  updatedAt?: Date
  lastSyncedAt?: Date
  metadata?: Record<string, unknown> | null
}

/**
 * Deployment status record
 */
export interface DeploymentStatusRecord {
  id: string
  deploymentId: string
  externalId: string | null
  status: DeploymentStatus
  description: string | null
  targetUrl: string | null
  logUrl: string | null
  creatorId: string | null
  creatorExternalId: string | null
  creatorUsername: string | null
  createdAt: Date
}

/**
 * Deployment status insert type
 */
export interface DeploymentStatusInsert {
  deploymentId: string
  externalId?: string | null
  status: DeploymentStatus
  description?: string | null
  targetUrl?: string | null
  logUrl?: string | null
  creatorId?: string | null
  creatorExternalId?: string | null
  creatorUsername?: string | null
  createdAt: Date
}

/**
 * Deployment API response
 */
export interface DeploymentResponse {
  id: string
  tenantId: string
  repositoryId: string
  provider: Provider
  externalId: string
  ref: string
  sha: string
  environment: DeploymentEnvironment
  task: string
  description: string | null
  url: string | null
  apiUrl: string | null
  creator: {
    id: string | null
    externalId: string | null
    username: string | null
  } | null
  currentStatus: DeploymentStatus
  currentStatusUpdatedAt: string | null
  isProduction: boolean
  isTransient: boolean
  statuses: DeploymentStatusResponse[]
  linkedPullRequests: string[] // PR IDs
  metadata: Record<string, unknown> | null
  createdAt: string
  updatedAt: string
  lastSyncedAt: string
}

/**
 * Deployment status API response
 */
export interface DeploymentStatusResponse {
  id: string
  deploymentId: string
  externalId: string | null
  status: DeploymentStatus
  description: string | null
  targetUrl: string | null
  logUrl: string | null
  creator: {
    id: string | null
    externalId: string | null
    username: string | null
  } | null
  createdAt: string
}

/**
 * Pull request to deployment link
 */
export interface PullRequestDeploymentLink {
  id: string
  pullRequestId: string
  deploymentId: string
  linkMethod: string // sha_match, manual, webhook
  createdAt: Date
}

/**
 * PR-deployment link insert type
 */
export interface PullRequestDeploymentLinkInsert {
  pullRequestId: string
  deploymentId: string
  linkMethod?: string
}

/**
 * Deployment filters
 */
export interface DeploymentFilters {
  tenantId?: string
  repositoryId?: string
  provider?: Provider
  environment?: DeploymentEnvironment
  currentStatus?: DeploymentStatus
  isProduction?: boolean
  createdAfter?: Date
  createdBefore?: Date
  sha?: string
  ref?: string
}

/**
 * Deployment analytics metrics (DORA metrics)
 */
export interface DeploymentMetrics {
  // Deployment Frequency
  totalCount: number
  productionCount: number
  deploymentsPerDay: number | null
  deploymentsPerWeek: number | null

  // Change Failure Rate
  successCount: number
  failureCount: number
  changeFailureRate: number | null // Percentage

  // Mean Time to Recovery (MTTR)
  averageMTTRMs: number | null
  medianMTTRMs: number | null

  // Lead Time for Changes (requires PR linking)
  averageLeadTimeMs: number | null // From PR merged to deployed
  medianLeadTimeMs: number | null

  // Status breakdown
  byStatus: Record<DeploymentStatus, number>
  byEnvironment: Record<DeploymentEnvironment, number>
}
