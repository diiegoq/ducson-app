# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project Overview

**Curious Bob** is a hackathon MVP web application that analyzes GitHub repositories using AI to generate actionable engineering tickets. Built with Next.js, it helps teams understand legacy codebases and identify technical debt.

### Core Functionality
1. Accept public GitHub repository URLs
2. Analyze repository structure and identify logical modules
3. Generate actionable tickets with team assignments
4. Export results to CSV

### Tech Stack
- **Framework**: Next.js 14+ (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **APIs**: GitHub REST API (Octokit), OpenAI GPT-4 Turbo
- **Deployment**: Vercel

## Project Status

**Current Phase**: Planning Complete - Ready for Implementation

This is a hackathon project with a **1-day implementation timeline**. The codebase prioritizes:
- Speed over perfection
- Core functionality over polish
- Working demo over comprehensive features

## Architecture

### File Structure
```
app/
├── layout.tsx              # Root layout with navigation
├── page.tsx                # Landing page + repo input
├── results/page.tsx        # Results display with tickets
└── api/
    ├── overview/route.ts   # Phase 1: Module detection
    └── module/route.ts     # Phase 2: Ticket generation
lib/
├── github.ts               # GitHub API client
├── llm.ts                  # OpenAI integration
└── types.ts                # TypeScript definitions
plans/                      # Detailed planning documents
```

### Data Flow
1. User submits GitHub URL → `POST /api/overview`
2. Fetch repo tree + config files → Filter files → Send to LLM
3. LLM returns modules → Display module cards
4. User selects module → `POST /api/module`
5. Fetch file contents → Send to LLM with team roster
6. LLM returns tickets → Display + CSV export

## Key Constraints

### API Limits
- **GitHub API**: 60 req/hour (anonymous), 5000 req/hour (authenticated)
- **OpenAI API**: ~$0.30 per module analysis
- **Vercel Functions**: 60 second timeout

### Simplifications for Hackathon
- No authentication/database
- No caching
- Limited to 20 files per module
- Basic error handling
- Single analysis mode
- Default team roster only

## Development Guidelines

### When Adding Features
1. **Check the roadmap** ([`plans/05-implementation-roadmap.md`](plans/05-implementation-roadmap.md)) for time budget
2. **Prioritize core flow**: URL → Modules → Tickets → Export
3. **Use existing patterns**: Follow structure in planning docs
4. **Keep it simple**: Avoid over-engineering for hackathon scope

### Code Patterns

**API Routes**: Use try-catch with JSON error responses
```typescript
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const result = await processData(data);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

**LLM Calls**: Always use JSON mode and parse responses
```typescript
const response = await openai.chat.completions.create({
  model: 'gpt-4-turbo-preview',
  messages: [{ role: 'user', content: prompt }],
  response_format: { type: 'json_object' },
  temperature: 0.3
});
return JSON.parse(response.choices[0].message.content);
```

**GitHub API**: Handle rate limits and missing files gracefully
```typescript
try {
  const { data } = await octokit.repos.getContent({ owner, repo, path });
  return 'content' in data ? Buffer.from(data.content, 'base64').toString() : null;
} catch {
  return null; // File doesn't exist or rate limited
}
```

### Testing Strategy

For hackathon MVP, focus on:
1. **Manual testing** with real repositories (Next.js, React)
2. **Error scenarios**: Invalid URLs, rate limits, timeouts
3. **End-to-end flow**: URL input → Module selection → Ticket display → CSV export
4. **Demo preparation**: Have backup screenshots/video

### Common Issues & Solutions

**Issue**: GitHub rate limit exceeded
**Solution**: Add optional token input, cache tree responses

**Issue**: OpenAI timeout on large modules
**Solution**: Limit to 20 files, truncate file contents

**Issue**: Invalid JSON from LLM
**Solution**: Retry with stricter prompt, validate with Zod

**Issue**: Module detection too granular/broad
**Solution**: Adjust prompt to target 3-5 modules

## Environment Variables

Required in `.env.local`:
```env
OPENAI_API_KEY=sk-...           # Required
GITHUB_TOKEN=ghp_...            # Optional (increases rate limit)
```

## Planning Documents

Detailed specifications are in the [`plans/`](plans/) directory:

1. **[Technical Architecture](plans/01-technical-architecture.md)**: System design, tech stack decisions, file structure
2. **[API Specifications](plans/02-api-specifications.md)**: Endpoint contracts, data schemas, error handling
3. **[Frontend Design](plans/03-frontend-design.md)**: Component hierarchy, user flows, UI patterns
4. **[LLM Prompt Strategy](plans/04-llm-prompt-strategy.md)**: Prompt templates, token optimization, quality assurance
5. **[Implementation Roadmap](plans/05-implementation-roadmap.md)**: 1-day hackathon timeline with hourly breakdown

## Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

## Demo Script

For hackathon presentation (3-5 minutes):

1. **Problem** (30s): Legacy codebases lack documentation and ownership
2. **Solution** (30s): AI analyzes repos and generates tickets
3. **Demo** (2-3min):
   - Paste `https://github.com/vercel/next.js`
   - Show detected modules
   - Select "Authentication Module"
   - Show generated tickets with assignments
   - Export to CSV
4. **Impact** (30s): Faster onboarding, clear ownership, actionable tasks

## Post-Hackathon Roadmap

If continuing development:
- Add authentication & user accounts
- Implement caching for repeated analyses
- Support multiple analysis modes (security, performance, etc.)
- Custom team rosters
- Integration with Jira/GitHub Issues
- Private repository support
- Comprehensive testing

## Notes for AI Assistants

- **Prioritize speed**: This is a hackathon project - working > perfect
- **Follow the plan**: Detailed specs are in [`plans/`](plans/) directory
- **Stay focused**: Core flow is URL → Modules → Tickets → Export
- **Use examples**: Planning docs include code examples and patterns
- **Time-box features**: Refer to hourly breakdown in roadmap
- **Document limitations**: Known issues are acceptable for MVP

## Contact & Resources

- **Planning Docs**: [`plans/`](plans/) directory
- **Original Idea**: [`idea.md`](idea.md)
- **README**: [`README.md`](README.md)