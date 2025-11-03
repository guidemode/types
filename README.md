# @guideai-dev/types

> **Shared TypeScript types for the GuideAI ecosystem.**

Type definitions used across all GuideAI packages for type safety and consistency.

## Installation

```bash
npm install @guideai-dev/types
```

## Usage

```typescript
import type { AgentSession, SessionMetrics } from '@guideai-dev/types'

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
git clone https://github.com/guideai-dev/types.git
cd types
pnpm install
pnpm build
```

**See [CLAUDE.md](CLAUDE.md) for:**
- Complete type catalog
- Semantic organization structure
- How to add new types

## Related Packages

- [@guideai-dev/desktop](https://github.com/guideai-dev/desktop) - Desktop app
- [@guideai-dev/session-processing](https://github.com/guideai-dev/session-processing) - Analytics engine
- [@guideai-dev/cli](https://github.com/guideai-dev/cli) - CLI tool

## License

MIT License - see [LICENSE](LICENSE)

## Support

- 💬 [**Discussions**](https://github.com/orgs/guideai-dev/discussions) - Ask questions, share ideas
- 🐛 [**Issues**](https://github.com/guideai-dev/desktop/issues) - Report bugs, request features
- 📧 **Email**: support@guideai.dev
