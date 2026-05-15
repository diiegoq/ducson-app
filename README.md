# ducson-app

## Idea

Theme: **Turn idea into impact faster**

Prompt (Plan Mode):

example: I want different classes of seats for Galaxium Travels. There is supposed to be an Economy, a Business class, and a Galaxium class. Help me make a plan to implement this.

Create a folder called `plans` in the ducson-app folder and place the plan files in there. Ask claryfication questions.

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