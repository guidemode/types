# @guideai-dev/types

Shared TypeScript type definitions for the GuideAI ecosystem.

## Installation

```bash
npm install @guideai-dev/types
# or
pnpm add @guideai-dev/types
# or
yarn add @guideai-dev/types
```

## Usage

```typescript
import type {
  AgentSession,
  SessionMetrics,
  UserProfile,
  APIResponse
} from '@guideai-dev/types'

// Use types in your application
const session: AgentSession = {
  sessionId: 'session-123',
  provider: 'claude-code',
  startTime: new Date(),
  // ...
}
```

## Features

- **Dual Module Support**: Both ESM and CommonJS distributions
- **Full Type Safety**: Strict TypeScript compilation
- **API Contracts**: Request/response types for all endpoints
- **Database Schema**: Types matching database models
- **UI Components**: Shared component prop types

## Type Categories

### API Types
Request and response shapes for all API endpoints:
- User management
- Session operations
- Metrics and analytics
- Authentication

### Database Schema Types
TypeScript interfaces matching database tables:
- Users and tenants
- Agent sessions
- Session metrics
- OAuth data

### Authentication Types
OAuth and session management:
- Session tokens
- GitHub OAuth data
- User permissions

### UI Component Types
Shared component interfaces:
- Button variants
- Form validation
- Modal props
- Chart data

## Development

This package is part of the GuideAI monorepo and is automatically synced to this repository.

### Building

```bash
# Build both ESM and CJS
pnpm build

# Build ESM only
pnpm build:esm

# Build CJS only
pnpm build:cjs

# Development (watch mode)
pnpm dev

# Type checking
pnpm typecheck
```

### Contributing

We welcome contributions! Please:

1. Fork this repository
2. Create a feature branch
3. Add or update type definitions
4. Submit a pull request

**Note**: All pull requests are reviewed and manually backported to the private GuideAI monorepo.

## Package Exports

```json
{
  ".": {
    "types": "./dist/esm/index.d.ts",
    "import": "./dist/esm/index.js",
    "require": "./dist/cjs/index.js"
  }
}
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Links

- [GuideAI Website](https://guideai.dev)
- [Documentation](https://docs.guideai.dev)
- [GitHub Organization](https://github.com/guideai-dev)
- [npm Package](https://github.com/guideai-dev/types/pkgs/npm/types)

## Related Packages

- [@guideai-dev/desktop](https://github.com/guideai-dev/desktop) - Desktop menubar application
- [@guideai-dev/session-processing](https://github.com/guideai-dev/session-processing) - Session processing and AI models
- [@guideai-dev/cli](https://github.com/guideai-dev/cli) - Command-line interface
