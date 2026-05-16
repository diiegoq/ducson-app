# ducson-app

## Ideas

Theme: **Turn idea into impact faster**

### Idea 1: Curious Bob

_AI Onboarding & Ticket Orchestrator_

Prompt (Plan Mode):

context: old codebase of a startup that needs refactoring, optimization and scalability. Need a plan for onboarding, to both understand the project and to start implementing solutions.

solution: I want a solution where, from a public repository, IBM Bob analyzes codebase and explains what the code does, how components interact, and where critical logic lives. From this, the app return a series of tickets, assigned to the team members accordingly. For example: vulnerabitly in component X, category: Important, team member: Cybersec Engineer.

Output can be a structured JSON so they can be rendered.

On parallel:

- Watsonx.ai summarizes insights in plain language for the team, non-technical stakedholders and new hires.
- watsonx Orchestrate coordinates follow up tasks such as generating a recap for the team, checklist for checking code malpractices, redundancies or vulnerabilities. 

Create a folder called `plans` in the ducson-app folder and place the plan files in there. Update AGENTS.md if necessary. Ask clarifying questions. 

### Idea 2: Bob the Builder

_Zero-Config DevOps Enginer_

This DevOps engine automates backend containerization by using IBM Bob to scan uncontainerized codebases and instantly detect their frameworks and dependencies. It dynamically generates optimized multi-stage Dockerfiles, a local docker-compose setup, and a production-ready GitHub Actions CI/CD pipeline for a Vercel-like deployment experience.

### Idea 3: BobOps

_Self-Healing CI/CD Pipeline Agent_

This smart plugin automates pipeline debugging by intercepting CI/CD build or runtime error logs and feeding them directly into IBM Bob. Combining these logs with full repository context, Bob automatically diagnoses the root cause, rewrites the faulty configuration files, and opens a git hotfix branch.

## Best Practices

Start with Plan mode for new projects or complex features to create a detailed implementation plan before writing any code. Read the plan carefully to confirm it aligns with your goal.

Plan before coding. Always start complex projects or features in Plan mode to:

- Generate a detailed implementation plan.
- Break down complex problems into manageable steps.
- Identify potential challenges before they arise.
- Create a roadmap for implementation.
- This approach prevents breaking changes and provides a clear direction for development.

Use context mentions. Context mentions let you reference specific elements of your project directly in your conversations with Bob:

- Use @/path/to/file.js to include specific file contents.
- Use @/path/to/folder to include all files in a directory.
- Use @problems to include Bob Findings panel diagnostics.
- Use @terminal to include recent terminal output.
- Highlight text and use the keyboard shortcut ⌘ + L to add it to the chat.

This approach is more efficient than copying and pasting code or describing file locations.

Manage the context window. To prevent Bob from mixing up your goals:

- Start new tasks regularly with specific aims.
- Avoid giving Bob your entire codebase at once.
- Use direct file references to provide targeted context.
- Break complex tasks into smaller, focused subtasks.