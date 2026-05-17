import { GoogleGenerativeAI } from '@google/generative-ai';
import { AnalysisPerspective, PERSPECTIVES } from './types';
import { getPerspectivePrompt } from './perspectives';

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

export async function analyzeModule(
  moduleName: string,
  files: any[],
  team: string[],
  perspective: AnalysisPerspective = 'technical-debt'
) {
  const perspectiveInfo = PERSPECTIVES[perspective];
  const perspectiveTeam = perspectiveInfo.team;
  
  const prompt = getPerspectivePrompt(perspective, moduleName, files);

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    const jsonText = response
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    const parsed = JSON.parse(jsonText);
    
    if (!parsed.tickets || !Array.isArray(parsed.tickets)) {
      throw new Error('Invalid response structure: missing tickets array');
    }
    
    if (parsed.tickets.length === 0) {
      throw new Error('No tickets generated for this module');
    }
    
    if (!parsed.perspectiveInsights) {
      throw new Error('Invalid response structure: missing perspectiveInsights');
    }
    
    parsed.tickets.forEach((ticket: any, index: number) => {
      const required = ['id', 'title', 'category', 'priority', 'assignedTeamMember', 'description', 'files', 'actions'];
      const missing = required.filter(field => !ticket[field]);
      if (missing.length > 0) {
        throw new Error(`Ticket ${index + 1} missing required fields: ${missing.join(', ')}`);
      }
    });
    
    return {
      ...parsed,
      perspective
    };
  } catch (error: any) {
    if (error instanceof SyntaxError) {
      throw new Error('Failed to parse LLM response as JSON. Please try again.');
    }
    throw error;
  }
}

export async function analyzeArchitecture(
  repoData: any,
  files: string[],
  configFiles: { path: string; content: string }[],
  readme: string | null
) {
  const prompt = `
Analyze this repository's architecture and provide a comprehensive system overview.

REPOSITORY: ${repoData.full_name}
DESCRIPTION: ${repoData.description || 'No description'}
LANGUAGE: ${repoData.language || 'Unknown'}
STARS: ${repoData.stargazers_count}

FILE STRUCTURE (first 150 files):
${files.slice(0, 150).join('\n')}

CONFIGURATION FILES:
${configFiles.map(f => `--- ${f.path} ---\n${f.content}`).join('\n\n')}

${readme ? `README CONTENT:\n${readme.slice(0, 3000)}` : 'No README found'}

ANALYSIS REQUIREMENTS:

1. SYSTEM ARCHITECTURE
   - Identify the architectural pattern (MVC, Microservices, Monolithic, Serverless, Layered, Event-Driven)
   - Identify 3-7 main components with their types (frontend, backend, database, service, api, middleware)
   - Map component interactions (http, database, event, import, api-call)
   - Generate a Mermaid architecture diagram showing component relationships
   - Identify entry points (server, client, cli, worker)

2. TECHNOLOGY STACK
   - List frameworks and libraries
   - Language breakdown with percentages
   - Database technologies
   - Infrastructure tools
   - Testing frameworks

Return ONLY valid JSON with this exact structure (no markdown, no explanations):
{
  "architecture": {
    "pattern": "MVC",
    "components": [
      {
        "id": "frontend",
        "name": "React Frontend",
        "type": "frontend",
        "description": "User interface built with React",
        "files": ["src/components/", "src/pages/"],
        "dependencies": ["backend-api"]
      }
    ],
    "interactions": [
      {
        "from": "frontend",
        "to": "backend-api",
        "type": "http",
        "description": "REST API calls"
      }
    ],
    "diagram": {
      "type": "mermaid",
      "content": "graph TB\\n    Frontend[React Frontend]\\n    API[Backend API]\\n    DB[(Database)]\\n    Frontend -->|HTTP| API\\n    API -->|Query| DB",
      "description": "System architecture showing main components and their interactions"
    },
    "entryPoints": [
      {
        "file": "src/index.tsx",
        "type": "client",
        "description": "React application entry point"
      }
    ]
  },
  "techStack": {
    "frameworks": ["React", "Next.js", "Express"],
    "languages": [
      { "name": "TypeScript", "percentage": 75 },
      { "name": "JavaScript", "percentage": 20 },
      { "name": "CSS", "percentage": 5 }
    ],
    "databases": ["PostgreSQL", "Redis"],
    "infrastructure": ["Docker", "Kubernetes"],
    "testing": ["Jest", "React Testing Library"]
  }
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
    
    if (!parsed.architecture || !parsed.techStack) {
      throw new Error('Invalid response structure: missing architecture or techStack');
    }
    
    return parsed;
  } catch (error: any) {
    if (error instanceof SyntaxError) {
      throw new Error('Failed to parse architecture analysis. Please try again.');
    }
    throw error;
  }
}

export async function analyzeDatabaseSchema(
  databaseFiles: { path: string; content: string }[]
) {
  if (databaseFiles.length === 0) {
    return {
      type: 'none' as const,
      models: [],
      relationships: [],
      diagram: {
        type: 'mermaid' as const,
        content: '',
        description: 'No database schema detected'
      }
    };
  }

  const prompt = `
Analyze these database schema files and extract the data model.

DATABASE FILES:
${databaseFiles.map(f => `=== ${f.path} ===\n${f.content}`).join('\n\n')}

ANALYSIS REQUIREMENTS:

1. Identify database type (sql, nosql, mixed)
2. Identify database provider (postgresql, mysql, mongodb, sqlite, redis)
3. Identify ORM/ODM (prisma, typeorm, sequelize, mongoose, drizzle)
4. Extract all models/tables with their fields
5. Identify relationships between models
6. Generate a Mermaid ER diagram

Return ONLY valid JSON with this exact structure (no markdown, no explanations):
{
  "type": "sql",
  "provider": "postgresql",
  "orm": "prisma",
  "models": [
    {
      "name": "User",
      "file": "schema.prisma",
      "fields": [
        {
          "name": "id",
          "type": "String",
          "required": true,
          "unique": true,
          "defaultValue": "uuid()"
        },
        {
          "name": "email",
          "type": "String",
          "required": true,
          "unique": true
        }
      ],
      "indexes": ["email"]
    }
  ],
  "relationships": [
    {
      "from": "User",
      "to": "Post",
      "type": "one-to-many",
      "description": "User can have multiple posts"
    }
  ],
  "diagram": {
    "type": "mermaid",
    "content": "erDiagram\\n    User ||--o{ Post : creates\\n    User {\\n        string id PK\\n        string email\\n    }\\n    Post {\\n        string id PK\\n        string userId FK\\n    }",
    "description": "Entity-relationship diagram showing database schema"
  }
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
    
    if (!parsed.type || !parsed.models || !parsed.relationships || !parsed.diagram) {
      throw new Error('Invalid response structure: missing required database schema fields');
    }
    
    return parsed;
  } catch (error: any) {
    if (error instanceof SyntaxError) {
      throw new Error('Failed to parse database schema analysis. Please try again.');
    }
    throw error;
  }
}

export async function analyzeReadme(readme: string | null) {
  if (!readme) {
    return {
      summary: 'No README file found in repository',
      sections: []
    };
  }

  const prompt = `
Analyze this README file and extract key information.

README CONTENT:
${readme.slice(0, 5000)}

Extract:
1. A concise summary (2-3 sentences)
2. Main sections with their content

Return ONLY valid JSON (no markdown, no explanations):
{
  "summary": "Brief project summary",
  "sections": [
    {
      "title": "Installation",
      "content": "Installation instructions summary"
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
    
    if (!parsed.summary || !parsed.sections) {
      throw new Error('Invalid response structure: missing summary or sections');
    }
    
    return parsed;
  } catch (error: any) {
    if (error instanceof SyntaxError) {
      return {
        summary: readme.slice(0, 200) + '...',
        sections: []
      };
    }
    throw error;
  }
}