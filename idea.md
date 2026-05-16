Curious Bob

_AI Onboarding & Ticket Orchestrator_

### Problem

Old startup codebases often suffer from poor documentation, technical debt, scalability bottlenecks, and unclear ownership. New engineers struggle to onboard quickly, while existing teams lack a structured plan for refactoring, optimization, security review, and architectural improvements. 

### Solution

Curious Bob is a web platform that combines static analysis, repository graphing, and AI reasoning to analyze public repositories and generate actionable engineering plans.

From a public repository URL, the platform:

analyzes the codebase structure,
explains what the system does,
maps how components interact: plantuml diagram
identifies critical business logic,
detects risks and technical debt,
and generates operational tickets assigned to team members. 

Example:

Vulnerability in Authentication Service
Priority: High
Assigned Role: Cybersecurity Engineer

The system uses a hierarchical analysis strategy:

Global Repository Understanding
Domain/Module Partitioning
Module-Level Analysis
Cross-Module Reasoning
Ticket & Ownership Generation

This staged pipeline improves scalability, reduces token costs, and avoids context-window limitations from scanning entire repositories at once.

### Inputs 

Users can give a list of team members, and the app will return a list of tickets, assigned to the team members accordingly. If there is no list, the app has a list of default team members. Example: Junior SWE, Senior SWE, DevOps Eng, Cybersec Eng, Tech Lead, Frontend Dev, AI Eng, etc.


### Functionalities

The app does an overview of the application: main components, functionalities, general scope. From there, it separates the problem into subproblems, for better management of context windows and timeout constraints (avoid making the API scan the whole application). The app uses Github API to get file structure, ignores binaries, node_modules.

Server flow:

1. POST /api/analyze/overview (Phase 1)
Action: Hits the GitHub Trees API (GET /repos/{owner}/{repo}/git/trees/{tree_sha}?recursive=1), filters out junk data (node_modules, images, video assets, lockfiles), and reads foundational context files like package.json, tsconfig.json, and README.md.

LLM Input: Cleaned file tree topology string + Core configuration/metadata files.

LLM Output: An high-level overview of the tech stack, general scope, and a structured array of identified Logical Subproblems/Modules with explicit file mappings.

UI Result: The frontend renders these modules as selectable cards or sections.

What counts as a module? The LLM dynamically clusters code using the following criteria based on the codebase layout:

Directory-based: Pure folder grouping (e.g., /src/controllers).

Service-based: Independent business components (e.g., payment service, emailer).

Bounded-context-based: Domain-driven design domains (e.g., Billing, User Auth, Inventory).

Dependency clusters: Files tightly bound together via intensive cross-imports.

Frontend/Backend split: Dividing client UI paths from server API paths.

Infra layer: Infrastructure configurations (Dockerfiles, CI/CD pipelines, terraform configurations).

Feature slice: Vertical slices representing single self-contained features.


2. POST /api/analyze/module (Phase 2)
Action: Triggered when the user selects a specific module to drill down into. The server selectively fetches the raw text content of the exact files mapped to that module using the GitHub Contents API.

LLM Input: Raw target file contents + Active team roster array (custom or default fallback) + Selected analysis mode configuration flags.

LLM Output: The granular analysis payload containing structured Tickets, Risks, and deep code associations matching the complete output schema.

Analysis modes: (Configurable toggle flags on the UI that alter the underlying system prompt parameters)

Architecture Review: Inspects design patterns, high coupling, and file interactions.

Security Audit: Searches for vulnerabilities, injection vectors, and raw secret leaks.

Scalability Audit: Detects missing caching layers, unoptimized loops, and database bottleneck queries.

Refactor Planning: Converts complex legacy code code structures into clean SOLID patterns.

Dependency Risk Analysis: Pinpoints outdated, abandoned, or high-CVE application packages.

Onboarding Guide: Generates a structured sequence of files to study to understand this specific section.

Dead Code Detection: Finds unreferenced imports, unused variables, and abandoned helper utilities.

API Surface Mapping: Documents all routing endpoints, request models, and parameter schemes exposed by the module.

### Output
Output is a unified, highly-structured JSON schema designed for straightforward UI state hydration and immediate CSV serialization.
Every finding strictly points back to a structural array containing: files, functions, components, and exact imports.
Example: 

``` json
{
  "ticket": {
    "id": "CB-AUTH-001",
    "title": "Split monolithic auth service",
    "category": "Refactoring",
    "priority": "Important",
    "assignedTeamMember": "Senior SWE",
    "description": "The authentication module contains mixed responsibilities, combining database queries directly with JWT signature validation.",
    "codeLocations": {
      "files": [
        "src/services/auth.ts",
        "src/controllers/login.ts"
      ],
      "functionsOrComponents": [
        "validateSession()",
        "loginController()"
      ],
      "criticalImports": [
        "import jwt from 'jsonwebtoken'"
      ]
    }
  }
}
```

From the structured JSON, then we can implement: Export to Jira, Export to Github Issues, Export to Notion, Export as CSV. Focus on CSV, the others are auth-heavy so leave it as to-do.

### Framework

Frontend: Next.js (App Router with layout views for module overview selection).

Backend: Next.js API Route Handlers (stateless handlers passing payloads sequentially to mitigate timeout thresholds).

Deployment: Vercel Environment Pipeline.

### Flow of the app

User visits the deployed web application.
User pastes a public repository URL.
Server retrieves repository structure via GitHub API.
System generates repository overview and module partitioning.
User selects modules and analysis modes.
Server performs targeted analysis.
Platform returns structured JSON results.
Frontend renders:
tickets,
findings,
risks,
recommendations,
onboarding plans,
dependencies,
and follow-up tasks
