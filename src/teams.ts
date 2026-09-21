// Canonical teams, and the provider identities bound to them.

/**
 * Which provider an identity belongs to.
 *
 * `atlassian` rather than `jira`: an Atlassian Team ID is issued by the Atlassian
 * organisation and names the same Team on every site under it. `import` is the
 * organisation register declaring a Team exists, with no provider behind it.
 */
export type TeamBindingProvider = 'github' | 'atlassian' | 'linear' | 'notion' | 'import'

/** Observed by a sync, declared by an import, or made by a person in the UI. */
export type TeamBindingSource = 'sync' | 'import' | 'manual'

/**
 * One provider's name for a canonical Team.
 *
 * A Team used to BE a provider's team, so this interface's fields were columns on
 * `Team` and the same squad with a GitHub team and a Linear team was two Teams. They
 * are a collection now, because there is no singular provider that identifies a Team.
 */
export interface TeamProviderBinding {
  id: string
  provider: TeamBindingProvider
  /** Where the id is unique — a GitHub org, a Linear workspace, a Notion database. */
  providerScopeId: string | null
  externalId: string
  /** The provider's short human key: a GitHub team slug, a Linear team key. */
  externalKey: string | null
  displayName: string
  source: TeamBindingSource
  lastSyncedAt: string | null
}

/** A canonical team. Provider-neutral: everything external lives in `bindings`. */
export interface Team {
  id: string
  tenantId: string
  name: string
  /** Unique within the tenant: the Team's one stable human key. */
  slug: string
  description?: string | null
  avatarUrl?: string | null
  iconEmoji?: string | null
  parentTeamId?: string | null
  groupName?: string | null
  privacy?: 'secret' | 'closed' | null
  externalRef?: string | null
  bindings: TeamProviderBinding[]
  githubCreatedAt?: string | null
  createdAt: string
  updatedAt: string
  lastSyncedAt?: string | null
}

/** Where a membership came from. A membership holds a SET of these. */
export type TeamMemberSource = 'github' | 'jira' | 'linear' | 'notion' | 'import' | 'manual'

/**
 * Team member assignment - links users to teams.
 *
 * `sources` is a set, not one value: the same person can be in a team because GitHub
 * lists them there AND because an import declared it, and removing one of those does
 * not remove the membership.
 */
export interface TeamMemberAssignment {
  teamId: string
  userId: string
  role: 'member' | 'maintainer'
  sources: TeamMemberSource[]
  createdAt: string
}
