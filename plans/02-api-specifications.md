# Curious Bob - API Specifications & Data Schemas

## API Endpoints

### 1. POST /api/analyze/overview

**Purpose**: Phase 1 analysis - Repository structure understanding and module identification

**Request Body**:
```typescript
{
  repoUrl: string;              // "https://github.com/owner/repo"
  githubToken?: string;         // Optional PAT for higher rate limits
}
```

**Request Validation**:
- `repoUrl` must match pattern: `https://github.com/[owner]/[repo]`
- Extract owner and repo name
- Validate repository exists and is public
- Check repository size < 100MB

**Response Success (200)**:
```typescript
{
  repository: {
    owner: string;
    name: string;
    fullName: string;           // "owner/repo"
    description: string | null;
    defaultBranch: string;
    size: number;               // KB
    language: string | null;
    stars: number;
    lastUpdated: string;        // ISO 8601
  };
  overview: {
    techStack: string[];        // ["Next.js", "TypeScript", "PostgreSQL"]
    primaryLanguages: {
      language: string;
      percentage: number;
    }[];
    architecture: string;       // "Monolithic" | "Microservices" | "Serverless"
    summary: string;            // 2-3 sentence overview
  };
  modules: {
    id: string;                 // "auth-module"
    name: string;               // "Authentication Module"
    type: string;               // "service-based" | "directory-based" | etc.
    description: string;
    fileCount: number;
    files: string[];            // Relative paths
    estimatedComplexity: "low" | "medium" | "high";
    suggestedAnalysisModes: string[];  // ["security-audit", "architecture-review"]
  }[];
  metadata: {
    analyzedAt: string;         // ISO 8601
    totalFiles: number;
    filteredFiles: number;
    analysisTimeMs: number;
  };
}
```

**Response Error (4xx/5xx)**:
```typescript
{
  error: {
    code: string;               // "REPO_NOT_FOUND" | "REPO_TOO_LARGE" | etc.
    message: string;
    details?: Record<string, any>;
    suggestion?: string;
  };
}
```

**Error Codes**:
- `INVALID_URL`: Malformed GitHub URL
- `REPO_NOT_FOUND`: Repository doesn't exist or is private
- `REPO_TOO_LARGE`: Exceeds 100MB limit
- `RATE_LIMIT_EXCEEDED`: GitHub API rate limit hit
- `GITHUB_API_ERROR`: GitHub API failure
- `LLM_API_ERROR`: OpenAI API failure
- `ANALYSIS_TIMEOUT`: Processing exceeded 60s
- `INVALID_REPOSITORY`: Not a valid code repository

**Processing Steps**:
1. Parse and validate GitHub URL
2. Fetch repository metadata via GitHub API
3. Check size constraint
4. Fetch git tree (recursive)
5. Filter out ignored files (node_modules, binaries, etc.)
6. Fetch key config files (package.json, tsconfig.json, README.md, etc.)
7. Send to LLM with overview prompt
8. Parse and validate LLM response
9. Return structured modules

---

### 2. POST /api/analyze/module

**Purpose**: Phase 2 analysis - Deep dive into selected module with specific analysis modes

**Request Body**:
```typescript
{
  repository: {
    owner: string;
    name: string;
    branch: string;
  };
  module: {
    id: string;
    files: string[];            // Paths to analyze
  };
  analysisModes: string[];      // ["security-audit", "refactor-planning"]
  teamRoster: {
    role: string;               // "Senior SWE"
    name?: string;              // Optional custom name
  }[];
  githubToken?: string;
}
```

**Request Validation**:
- `module.files` must not exceed 50 files
- `analysisModes` must be valid mode IDs
- `teamRoster` must have at least 1 member, max 50
- Total file size must not exceed 10MB

**Response Success (200)**:
```typescript
{
  module: {
    id: string;
    name: string;
    analyzedModes: string[];
  };
  tickets: {
    id: string;                 // "CB-AUTH-001"
    title: string;
    category: string;           // "Refactoring" | "Security" | "Performance" | etc.
    priority: "Critical" | "High" | "Medium" | "Low";
    assignedTeamMember: string; // Role from roster
    description: string;        // Detailed explanation
    estimatedEffort: string;    // "2-4 hours" | "1-2 days" | "1 week"
    codeLocations: {
      files: string[];
      functionsOrComponents: string[];
      criticalImports: string[];
      lineNumbers?: {
        file: string;
        start: number;
        end: number;
      }[];
    };
    suggestedActions: string[];
    relatedTickets?: string[];  // IDs of related tickets
  }[];
  risks: {
    id: string;
    severity: "Critical" | "High" | "Medium" | "Low";
    category: string;           // "Security" | "Performance" | "Maintainability"
    title: string;
    description: string;
    affectedFiles: string[];
    mitigation: string;
    relatedTickets: string[];
  }[];
  insights: {
    codeQuality: {
      score: number;            // 0-100
      issues: string[];
      strengths: string[];
    };
    dependencies: {
      name: string;
      version: string;
      status: "up-to-date" | "outdated" | "deprecated" | "vulnerable";
      recommendation?: string;
    }[];
    architecturePatterns: string[];
    testCoverage?: {
      estimated: number;        // 0-100
      gaps: string[];
    };
  };
  diagram?: {
    type: "mermaid";
    content: string;            // Mermaid diagram syntax
    description: string;
  };
  onboardingGuide?: {
    readingOrder: {
      file: string;
      reason: string;
      keyConceptsToUnderstand: string[];
    }[];
    prerequisites: string[];
    estimatedTime: string;
  };
  metadata: {
    analyzedAt: string;
    filesAnalyzed: number;
    totalLines: number;
    analysisTimeMs: number;
    tokenUsage: {
      prompt: number;
      completion: number;
      total: number;
    };
  };
}
```

**Response Error (4xx/5xx)**: Same format as overview endpoint

**Error Codes** (additional):
- `MODULE_TOO_LARGE`: Too many files or total size exceeded
- `INVALID_ANALYSIS_MODE`: Unknown analysis mode
- `INVALID_TEAM_ROSTER`: Invalid roster format
- `FILE_FETCH_ERROR`: Failed to fetch file contents

**Processing Steps**:
1. Validate request parameters
2. Fetch file contents from GitHub (batch requests)
3. Calculate total size and line count
4. Construct analysis prompt based on selected modes
5. Send to LLM with file contents and team roster
6. Parse and validate LLM response
7. Generate ticket IDs
8. Return structured analysis

---

## Data Schemas (TypeScript)

### Core Types

```typescript
// Repository Information
interface Repository {
  owner: string;
  name: string;
  fullName: string;
  description: string | null;
  defaultBranch: string;
  size: number;
  language: string | null;
  stars: number;
  lastUpdated: string;
}

// Module Definition
interface Module {
  id: string;
  name: string;
  type: ModuleType;
  description: string;
  fileCount: number;
  files: string[];
  estimatedComplexity: Complexity;
  suggestedAnalysisModes: AnalysisMode[];
}

type ModuleType = 
  | "directory-based"
  | "service-based"
  | "bounded-context"
  | "dependency-cluster"
  | "frontend-backend-split"
  | "infrastructure"
  | "feature-slice";

type Complexity = "low" | "medium" | "high";

// Analysis Modes
type AnalysisMode =
  | "architecture-review"
  | "security-audit"
  | "scalability-audit"
  | "refactor-planning"
  | "dependency-risk"
  | "onboarding-guide"
  | "dead-code-detection"
  | "api-surface-mapping";

// Ticket Schema
interface Ticket {
  id: string;
  title: string;
  category: TicketCategory;
  priority: Priority;
  assignedTeamMember: string;
  description: string;
  estimatedEffort: string;
  codeLocations: CodeLocations;
  suggestedActions: string[];
  relatedTickets?: string[];
}

type TicketCategory =
  | "Refactoring"
  | "Security"
  | "Performance"
  | "Bug Fix"
  | "Documentation"
  | "Testing"
  | "Architecture"
  | "Dependencies"
  | "Technical Debt";

type Priority = "Critical" | "High" | "Medium" | "Low";

interface CodeLocations {
  files: string[];
  functionsOrComponents: string[];
  criticalImports: string[];
  lineNumbers?: LineRange[];
}

interface LineRange {
  file: string;
  start: number;
  end: number;
}

// Risk Assessment
interface Risk {
  id: string;
  severity: Priority;
  category: RiskCategory;
  title: string;
  description: string;
  affectedFiles: string[];
  mitigation: string;
  relatedTickets: string[];
}

type RiskCategory =
  | "Security"
  | "Performance"
  | "Maintainability"
  | "Scalability"
  | "Compliance"
  | "Data Loss"
  | "Availability";

// Team Member
interface TeamMember {
  role: string;
  name?: string;
}

// Default Team Roster
const DEFAULT_TEAM: TeamMember[] = [
  { role: "Tech Lead" },
  { role: "Senior SWE" },
  { role: "Junior SWE" },
  { role: "Frontend Developer" },
  { role: "Backend Developer" },
  { role: "DevOps Engineer" },
  { role: "Cybersecurity Engineer" },
  { role: "QA Engineer" },
  { role: "AI/ML Engineer" },
  { role: "Data Engineer" }
];

// Analysis Insights
interface Insights {
  codeQuality: CodeQuality;
  dependencies: Dependency[];
  architecturePatterns: string[];
  testCoverage?: TestCoverage;
}

interface CodeQuality {
  score: number;
  issues: string[];
  strengths: string[];
}

interface Dependency {
  name: string;
  version: string;
  status: DependencyStatus;
  recommendation?: string;
}

type DependencyStatus = 
  | "up-to-date"
  | "outdated"
  | "deprecated"
  | "vulnerable";

interface TestCoverage {
  estimated: number;
  gaps: string[];
}

// Diagram
interface Diagram {
  type: "mermaid";
  content: string;
  description: string;
}

// Onboarding Guide
interface OnboardingGuide {
  readingOrder: ReadingStep[];
  prerequisites: string[];
  estimatedTime: string;
}

interface ReadingStep {
  file: string;
  reason: string;
  keyConceptsToUnderstand: string[];
}

// Metadata
interface AnalysisMetadata {
  analyzedAt: string;
  filesAnalyzed: number;
  totalLines: number;
  analysisTimeMs: number;
  tokenUsage?: TokenUsage;
}

interface TokenUsage {
  prompt: number;
  completion: number;
  total: number;
}
```

### Zod Validation Schemas

```typescript
import { z } from "zod";

// Request Schemas
export const OverviewRequestSchema = z.object({
  repoUrl: z.string().url().regex(/^https:\/\/github\.com\/[\w-]+\/[\w-]+$/),
  githubToken: z.string().optional()
});

export const ModuleAnalysisRequestSchema = z.object({
  repository: z.object({
    owner: z.string().min(1),
    name: z.string().min(1),
    branch: z.string().min(1)
  }),
  module: z.object({
    id: z.string().min(1),
    files: z.array(z.string()).min(1).max(50)
  }),
  analysisModes: z.array(z.enum([
    "architecture-review",
    "security-audit",
    "scalability-audit",
    "refactor-planning",
    "dependency-risk",
    "onboarding-guide",
    "dead-code-detection",
    "api-surface-mapping"
  ])).min(1),
  teamRoster: z.array(z.object({
    role: z.string().min(1),
    name: z.string().optional()
  })).min(1).max(50),
  githubToken: z.string().optional()
});

// Response Schemas
export const TicketSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.enum([
    "Refactoring",
    "Security",
    "Performance",
    "Bug Fix",
    "Documentation",
    "Testing",
    "Architecture",
    "Dependencies",
    "Technical Debt"
  ]),
  priority: z.enum(["Critical", "High", "Medium", "Low"]),
  assignedTeamMember: z.string(),
  description: z.string(),
  estimatedEffort: z.string(),
  codeLocations: z.object({
    files: z.array(z.string()),
    functionsOrComponents: z.array(z.string()),
    criticalImports: z.array(z.string()),
    lineNumbers: z.array(z.object({
      file: z.string(),
      start: z.number(),
      end: z.number()
    })).optional()
  }),
  suggestedActions: z.array(z.string()),
  relatedTickets: z.array(z.string()).optional()
});
```

---

## CSV Export Format

### Tickets Export

**Filename**: `curious-bob-tickets-{repo-name}-{timestamp}.csv`

**Columns**:
```
ID,Title,Category,Priority,Assigned To,Description,Estimated Effort,Files,Functions/Components,Imports,Suggested Actions
```

**Example Row**:
```csv
CB-AUTH-001,"Split monolithic auth service",Refactoring,High,Senior SWE,"The authentication module contains mixed responsibilities...",1-2 days,"src/services/auth.ts; src/controllers/login.ts","validateSession(); loginController()","import jwt from 'jsonwebtoken'","1. Extract JWT logic into separate service; 2. Create AuthService interface"
```

### Risks Export

**Filename**: `curious-bob-risks-{repo-name}-{timestamp}.csv`

**Columns**:
```
ID,Severity,Category,Title,Description,Affected Files,Mitigation,Related Tickets
```

---

## Rate Limiting

### GitHub API Limits

**Anonymous**:
- 60 requests/hour per IP
- Reset time included in response headers

**Authenticated (PAT)**:
- 5,000 requests/hour
- Recommended for production use

**Rate Limit Response Headers**:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1372700873
```

### OpenAI API Limits

**GPT-4 Turbo**:
- 10,000 requests/day (Tier 1)
- 2M tokens/minute
- Cost: $10/1M input tokens, $30/1M output tokens

**Token Estimation**:
- Average file: ~500 tokens
- 50 files: ~25,000 tokens
- System prompt: ~2,000 tokens
- Response: ~5,000 tokens
- **Total per module analysis**: ~32,000 tokens (~$0.32)

---

## Caching Strategy

### GitHub Tree Cache
```typescript
interface TreeCache {
  key: string;              // "owner/repo/branch"
  tree: GitTree;
  cachedAt: number;         // Unix timestamp
  ttl: number;              // 300000 (5 minutes)
}
```

### Analysis Results Cache (Future)
```typescript
interface AnalysisCache {
  key: string;              // "owner/repo/branch/moduleId/modes"
  result: ModuleAnalysisResponse;
  cachedAt: number;
  ttl: number;              // 3600000 (1 hour)
}
```

---

## Error Handling Examples

### Repository Not Found
```json
{
  "error": {
    "code": "REPO_NOT_FOUND",
    "message": "Repository 'owner/repo' not found or is private",
    "suggestion": "Verify the repository URL and ensure it's public"
  }
}
```

### Rate Limit Exceeded
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "GitHub API rate limit exceeded",
    "details": {
      "limit": 60,
      "remaining": 0,
      "resetAt": "2026-05-16T23:45:00Z"
    },
    "suggestion": "Provide a GitHub Personal Access Token for higher limits or wait until rate limit resets"
  }
}
```

### Repository Too Large
```json
{
  "error": {
    "code": "REPO_TOO_LARGE",
    "message": "Repository exceeds maximum size limit",
    "details": {
      "actualSize": "150MB",
      "maxSize": "100MB"
    },
    "suggestion": "Try analyzing specific modules instead of the entire repository"
  }
}
```

### Analysis Timeout
```json
{
  "error": {
    "code": "ANALYSIS_TIMEOUT",
    "message": "Analysis exceeded maximum processing time",
    "details": {
      "timeoutMs": 60000,
      "elapsedMs": 62341
    },
    "suggestion": "Select fewer files or analysis modes to reduce processing time"
  }
}