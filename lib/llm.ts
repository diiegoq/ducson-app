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
  return {
    message: 'Module analysis will be implemented in Phase 4'
  };
}