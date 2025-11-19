# Types - Shared TypeScript Definitions

Centralized TypeScript type definitions shared across all GuideMode packages, providing type safety for API contracts, database schemas, and UI components.

## Architecture

### Stack
- **TypeScript**: Type definitions and compilation
- **Dual Build**: ESM and CommonJS distributions
- **Vitest**: Testing framework for type validation

### Structure

**Organized by semantic domain for clarity and maintainability:**

```
src/
├── index.ts             # Main re-exports (no type definitions)
│
├── domain/              # Core domain models
│   ├── users.ts         # User, TenantUser, TeamMember, invitations
│   ├── tenants.ts       # Tenant, TenantSettings, CRUD requests
│   └── api-keys.ts      # ApiKey, create/revoke operations
│
├── sessions/            # Session-related types
│   ├── core.ts          # AgentSession, SessionFile, ProcessingStatus, SessionPhase
│   ├── messages.ts      # ParsedMessage, ParsedSession, MessageType, ConversationTurn
│   ├── responses.ts     # SessionDetailResponse, SessionsResponse, SessionFilters
│   ├── upload.ts        # SessionUploadRequest, SessionMetricUpload
│   └── ai-analysis.ts   # IntentExtraction, QualityAssessment, SessionSummary
│
├── metrics/             # Metrics by type
│   ├── types.ts         # MetricType, BaseMetrics, SessionMetricsData
│   ├── performance.ts   # PerformanceMetrics
│   ├── usage.ts         # UsageMetrics
│   ├── quality.ts       # QualityMetrics
│   ├── engagement.ts    # EngagementMetrics
│   ├── errors.ts        # ErrorMetrics
│   ├── assessment.ts    # AssessmentMetrics, AssessmentSession
│   ├── context.ts       # ContextManagementMetrics (Claude Code)
│   ├── git-diff.ts      # GitDiffMetrics (desktop)
│   └── utilities.ts     # Helper functions (extractToolUses, etc.)
│
├── github/              # GitHub integration
│   ├── app.ts           # GitHubAppInstallation, GitHubRepository
│   ├── webhooks.ts      # Webhook payload types (PR, Team, Member, etc.)
│   ├── teams.ts         # Team, TeamMemberAssignment
│   └── sync.ts          # GitHubSyncLog, PRSessionLink
│
├── queue/               # Queue message types
│   └── messages.ts      # SessionProcessingMessage, BillingUpdateMessage
│
├── providers/           # Provider-specific Zod schemas
│   ├── index.ts         # Provider namespace exports
│   ├── shared/          # Shared content block types
│   ├── claude/          # Claude Code JSONL schemas
│   ├── codex/           # Codex schemas
│   ├── opencode/        # OpenCode schemas
│   ├── gemini/          # Gemini Code schemas
│   └── copilot/         # GitHub Copilot schemas
│
├── auth.ts              # Authentication context types
├── permissions.ts       # RBAC permission types
├── git.ts               # Git diff and repository types
├── processor.ts         # Session processor types
│
└── Legacy re-export files (for backward compatibility):
    ├── session.ts       # Re-exports from sessions/
    ├── metrics.ts       # Re-exports from metrics/
    └── settings.ts      # Re-exports from domain/ and github/
```

### Organization Principles

**Semantic Grouping:**
- Types are organized by **domain** rather than by technical concern
- Each directory represents a logical grouping of related functionality
- Clear file naming makes it easy to find the right types

**Benefits:**
- **Clarity**: Easy to locate types by their purpose (e.g., all session types in `sessions/`)
- **Maintainability**: Related types live together, reducing cognitive load
- **Scalability**: New types have clear homes based on their domain
- **Discoverability**: File structure mirrors the application architecture

**Backward Compatibility:**
- All existing imports continue to work via legacy re-export files
- No breaking changes for consuming packages
- Gradual migration path if needed

**Finding Types:**
- **Domain models** (User, Tenant, ApiKey) → `domain/`
- **Session data** (AgentSession, ParsedMessage) → `sessions/`
- **Metrics** (PerformanceMetrics, AssessmentMetrics) → `metrics/`
- **GitHub integration** (webhooks, teams, sync) → `github/`
- **Queue messages** → `queue/`
- **Authentication** → `auth.ts`
- **Permissions (RBAC)** → `permissions.ts`

## Build System

### Dual Module Support

**ESM Build** (`tsconfig.json`):
- **Target**: ES2022
- **Module**: ESNext
- **Output**: `dist/esm/`
- **Declaration**: Full type definitions

**CJS Build** (`tsconfig.cjs.json`):
- **Target**: ES2022
- **Module**: CommonJS
- **Output**: `dist/cjs/`
- **Package Marker**: Auto-generated CommonJS package.json

### Commands

```bash
# Build both distributions
pnpm build

# Build ESM only
pnpm build:esm

# Build CJS only
pnpm build:cjs

# Development (watch mode)
pnpm dev

# Clean build artifacts
pnpm clean

# Run type tests
pnpm test
```

## Package Configuration

### Exports

```json
{
  ".": {
    "types": "./dist/esm/index.d.ts",
    "import": "./dist/esm/index.js",
    "require": "./dist/cjs/index.js"
  },
  "./providers": {
    "types": "./dist/esm/providers/index.d.ts",
    "import": "./dist/esm/providers/index.js",
    "require": "./dist/cjs/providers/index.js"
  },
  "./providers/claude": {
    "types": "./dist/esm/providers/claude/index.d.ts",
    "import": "./dist/esm/providers/claude/index.js",
    "require": "./dist/cjs/providers/claude/index.js"
  }
}
```

### Files Distribution
- `dist/esm/` - ES Module build with type declarations
- `dist/cjs/` - CommonJS build with type declarations

## Type Categories

### Provider Schemas (Zod)

**Runtime validation for AI coding assistant JSONL session logs**

The `providers/` namespace contains auto-generated Zod schemas for different AI coding assistants (Claude Code, Cursor, Windsurf, etc.). These provide both runtime validation and compile-time type safety.

#### Claude Code Provider

```typescript
import { Providers } from '@guidemode/types';
import { AnyEntrySchema, isUserEntry } from '@guidemode/types/providers/claude';

// Parse JSONL entry with runtime validation
const entry = AnyEntrySchema.parse(JSON.parse(jsonLine));

// Type-safe access with type guards
if (isUserEntry(entry)) {
  // TypeScript knows entry is User type
  console.log(entry.message.content);
  console.log(entry.uuid);
}

// Namespace import
const entry2 = Providers.Claude.AnyEntrySchema.parse(jsonData);
```

**Available Schemas:**
- `UserSchema` - User message entries
- `AssistantSchema` - Assistant response entries
- `SystemSchema` - System/meta entries
- `SummarySchema` - Session summary entries
- `UnknownSchema` - Debug entries (not in union)
- `AnyEntrySchema` - Union of all known types

**Type Guards:**
- `isUserEntry(entry)` - Checks if entry is User type
- `isAssistantEntry(entry)` - Checks if entry is Assistant type
- `isSystemEntry(entry)` - Checks if entry is System type
- `isSummaryEntry(entry)` - Checks if entry is Summary type

**Utility Functions:**
- `parseEntry(jsonLine)` - Parse and validate (throws on error)
- `safeParseEntry(jsonLine)` - Parse safely (returns null on error)

**Schema Generation:**
See `provider-docs/SCHEMA_GENERATION.md` for how to generate schemas from JSONL files.

#### Canonical Format Types

**Universal message format for all AI providers.**

**Location:** `src/sessions/messages.ts`

The canonical format types define the universal JSONL structure that all providers convert to in the Rust desktop app. These types are used throughout the session processing pipeline.

**Core Types:**
```typescript
interface CanonicalMessage {
    uuid: string
    timestamp: string
    message_type: 'user' | 'assistant' | 'meta'
    session_id: string
    provider: string
    cwd?: string
    git_branch?: string
    version?: string
    message: MessageContent
    provider_metadata?: any
}

interface MessageContent {
    role: string
    content: string | ContentBlock[]
    model?: string
    usage?: TokenUsage
}

type ContentBlock =
    | TextBlock
    | ToolUseBlock
    | ToolResultBlock
    | ThinkingBlock
```

**Content Block Types:**
- `TextBlock` - `{ type: 'text', text: string }`
- `ToolUseBlock` - `{ type: 'tool_use', id, name, input }`
- `ToolResultBlock` - `{ type: 'tool_result', tool_use_id, content, is_error? }`
- `ThinkingBlock` - `{ type: 'thinking', thinking: string }`

**Benefits:**
- Single format for all providers (Claude, Gemini, Copilot, Codex, OpenCode)
- Provider-specific features preserved in `provider_metadata`
- Type-safe parsing and processing
- Enables unified session analytics

**Related:**
- Rust implementation: `apps/desktop/src-tauri/src/providers/canonical/mod.rs`
- Parser: `packages/session-processing/src/parsers/canonical/parser.ts`

### API Types
```typescript
// Request/response shapes
interface CreateUserRequest {
  email: string
  name: string
}

interface UserResponse {
  id: string
  email: string
  name: string
  createdAt: string
}

// API endpoint definitions
type APIEndpoints = {
  'POST /users': {
    request: CreateUserRequest
    response: UserResponse
  }
}
```

### Database Schema Types
```typescript
// Table definitions matching Drizzle schema
interface User {
  id: string
  email: string
  name: string
  createdAt: Date
  updatedAt: Date
}

// Insert/update types
type UserInsert = Omit<User, 'id' | 'createdAt' | 'updatedAt'>
type UserUpdate = Partial<UserInsert>
```

### Authentication Types
```typescript
// OAuth and session types
interface AuthSession {
  userId: string
  expiresAt: Date
}

interface GitHubOAuthData {
  accessToken: string
  refreshToken?: string
  scope: string[]
}
```

### UI Component Types
```typescript
// Shared component props
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger'
  size: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

// Form validation types
type ValidationResult<T> = {
  success: boolean
  data?: T
  errors?: Record<keyof T, string[]>
}
```

## Usage Patterns

### In Server Package
```typescript
import type {
  UserResponse,
  CreateUserRequest
} from '@guidemode/types'

app.post('/users', async (c) => {
  const body: CreateUserRequest = await c.req.json()
  // Type-safe request handling
  const user: UserResponse = await createUser(body)
  return c.json(user)
})
```

### In CLI Package
```typescript
import type {
  AuthSession,
  UserResponse
} from '@guidemode/types'

async function whoAmI(): Promise<UserResponse> {
  // Type-safe API consumption
}
```

### In UI Package
```typescript
import type {
  UserResponse,
  ValidationResult
} from '@guidemode/types'

function UserProfile({ user }: { user: UserResponse }) {
  // Type-safe component props
}
```

## Development Workflow

**IMPORTANT: Always run quality checks locally before committing changes.**

### Pre-Commit Checklist

Run these commands in the **types package directory** (`packages/types/`) before committing:

```bash
# 1. Building (REQUIRED - must succeed)
# Builds both ESM and CJS distributions
pnpm build

# 2. Testing (REQUIRED when tests exist)
# Runs type tests with Vitest
pnpm test

# Note: No separate typecheck script (TypeScript checks run during build)
# Note: No lint script yet - types package has minimal code to lint
```

### Quick Quality Check

Run all checks in sequence:

```bash
# From packages/types/
pnpm build && pnpm test
```

**If any check fails, your code MUST NOT be committed. Fix all errors before proceeding.**

### Code Quality Standards

- **Zero tolerance**: No build errors or test failures allowed in commits
- **Type safety**: All types must be well-defined and documented
- **Dual builds**: Both ESM and CJS must build successfully
- **Breaking changes**: Coordinate with consuming packages when making breaking changes

### From Workspace Root

To check the types package from the workspace root:

```bash
pnpm --filter @guidemode/types build
pnpm --filter @guidemode/types test
```

### Adding New Types

1. **Define**: Add type definitions in appropriate category
2. **Export**: Re-export from `src/index.ts`
3. **Build**: Run `pnpm build` to generate distributions
4. **Test**: Add type tests in test files
5. **Consume**: Import in other packages

### Type Testing

```typescript
// Example type test
import { describe, test, expectTypeOf } from 'vitest'
import type { UserResponse } from '../src'

describe('UserResponse', () => {
  test('should have required fields', () => {
    expectTypeOf<UserResponse>().toMatchTypeOf<{
      id: string
      email: string
      name: string
      createdAt: string
    }>()
  })
})
```

## Key Architectural Decisions

1. **Centralized Types**: Single source of truth for all type definitions
2. **Dual Distribution**: Supports both ESM and CJS consuming packages
3. **Category Organization**: Types grouped by domain (API, DB, Auth, UI)
4. **Strict Compilation**: Ensures type safety across workspace
5. **Version Synchronization**: Shared versioning with workspace packages
6. **Runtime Agnostic**: Pure type definitions without runtime dependencies

## Dependencies

### Development Only
- `typescript`: TypeScript compiler
- `vitest`: Type testing framework

### Runtime
- `zod`: Zod schema validation (for provider schemas only)

## Integration Points

- **Server**: API endpoint types, database schema types
- **CLI**: API consumption types, authentication types
- **UI**: Component props, form validation types
- **Database**: Schema definitions, query result types

## Versioning Strategy

- **Workspace Versioning**: Synchronized with main package version
- **Breaking Changes**: Coordinated updates across consuming packages
- **Type Evolution**: Additive changes preferred over breaking changes
- **Migration**: Clear migration paths for type updates

This package ensures type safety and consistency across the entire GuideMode ecosystem while maintaining flexibility for future growth.