# ducson-app

## Idea

Theme: **Turn idea into impact faster**

Prompt (Plan Mode):

context: old codebase of a startup that needs refactoring, optimization and scalability. Need a plan for onboarding, to both understand the project and to start implementing solutions.

solution: I want a solution where, from a public repository, IBM Bob analyzes codebase and explains what the code does, how components interact, and where critical logic lives.

On parallel:

- Watsonx.ai summarizes insights in plain language for the team, non-technical stakedholders and new hires.
- watsonx Orchestrate coordinates follow up tasks such as generating a recap for the team, checklist for checking code malpractices, redundancies or vulnerabilities. 

Create a folder called `plans` in the ducson-app folder and place the plan files in there. Update AGENTS.md if necessary. Ask clarifying questions. 

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