import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: 'gemini-3-flash-preview',
  generationConfig: {
    temperature: 0.3,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
  }
});

export async function analyzeOverview(repoData: any, files: string[], packageJson: string | null) {
  const prompt = `
Analyze this GitHub repository and identify 3-5 logical modules based on the file structure and organization.

Repository: ${repoData.full_name}
Description: ${repoData.description || 'No description'}
Language: ${repoData.language || 'Unknown'}
Total Files: ${files.length}

File Structure (first 100 files):
${files.slice(0, 100).join('\n')}

${packageJson ? `package.json content:\n${packageJson.slice(0, 1000)}` : 'No package.json found'}

Instructions:
1. Identify 3-5 logical modules based on directory structure, file naming, and common patterns
2. Each module should represent a cohesive functional area (e.g., Authentication, API, UI Components)
3. Assign relevant files to each module (max 15 files per module for display)
4. Provide clear, concise descriptions

Return ONLY valid JSON with this exact structure (no markdown, no explanations, no code blocks):
{
  "modules": [
    {
      "id": "auth-module",
      "name": "Authentication Module",
      "description": "Handles user authentication and authorization",
      "files": ["src/auth/login.ts", "src/auth/register.ts"],
      "fileCount": 8
    }
  ]
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    const jsonText = response
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    const parsed = JSON.parse(jsonText);
    
    if (!parsed.modules || !Array.isArray(parsed.modules)) {
      throw new Error('Invalid response structure: missing modules array');
    }
    
    if (parsed.modules.length === 0) {
      throw new Error('No modules detected in repository');
    }
    
    return parsed;
  } catch (error: any) {
    if (error instanceof SyntaxError) {
      throw new Error('Failed to parse LLM response as JSON. Please try again.');
    }
    throw error;
  }
}

export async function analyzeModule(moduleName: string, files: any[], team: string[]) {
  const prompt = `
Analyze this code module and generate 3-5 actionable engineering tickets.

Module: ${moduleName}
Team Members: ${team.join(', ')}

Files in Module:
${files.map(f => `
File: ${f.path}
Content (first 500 chars):
${f.content.slice(0, 500)}
`).join('\n---\n')}

Instructions:
1. Identify technical debt, bugs, security issues, performance problems, or missing features
2. Create 3-5 specific, actionable tickets
3. Assign each ticket to the most appropriate team member
4. Prioritize tickets (High, Medium, Low)
5. Include specific file references and concrete action items

Categories: Bug, Security, Performance, Technical Debt, Feature, Documentation

Return ONLY valid JSON with this exact structure (no markdown, no explanations, no code blocks):
{
  "tickets": [
    {
      "id": "CB-001",
      "title": "Fix authentication token expiration handling",
      "category": "Bug",
      "priority": "High",
      "assignedTeamMember": "Senior SWE",
      "description": "The authentication module doesn't properly handle expired tokens, causing users to be logged out unexpectedly. Need to implement refresh token logic and graceful error handling.",
      "files": ["src/auth/login.ts", "src/auth/token.ts"],
      "actions": [
        "Implement token refresh mechanism",
        "Add expiration checks before API calls",
        "Update error handling for 401 responses"
      ]
    }
  ]
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Clean response (remove markdown if present)
    const jsonText = response
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    const parsed = JSON.parse(jsonText);
    
    // Validate response structure
    if (!parsed.tickets || !Array.isArray(parsed.tickets)) {
      throw new Error('Invalid response structure: missing tickets array');
    }
    
    if (parsed.tickets.length === 0) {
      throw new Error('No tickets generated for this module');
    }
    
    // Validate each ticket has required fields
    parsed.tickets.forEach((ticket: any, index: number) => {
      const required = ['id', 'title', 'category', 'priority', 'assignedTeamMember', 'description', 'files', 'actions'];
      const missing = required.filter(field => !ticket[field]);
      if (missing.length > 0) {
        throw new Error(`Ticket ${index + 1} missing required fields: ${missing.join(', ')}`);
      }
    });
    
    return parsed;
  } catch (error: any) {
    if (error instanceof SyntaxError) {
      throw new Error('Failed to parse LLM response as JSON. Please try again.');
    }
    throw error;
  }
}