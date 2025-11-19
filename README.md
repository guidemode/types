# @guidemode/types

> **Shared TypeScript types for the GuideMode ecosystem.**

Type definitions used across all GuideMode packages for type safety and consistency.

## Installation

```bash
npm install @guidemode/types
```

## Usage

```typescript
import type { AgentSession, SessionMetrics } from '@guidemode/types'

const session: AgentSession = {
  sessionId: 'session-123',
  provider: 'claude-code',
  startTime: new Date(),
  // ...
}
```

## What's Included

- **Session Types** - AgentSession, ParsedMessage, SessionPhase
- **Metrics Types** - Performance, Usage, Quality, Engagement, Error metrics
- **API Types** - Request/response shapes for all endpoints
- **Database Types** - Schema types matching database models
- **Auth Types** - OAuth, sessions, permissions
- **Canonical Format Types** - Universal message format for all providers

## Key Features

- ✅ **Dual Module Support** - ESM and CommonJS
- ✅ **Full Type Safety** - Strict TypeScript compilation
- ✅ **Canonical Format** - Unified types for all AI providers
- ✅ **Runtime Validation** - Zod schemas for provider data

## For Developers

### Build from Source

```bash
git clone https://github.com/guidemode-dev/types.git
cd types
pnpm install
pnpm build
```

**See [CLAUDE.md](CLAUDE.md) for:**
- Complete type catalog
- Semantic organization structure
- How to add new types

## Related Packages

- [@guidemode/desktop](https://github.com/guidemode-dev/desktop) - Desktop app
- [@guidemode/session-processing](https://github.com/guidemode-dev/session-processing) - Analytics engine
- [@guidemode/cli](https://github.com/guidemode-dev/cli) - CLI tool

## License

MIT License - see [LICENSE](LICENSE)

## Support

- 💬 [**Discussions**](https://github.com/orgs/guidemode-dev/discussions) - Ask questions, share ideas
- 🐛 [**Issues**](https://github.com/guidemode-dev/desktop/issues) - Report bugs, request features
- 📧 **Email**: support@guidemode.dev
