# Curious Bob - LLM Prompt Engineering Strategy

## Overview

This document defines the prompt engineering approach for both analysis phases, including system prompts, few-shot examples, output formatting instructions, and token optimization strategies.

## LLM Configuration

### Model Selection
- **Primary**: GPT-4 Turbo (`gpt-4-turbo-preview`)
- **Context Window**: 128,000 tokens
- **Max Output**: 4,096 tokens
- **Temperature**: 0.3 (balanced creativity/consistency)
- **Top P**: 0.9

### Why GPT-4 Turbo?
- Superior code understanding
- Excellent structured output generation
- Reliable JSON formatting
- Strong reasoning for architectural analysis
- Good at following complex instructions

---

## Phase 1: Repository Overview Prompt

### System Prompt

```
You are an expert software architect and code analyst specializing in repository structure analysis. Your task is to analyze a codebase's file structure and key configuration files to identify logical modules and provide a high-level technical overview.

You will receive:
1. A filtered file tree showing the repository structure
2. Key configuration files (package.json, tsconfig.json, README.md, etc.)

Your analysis should:
- Identify the primary tech stack and frameworks
- Determine the architectural pattern (monolithic, microservices, serverless, etc.)
- Detect logical modules based on directory structure, naming patterns, and dependencies
- Provide a concise summary of what the application does

CRITICAL: You must respond with valid JSON matching the exact schema provided. Do not include markdown code blocks or any text outside the JSON structure.
```

### User Prompt Template

```typescript
const overviewPrompt = `
Analyze this repository structure and provide a comprehensive overview.

REPOSITORY INFORMATION:
- Owner: ${owner}
- Name: ${repo}
- Description: ${description || 'No description provided'}
- Primary Language: ${language || 'Unknown'}
- Stars: ${stars}

FILE TREE (${filteredFileCount} files):
${fileTreeString}

CONFIGURATION FILES:

${configFiles.map(file => `
--- ${file.path} ---
${file.content}
`).join('\n')}

Based on this information, identify logical modules in the codebase. A module can be:
- Directory-based: Pure folder grouping (e.g., /src/controllers)
- Service-based: Independent business components (e.g., payment service, emailer)
- Bounded-context: Domain-driven design domains (e.g., Billing, User Auth, Inventory)
- Dependency cluster: Files tightly bound together via intensive cross-imports
- Frontend/Backend split: Dividing client UI paths from server API paths
- Infrastructure: Infrastructure configurations (Dockerfiles, CI/CD, terraform)
- Feature slice: Vertical slices representing single self-contained features

Respond with JSON matching this exact schema:

{
  "techStack": ["Framework1", "Framework2", "Language"],
  "primaryLanguages": [
    {"language": "TypeScript", "percentage": 65},
    {"language": "JavaScript", "percentage": 30}
  ],
  "architecture": "Monolithic" | "Microservices" | "Serverless" | "Hybrid",
  "summary": "2-3 sentence description of what this application does",
  "modules": [
    {
      "id": "unique-module-id",
      "name": "Human Readable Module Name",
      "type": "service-based" | "directory-based" | "bounded-context" | "dependency-cluster" | "frontend-backend-split" | "infrastructure" | "feature-slice",
      "description": "What this module does and its responsibilities",
      "files": ["relative/path/to/file1.ts", "relative/path/to/file2.ts"],
      "fileCount": 12,
      "estimatedComplexity": "low" | "medium" | "high",
      "suggestedAnalysisModes": ["security-audit", "architecture-review"]
    }
  ]
}

Guidelines:
- Identify 3-8 modules (avoid over-segmentation)
- Each module should have 5-50 files
- Complexity based on: file count, dependencies, business logic depth
- Suggest relevant analysis modes based on module type
- Use kebab-case for module IDs
- Be specific in descriptions (avoid generic terms)
`;
```

### Few-Shot Example

```json
{
  "techStack": ["Next.js 14", "TypeScript", "PostgreSQL", "Prisma", "Tailwind CSS"],
  "primaryLanguages": [
    {"language": "TypeScript", "percentage": 75},
    {"language": "JavaScript", "percentage": 15},
    {"language": "CSS", "percentage": 10}
  ],
  "architecture": "Monolithic",
  "summary": "An e-commerce platform built with Next.js that handles product catalog management, user authentication, shopping cart functionality, and payment processing through Stripe integration.",
  "modules": [
    {
      "id": "authentication-module",
      "name": "Authentication & Authorization",
      "type": "service-based",
      "description": "Handles user registration, login, JWT token management, password reset, and role-based access control",
      "files": [
        "src/app/api/auth/login/route.ts",
        "src/app/api/auth/register/route.ts",
        "src/lib/auth/jwt.ts",
        "src/lib/auth/password.ts",
        "src/middleware/auth.ts"
      ],
      "fileCount": 8,
      "estimatedComplexity": "high",
      "suggestedAnalysisModes": ["security-audit", "architecture-review"]
    },
    {
      "id": "payment-processing",
      "name": "Payment Processing",
      "type": "service-based",
      "description": "Integrates with Stripe API for payment processing, handles webhooks, manages transaction records, and processes refunds",
      "files": [
        "src/app/api/payments/route.ts",
        "src/lib/stripe/client.ts",
        "src/lib/stripe/webhooks.ts"
      ],
      "fileCount": 6,
      "estimatedComplexity": "high",
      "suggestedAnalysisModes": ["security-audit", "scalability-audit", "dependency-risk"]
    }
  ]
}
```

### Token Optimization

**Input Reduction**:
- Filter file tree to remove noise (node_modules, .git, binaries)
- Limit config file content to first 500 lines
- Compress whitespace in file tree representation
- Use abbreviated paths where possible

**Estimated Token Usage**:
- System prompt: ~300 tokens
- User prompt template: ~200 tokens
- File tree (1000 files): ~8,000 tokens
- Config files (3 files): ~3,000 tokens
- **Total Input**: ~11,500 tokens
- **Expected Output**: ~2,000 tokens
- **Total**: ~13,500 tokens (~$0.14 per analysis)

---

## Phase 2: Module Analysis Prompt

### System Prompt

```
You are an expert software engineer specializing in code review, security analysis, and technical debt identification. Your task is to perform deep analysis on a specific module of a codebase based on selected analysis modes.

You will receive:
1. Raw source code files from the module
2. A list of team members with their roles
3. Selected analysis modes to focus on

Your analysis should:
- Generate actionable tickets with specific code locations
- Identify security vulnerabilities and risks
- Provide concrete suggestions for improvements
- Assign tickets to appropriate team members based on their roles
- Include code-level details (files, functions, imports, line numbers)

CRITICAL: You must respond with valid JSON matching the exact schema provided. Do not include markdown code blocks or any text outside the JSON structure.
```

### User Prompt Template

```typescript
const moduleAnalysisPrompt = `
Perform a comprehensive analysis of the following module.

MODULE INFORMATION:
- Module ID: ${moduleId}
- Module Name: ${moduleName}
- File Count: ${files.length}
- Total Lines: ${totalLines}

ANALYSIS MODES:
${analysisModes.map(mode => `- ${mode}`).join('\n')}

TEAM ROSTER:
${teamRoster.map(member => `- ${member.role}${member.name ? ` (${member.name})` : ''}`).join('\n')}

SOURCE CODE FILES:

${files.map(file => `
=== ${file.path} ===
${file.content}
`).join('\n\n')}

Based on the selected analysis modes, generate tickets, identify risks, and provide insights.

ANALYSIS MODE DESCRIPTIONS:

- architecture-review: Inspect design patterns, coupling, cohesion, SOLID principles, and component interactions
- security-audit: Search for vulnerabilities, injection vectors, authentication flaws, exposed secrets, and insecure dependencies
- scalability-audit: Detect missing caching, unoptimized queries, N+1 problems, memory leaks, and bottlenecks
- refactor-planning: Identify code smells, duplications, complex functions, and suggest SOLID refactorings
- dependency-risk: Analyze outdated packages, deprecated APIs, high-CVE dependencies, and license issues
- onboarding-guide: Create a structured reading order for new developers to understand this module
- dead-code-detection: Find unreferenced imports, unused variables, abandoned functions, and orphaned files
- api-surface-mapping: Document all exposed endpoints, request/response schemas, and authentication requirements

Respond with JSON matching this exact schema:

{
  "tickets": [
    {
      "id": "CB-{MODULE}-{NUMBER}",
      "title": "Clear, actionable title",
      "category": "Refactoring" | "Security" | "Performance" | "Bug Fix" | "Documentation" | "Testing" | "Architecture" | "Dependencies" | "Technical Debt",
      "priority": "Critical" | "High" | "Medium" | "Low",
      "assignedTeamMember": "Role from team roster",
      "description": "Detailed explanation of the issue and why it matters",
      "estimatedEffort": "2-4 hours" | "1-2 days" | "1 week" | "2+ weeks",
      "codeLocations": {
        "files": ["path/to/file.ts"],
        "functionsOrComponents": ["functionName()", "ComponentName"],
        "criticalImports": ["import statement"],
        "lineNumbers": [{"file": "path/to/file.ts", "start": 10, "end": 25}]
      },
      "suggestedActions": ["Step 1", "Step 2"],
      "relatedTickets": ["CB-MODULE-002"]
    }
  ],
  "risks": [
    {
      "id": "RISK-{MODULE}-{NUMBER}",
      "severity": "Critical" | "High" | "Medium" | "Low",
      "category": "Security" | "Performance" | "Maintainability" | "Scalability" | "Compliance" | "Data Loss" | "Availability",
      "title": "Risk title",
      "description": "What could go wrong and impact",
      "affectedFiles": ["path/to/file.ts"],
      "mitigation": "How to address this risk",
      "relatedTickets": ["CB-MODULE-001"]
    }
  ],
  "insights": {
    "codeQuality": {
      "score": 75,
      "issues": ["Issue 1", "Issue 2"],
      "strengths": ["Strength 1", "Strength 2"]
    },
    "dependencies": [
      {
        "name": "package-name",
        "version": "1.2.3",
        "status": "up-to-date" | "outdated" | "deprecated" | "vulnerable",
        "recommendation": "Update to version 2.0.0 for security fixes"
      }
    ],
    "architecturePatterns": ["MVC", "Repository Pattern", "Dependency Injection"],
    "testCoverage": {
      "estimated": 45,
      "gaps": ["No tests for authentication logic", "Missing edge case tests"]
    }
  },
  "diagram": {
    "type": "mermaid",
    "content": "graph TD\n  A[Component A] --> B[Component B]",
    "description": "Component interaction diagram showing data flow"
  },
  "onboardingGuide": {
    "readingOrder": [
      {
        "file": "path/to/file.ts",
        "reason": "Start here - defines core interfaces",
        "keyConceptsToUnderstand": ["Concept 1", "Concept 2"]
      }
    ],
    "prerequisites": ["Understanding of TypeScript", "Familiarity with REST APIs"],
    "estimatedTime": "2-3 hours"
  }
}

Guidelines:
- Generate 3-10 tickets per module (focus on high-impact issues)
- Assign tickets to team members based on expertise (Security → Cybersecurity Engineer)
- Be specific with code locations (exact files, functions, line numbers)
- Prioritize based on: security > performance > maintainability
- Provide actionable suggestions (not vague recommendations)
- Use ticket IDs format: CB-{MODULE_ABBREV}-{NUMBER}
- Include Mermaid diagram if architecture-review mode is selected
- Include onboarding guide if onboarding-guide mode is selected
- Estimate effort realistically based on complexity
`;
```

### Few-Shot Example

```json
{
  "tickets": [
    {
      "id": "CB-AUTH-001",
      "title": "Remove hardcoded JWT secret from source code",
      "category": "Security",
      "priority": "Critical",
      "assignedTeamMember": "Cybersecurity Engineer",
      "description": "The JWT secret key is hardcoded directly in the authentication service file. This is a critical security vulnerability as the secret is exposed in version control and could be used to forge authentication tokens.",
      "estimatedEffort": "2-4 hours",
      "codeLocations": {
        "files": ["src/lib/auth/jwt.ts"],
        "functionsOrComponents": ["generateToken()", "verifyToken()"],
        "criticalImports": ["import jwt from 'jsonwebtoken'"],
        "lineNumbers": [
          {"file": "src/lib/auth/jwt.ts", "start": 5, "end": 7}
        ]
      },
      "suggestedActions": [
        "Move JWT secret to environment variable (JWT_SECRET)",
        "Add validation to ensure JWT_SECRET is set on startup",
        "Rotate the current secret immediately",
        "Add secret scanning to CI/CD pipeline"
      ],
      "relatedTickets": ["CB-AUTH-003"]
    },
    {
      "id": "CB-AUTH-002",
      "title": "Implement rate limiting on login endpoint",
      "category": "Security",
      "priority": "High",
      "assignedTeamMember": "Backend Developer",
      "description": "The login endpoint has no rate limiting, making it vulnerable to brute force attacks. An attacker could attempt unlimited password guesses.",
      "estimatedEffort": "1-2 days",
      "codeLocations": {
        "files": ["src/app/api/auth/login/route.ts"],
        "functionsOrComponents": ["POST()"],
        "criticalImports": [],
        "lineNumbers": [
          {"file": "src/app/api/auth/login/route.ts", "start": 15, "end": 45}
        ]
      },
      "suggestedActions": [
        "Install and configure rate-limiting middleware (e.g., express-rate-limit)",
        "Set limit to 5 attempts per 15 minutes per IP",
        "Add exponential backoff for repeated failures",
        "Log suspicious activity for monitoring"
      ],
      "relatedTickets": []
    }
  ],
  "risks": [
    {
      "id": "RISK-AUTH-001",
      "severity": "Critical",
      "category": "Security",
      "title": "Authentication bypass possible through JWT manipulation",
      "description": "The combination of hardcoded secrets and lack of token expiration validation could allow attackers to forge valid authentication tokens indefinitely.",
      "affectedFiles": [
        "src/lib/auth/jwt.ts",
        "src/middleware/auth.ts"
      ],
      "mitigation": "Implement proper secret management, add token expiration checks, and implement token refresh mechanism",
      "relatedTickets": ["CB-AUTH-001", "CB-AUTH-003"]
    }
  ],
  "insights": {
    "codeQuality": {
      "score": 62,
      "issues": [
        "Hardcoded secrets in source code",
        "Missing input validation on login endpoint",
        "No error handling for database failures",
        "Inconsistent error messages leak system information"
      ],
      "strengths": [
        "Well-structured authentication flow",
        "Clear separation of concerns",
        "Good use of TypeScript types"
      ]
    },
    "dependencies": [
      {
        "name": "jsonwebtoken",
        "version": "8.5.1",
        "status": "outdated",
        "recommendation": "Update to version 9.0.0 for security improvements and better TypeScript support"
      },
      {
        "name": "bcrypt",
        "version": "5.1.1",
        "status": "up-to-date",
        "recommendation": null
      }
    ],
    "architecturePatterns": [
      "Service Layer Pattern",
      "Middleware Pattern",
      "Repository Pattern (partial)"
    ],
    "testCoverage": {
      "estimated": 25,
      "gaps": [
        "No tests for JWT token generation",
        "Missing tests for password hashing",
        "No integration tests for login flow",
        "Edge cases not covered (expired tokens, invalid formats)"
      ]
    }
  },
  "diagram": {
    "type": "mermaid",
    "content": "sequenceDiagram\n    participant Client\n    participant API\n    participant AuthService\n    participant Database\n    \n    Client->>API: POST /api/auth/login\n    API->>AuthService: validateCredentials()\n    AuthService->>Database: findUser(email)\n    Database-->>AuthService: User data\n    AuthService->>AuthService: comparePassword()\n    AuthService->>AuthService: generateToken()\n    AuthService-->>API: JWT token\n    API-->>Client: {token, user}",
    "description": "Authentication flow showing the sequence of operations during user login, from credential validation to JWT token generation"
  },
  "onboardingGuide": {
    "readingOrder": [
      {
        "file": "src/lib/auth/jwt.ts",
        "reason": "Start here - defines core JWT operations and token structure",
        "keyConceptsToUnderstand": [
          "JWT token structure (header, payload, signature)",
          "Token generation and verification process",
          "Token expiration handling"
        ]
      },
      {
        "file": "src/middleware/auth.ts",
        "reason": "Understand how authentication is enforced across routes",
        "keyConceptsToUnderstand": [
          "Middleware pattern in Next.js",
          "Token extraction from headers",
          "Protected route implementation"
        ]
      },
      {
        "file": "src/app/api/auth/login/route.ts",
        "reason": "See the complete login flow implementation",
        "keyConceptsToUnderstand": [
          "API route handlers in Next.js App Router",
          "Request validation",
          "Error handling patterns"
        ]
      }
    ],
    "prerequisites": [
      "Understanding of JWT authentication",
      "Familiarity with Next.js App Router",
      "Basic knowledge of TypeScript",
      "Understanding of async/await patterns"
    ],
    "estimatedTime": "2-3 hours"
  }
}
```

### Token Optimization

**Input Reduction**:
- Limit to 50 files per analysis
- Truncate files over 1000 lines (with warning)
- Remove comments and excessive whitespace
- Prioritize files with business logic over config files

**Estimated Token Usage**:
- System prompt: ~400 tokens
- User prompt template: ~500 tokens
- Source code (50 files, avg 200 lines): ~25,000 tokens
- Team roster: ~100 tokens
- **Total Input**: ~26,000 tokens
- **Expected Output**: ~4,000 tokens
- **Total**: ~30,000 tokens (~$0.30 per analysis)

---

## Prompt Engineering Best Practices

### 1. Clear Instructions
- Use imperative language ("Generate", "Identify", "Provide")
- Specify exact output format (JSON schema)
- Define constraints explicitly (file limits, token counts)

### 2. Structured Input
- Organize information hierarchically
- Use clear section headers
- Separate code from metadata

### 3. Few-Shot Learning
- Provide 1-2 high-quality examples
- Show desired output format
- Demonstrate edge case handling

### 4. Output Constraints
- Specify JSON schema with types
- Require specific field names
- Define enum values for categories

### 5. Context Management
- Prioritize recent/relevant code
- Summarize large files
- Reference external documentation when needed

---

## Error Handling in Prompts

### Invalid JSON Response

**Detection**:
```typescript
try {
  const result = JSON.parse(llmResponse);
  validateSchema(result);
} catch (error) {
  // Retry with stricter instructions
  const retryPrompt = `
    Your previous response was not valid JSON.
    Please respond ONLY with the JSON object, no markdown, no explanations.
    ${originalPrompt}
  `;
}
```

### Incomplete Analysis

**Detection**: Check for minimum ticket count
**Fallback**: Request more detailed analysis

```typescript
if (result.tickets.length < 2) {
  const enhancePrompt = `
    The previous analysis only generated ${result.tickets.length} ticket(s).
    Please provide a more thorough analysis with at least 3-5 actionable tickets.
    Focus on: ${analysisModes.join(', ')}
  `;
}
```

### Hallucinated Code References

**Validation**:
```typescript
// Verify all referenced files exist
const invalidFiles = result.tickets
  .flatMap(t => t.codeLocations.files)
  .filter(file => !moduleFiles.includes(file));

if (invalidFiles.length > 0) {
  // Log warning, filter out invalid references
  console.warn('LLM referenced non-existent files:', invalidFiles);
}
```

---

## Prompt Versioning

### Version Control Strategy

**File Structure**:
```
src/lib/llm/prompts/
├── overview/
│   ├── v1.ts (deprecated)
│   ├── v2.ts (current)
│   └── index.ts (exports current version)
└── module/
    ├── v1.ts (deprecated)
    ├── v2.ts (current)
    └── index.ts
```

**Version Metadata**:
```typescript
export const PROMPT_VERSION = {
  version: '2.0',
  createdAt: '2026-05-16',
  changes: [
    'Added line number requirements',
    'Improved ticket categorization',
    'Enhanced few-shot examples'
  ],
  deprecated: false
};
```

### A/B Testing

**Experiment Framework**:
```typescript
const promptVariant = Math.random() < 0.5 ? 'v2' : 'v2-experimental';

const result = await analyzeModule({
  prompt: getPrompt(promptVariant),
  module,
  metadata: { promptVersion: promptVariant }
});

// Track metrics: token usage, ticket quality, user satisfaction
```

---

## Cost Optimization

### Strategies

1. **Caching**: Cache overview results for 5 minutes
2. **Batching**: Analyze multiple small modules together
3. **Streaming**: Stream responses for better UX
4. **Compression**: Remove unnecessary whitespace
5. **Sampling**: For very large modules, analyze representative files

### Cost Monitoring

```typescript
interface AnalysisCost {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost: number; // USD
  timestamp: string;
}

// Track per analysis
const cost = calculateCost(usage);
logCost({ moduleId, cost, analysisModes });
```

### Budget Alerts

```typescript
const DAILY_BUDGET = 50; // USD
const currentSpend = await getDailySpend();

if (currentSpend > DAILY_BUDGET * 0.9) {
  notifyAdmin('Approaching daily LLM budget limit');
}
```

---

## Quality Assurance

### Output Validation

```typescript
import { z } from 'zod';

const TicketSchema = z.object({
  id: z.string().regex(/^CB-[A-Z]+-\d+$/),
  title: z.string().min(10).max(200),
  category: z.enum(['Refactoring', 'Security', ...]),
  priority: z.enum(['Critical', 'High', 'Medium', 'Low']),
  // ... rest of schema
});

const validateTickets = (tickets: unknown[]) => {
  return tickets.map(ticket => TicketSchema.parse(ticket));
};
```

### Quality Metrics

**Track**:
- Average tickets per analysis
- Distribution of priorities
- Code location accuracy
- User feedback on ticket quality

**Thresholds**:
- Minimum 3 tickets per analysis
- At least 1 High/Critical priority
- 90%+ valid code references
- 4+ star average user rating

---

## Future Enhancements

### Multi-Model Strategy

**Specialized Models**:
- GPT-4 Turbo: Architecture & refactoring
- Claude 3.5 Sonnet: Security analysis
- GPT-3.5 Turbo: Simple categorization

### Fine-Tuning

**Custom Model Training**:
- Collect high-quality analysis examples
- Fine-tune on domain-specific patterns
- Reduce token costs by 50%+

### Retrieval-Augmented Generation (RAG)

**Knowledge Base**:
- Common vulnerability patterns
- Framework best practices
- Security guidelines (OWASP)
- Performance optimization techniques

**Implementation**:
```typescript
const relevantDocs = await vectorSearch(moduleContext);
const enhancedPrompt = `
  ${basePrompt}
  
  RELEVANT KNOWLEDGE:
  ${relevantDocs.map(doc => doc.content).join('\n')}
`;