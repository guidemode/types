/**
 * Pull request types for work tracking
 * Provider-agnostic PR tracking for DORA metrics
 */

import type { Provider } from './repositories.js'

/**
 * Pull request state
 */
export type PullRequestState = 'open' | 'closed' | 'merged' | 'draft'

/**
 * Review state
 */
export type ReviewState = 'pending' | 'commented' | 'approved' | 'changes_requested' | 'dismissed'

/**
 * Pull request record from database
 */
export interface PullRequest {
  id: string
  tenantId: string
  repositoryId: string
  provider: Provider
  externalId: string
  number: number
  title: string
  body: string | null
  state: PullRequestState
  url: string
  apiUrl: string | null
  authorId: string | null
  authorExternalId: string | null
  authorUsername: string | null
  headBranch: string
  baseBranch: string
  headSha: string | null
  baseSha: string | null
  merged: 'true' | 'false'
  mergeable: string | null // 'true', 'false', 'unknown'
  mergeCommitSha: string | null
  mergedById: string | null
  mergedByExternalId: string | null
  mergedByUsername: string | null
  additions: number
  deletions: number
  changedFiles: number
  commits: number
  reviewerCount: number
  commentCount: number
  reviewCommentCount: number
  createdAt: Date
  updatedAt: Date
  closedAt: Date | null
  mergedAt: Date | null
  firstReviewAt: Date | null
  firstApprovalAt: Date | null
  isDraft: 'true' | 'false'
  metadata: Record<string, unknown> | null
  lastSyncedAt: Date
}

/**
 * Pull request insert type
 */
export interface PullRequestInsert {
  tenantId: string
  repositoryId: string
  provider: Provider
  externalId: string
  number: number
  title: string
  body?: string | null
  state: PullRequestState
  url: string
  apiUrl?: string | null
  authorId?: string | null
  authorExternalId?: string | null
  authorUsername?: string | null
  headBranch: string
  baseBranch: string
  headSha?: string | null
  baseSha?: string | null
  merged?: 'true' | 'false'
  mergeable?: string | null
  mergeCommitSha?: string | null
  mergedById?: string | null
  mergedByExternalId?: string | null
  mergedByUsername?: string | null
  additions?: number
  deletions?: number
  changedFiles?: number
  commits?: number
  reviewerCount?: number
  commentCount?: number
  reviewCommentCount?: number
  createdAt: Date
  updatedAt: Date
  closedAt?: Date | null
  mergedAt?: Date | null
  firstReviewAt?: Date | null
  firstApprovalAt?: Date | null
  isDraft?: 'true' | 'false'
  metadata?: Record<string, unknown> | null
}

/**
 * Pull request update type
 */
export interface PullRequestUpdate {
  title?: string
  body?: string | null
  state?: PullRequestState
  headSha?: string | null
  baseSha?: string | null
  merged?: 'true' | 'false'
  mergeable?: string | null
  mergeCommitSha?: string | null
  mergedById?: string | null
  mergedByExternalId?: string | null
  mergedByUsername?: string | null
  additions?: number
  deletions?: number
  changedFiles?: number
  commits?: number
  reviewerCount?: number
  commentCount?: number
  reviewCommentCount?: number
  updatedAt?: Date
  closedAt?: Date | null
  mergedAt?: Date | null
  firstReviewAt?: Date | null
  firstApprovalAt?: Date | null
  isDraft?: 'true' | 'false'
  metadata?: Record<string, unknown> | null
  lastSyncedAt?: Date
}

/**
 * Pull request API response
 */
export interface PullRequestResponse {
  id: string
  tenantId: string
  repositoryId: string
  provider: Provider
  externalId: string
  number: number
  title: string
  body: string | null
  state: PullRequestState
  url: string
  apiUrl: string | null
  author: {
    id: string | null
    externalId: string | null
    username: string | null
  }
  mergedBy: {
    id: string | null
    externalId: string | null
    username: string | null
  } | null
  headBranch: string
  baseBranch: string
  headSha: string | null
  baseSha: string | null
  merged: boolean
  mergeable: boolean | null
  mergeCommitSha: string | null
  additions: number
  deletions: number
  changedFiles: number
  commits: number
  reviewerCount: number
  commentCount: number
  reviewCommentCount: number
  labels: PullRequestLabel[]
  reviews: PullRequestReview[]
  linkedIssues: string[] // Issue IDs
  linkedSessions: string[] // Session IDs
  createdAt: string
  updatedAt: string
  closedAt: string | null
  mergedAt: string | null
  firstReviewAt: string | null
  firstApprovalAt: string | null
  isDraft: boolean
  cycleTimeMs: number | null // Calculated: mergedAt - createdAt
  reviewTimeMs: number | null // Calculated: firstReviewAt - createdAt
  metadata: Record<string, unknown> | null
  lastSyncedAt: string
}

/**
 * Pull request label
 */
export interface PullRequestLabel {
  id: string
  pullRequestId: string
  name: string
  color: string | null
  description: string | null
  externalId: string | null
  createdAt: Date
}

/**
 * Pull request label insert type
 */
export interface PullRequestLabelInsert {
  pullRequestId: string
  name: string
  color?: string | null
  description?: string | null
  externalId?: string | null
}

/**
 * Pull request review
 */
export interface PullRequestReview {
  id: string
  pullRequestId: string
  externalId: string
  reviewerId: string | null
  reviewerExternalId: string | null
  reviewerUsername: string | null
  state: ReviewState
  body: string | null
  submittedAt: Date
  createdAt: Date
}

/**
 * Pull request review insert type
 */
export interface PullRequestReviewInsert {
  pullRequestId: string
  externalId: string
  reviewerId?: string | null
  reviewerExternalId?: string | null
  reviewerUsername?: string | null
  state: ReviewState
  body?: string | null
  submittedAt: Date
}

/**
 * Issue-PR link type
 */
export type IssuePRLinkType = 'fixes' | 'closes' | 'resolves' | 'references'

/**
 * Issue to pull request link
 */
export interface IssuePullRequestLink {
  id: string
  issueId: string
  pullRequestId: string
  linkType: IssuePRLinkType
  createdAt: Date
}

/**
 * Issue-PR link insert type
 */
export interface IssuePullRequestLinkInsert {
  issueId: string
  pullRequestId: string
  linkType?: IssuePRLinkType
}

/**
 * Pull request filters
 */
export interface PullRequestFilters {
  tenantId?: string
  repositoryId?: string
  provider?: Provider
  state?: PullRequestState
  authorId?: string
  merged?: boolean
  isDraft?: boolean
  baseBranch?: string
  headBranch?: string
  createdAfter?: Date
  createdBefore?: Date
  mergedAfter?: Date
  mergedBefore?: Date
  labels?: string[]
  search?: string
}

/**
 * Pull request analytics metrics
 */
export interface PullRequestMetrics {
  totalCount: number
  openCount: number
  mergedCount: number
  closedCount: number
  draftCount: number
  averageCycleTimeMs: number | null
  medianCycleTimeMs: number | null
  averageReviewTimeMs: number | null
  medianReviewTimeMs: number | null
  averageAdditions: number | null
  averageDeletions: number | null
  averageChangedFiles: number | null
  averageCommits: number | null
}
