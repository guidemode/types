// Actions that can be performed
export type Actions =
	| 'read' // View/list resources
	| 'manage' // Create, update, delete resources
	| 'access' // Feature-based access (future)

// Resources/subjects in the system
export type Subjects =
	| 'all' // Special: all resources
	// Tenant management (includes tenant-level administrative resources)
	| 'Tenant' // Tenant settings
	| 'TenantMember' // Tenant members
	| 'ApiKey' // API keys
	| 'GitHubApp' // GitHub app integrations
	// Session data
	| 'Session' // AI sessions
	| 'Analytics' // Analytics data
	// Teams
	| 'Team' // Teams
	| 'Project' // Projects

// CASL Ability type placeholder (actual type defined in server with @casl/ability)
export type AppAbility = any

// Context passed to ability builder
export interface PermissionContext {
	user: {
		id: string
		isGlobalAdmin?: boolean
	}
	tenant?: {
		id: string
	}
	tenantUser?: {
		role: 'owner' | 'admin' | 'member'
		tenantId: string
		userId: string
	}
}
