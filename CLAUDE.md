# Types - Shared TypeScript Definitions

Centralized TypeScript type definitions shared across all GuideAI packages, providing type safety for API contracts, database schemas, and UI components.

## Architecture

### Stack
- **TypeScript**: Type definitions and compilation
- **Dual Build**: ESM and CommonJS distributions
- **Vitest**: Testing framework for type validation

### Structure

```
src/
├── index.ts             # Main exports
├── providers/           # Provider-specific Zod schemas (NEW)
│   ├── index.ts         # Provider namespace exports
│   └── claude/          # Claude Code JSONL schemas
│       ├── index.ts     # Claude provider exports
│       └── entries.ts   # Generated Zod schemas
├── api/                 # API request/response types
├── database/            # Database schema types
├── auth/                # Authentication types
└── ui/                  # UI component types
```

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
import { Providers } from '@guideai-dev/types';
import { AnyEntrySchema, isUserEntry } from '@guideai-dev/types/providers/claude';

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
} from '@guideai/types'

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
} from '@guideai/types'

async function whoAmI(): Promise<UserResponse> {
  // Type-safe API consumption
}
```

### In UI Package
```typescript
import type {
  UserResponse,
  ValidationResult
} from '@guideai/types'

function UserProfile({ user }: { user: UserResponse }) {
  // Type-safe component props
}
```

## Development Workflow

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

This package ensures type safety and consistency across the entire GuideAI ecosystem while maintaining flexibility for future growth.