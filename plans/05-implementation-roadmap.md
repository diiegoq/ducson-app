# Curious Bob - Hackathon MVP Implementation (1 Day)

## Overview

This is an aggressive 1-day implementation plan for a hackathon MVP. Focus is on core functionality with minimal polish. The goal is a working demo that showcases the concept.

---

## Time Budget: 8-10 Hours

```
Hour 0-1:   Project Setup & Dependencies
Hour 1-3:   GitHub Integration & Basic UI
Hour 3-5:   LLM Integration & Overview Analysis
Hour 5-7:   Module Analysis & Results Display
Hour 7-8:   CSV Export & Basic Styling
Hour 8-10:  Testing, Bug Fixes & Demo Prep
```

---

## Phase 1: Project Setup (1 hour)

### Quick Setup Script

```bash
# Create Next.js project
npx create-next-app@latest curious-bob --typescript --tailwind --app --no-src --import-alias "@/*"
cd curious-bob

# Install only essential dependencies
npm install @octokit/rest openai zod lucide-react

# Install minimal UI components
npx shadcn-ui@latest init -y
npx shadcn-ui@latest add button card input label textarea badge tabs

# Create .env.local
echo "OPENAI_API_KEY=your-key-here" > .env.local
```

### Minimal File Structure

```
app/
├── layout.tsx
├── page.tsx                    # Landing + input form
├── results/
│   └── page.tsx               # Results display
└── api/
    ├── overview/
    │   └── route.ts
    └── module/
        └── route.ts
lib/
├── github.ts                  # All GitHub logic
├── llm.ts                     # All LLM logic
└── types.ts                   # All TypeScript types
```

**Deliverable**: Working Next.js app with dependencies installed

---

## Phase 2: GitHub Integration + Basic UI (2 hours)

### 1. Create GitHub Client (`lib/github.ts`)

```typescript
import { Octokit } from '@octokit/rest';

const octokit = new Octokit();

export async function getRepoOverview(owner: string, repo: string) {
  // Get repo metadata
  const { data: repoData } = await octokit.repos.get({ owner, repo });
  
  // Get file tree
  const { data: treeData } = await octokit.git.getTree({
    owner,
    repo,
    tree_sha: repoData.default_branch,
    recursive: 'true'
  });
  
  // Filter files
  const files = treeData.tree
    .filter(item => item.type === 'blob')
    .filter(item => !item.path?.includes('node_modules'))
    .filter(item => !item.path?.match(/\.(jpg|png|gif|svg|ico|pdf|zip)$/))
    .map(item => item.path);
  
  // Get package.json if exists
  let packageJson = null;
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: 'package.json'
    });
    if ('content' in data) {
      packageJson = Buffer.from(data.content, 'base64').toString();
    }
  } catch {}
  
  return { repoData, files, packageJson };
}

export async function getFileContents(owner: string, repo: string, paths: string[]) {
  const contents = await Promise.all(
    paths.slice(0, 20).map(async path => {
      try {
        const { data } = await octokit.repos.getContent({ owner, repo, path });
        if ('content' in data) {
          return {
            path,
            content: Buffer.from(data.content, 'base64').toString()
          };
        }
      } catch {}
      return null;
    })
  );
  return contents.filter(Boolean);
}
```

### 2. Create Types (`lib/types.ts`)

```typescript
export interface Module {
  id: string;
  name: string;
  description: string;
  files: string[];
  fileCount: number;
}

export interface Ticket {
  id: string;
  title: string;
  category: string;
  priority: string;
  assignedTeamMember: string;
  description: string;
  files: string[];
  actions: string[];
}

export const DEFAULT_TEAM = [
  "Tech Lead",
  "Senior SWE",
  "Junior SWE",
  "DevOps Engineer",
  "Security Engineer"
];
```

### 3. Create Landing Page (`app/page.tsx`)

```typescript
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [modules, setModules] = useState([]);
  
  const handleAnalyze = async () => {
    setLoading(true);
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) return;
    
    const [, owner, repo] = match;
    const res = await fetch('/api/overview', {
      method: 'POST',
      body: JSON.stringify({ owner, repo })
    });
    const data = await res.json();
    setModules(data.modules);
    setLoading(false);
  };
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Curious Bob</h1>
      <div className="flex gap-4 mb-8">
        <Input
          placeholder="https://github.com/owner/repo"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button onClick={handleAnalyze} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </Button>
      </div>
      
      {modules.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {modules.map(module => (
            <Card key={module.id} className="p-4">
              <h3 className="font-bold">{module.name}</h3>
              <p className="text-sm text-gray-600">{module.fileCount} files</p>
              <Button 
                className="mt-4 w-full"
                onClick={() => window.location.href = `/results?module=${module.id}`}
              >
                Analyze Module
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
```

**Deliverable**: Working UI that accepts GitHub URLs and displays loading state

---

## Phase 3: LLM Integration + Overview (2 hours)

### 1. Create LLM Client (`lib/llm.ts`)

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyzeOverview(repoData: any, files: string[], packageJson: string) {
  const prompt = `
Analyze this repository and identify 3-5 logical modules.

Repository: ${repoData.full_name}
Description: ${repoData.description || 'No description'}
Files (${files.length}):
${files.slice(0, 100).join('\n')}

${packageJson ? `package.json:\n${packageJson.slice(0, 1000)}` : ''}

Return JSON with this structure:
{
  "modules": [
    {
      "id": "auth-module",
      "name": "Authentication",
      "description": "Handles user auth",
      "files": ["src/auth.ts", "src/login.ts"],
      "fileCount": 5
    }
  ]
}
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.3
  });
  
  return JSON.parse(response.choices[0].message.content);
}

export async function analyzeModule(moduleName: string, files: any[], team: string[]) {
  const prompt = `
Analyze this module and generate 3-5 actionable tickets.

Module: ${moduleName}
Files:
${files.map(f => `${f.path}:\n${f.content.slice(0, 500)}`).join('\n\n')}

Team: ${team.join(', ')}

Return JSON:
{
  "tickets": [
    {
      "id": "CB-001",
      "title": "Fix security issue",
      "category": "Security",
      "priority": "High",
      "assignedTeamMember": "Security Engineer",
      "description": "Detailed description",
      "files": ["src/auth.ts"],
      "actions": ["Action 1", "Action 2"]
    }
  ]
}
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.3
  });
  
  return JSON.parse(response.choices[0].message.content);
}
```

### 2. Create Overview API (`app/api/overview/route.ts`)

```typescript
import { NextResponse } from 'next/server';
import { getRepoOverview } from '@/lib/github';
import { analyzeOverview } from '@/lib/llm';

export async function POST(request: Request) {
  try {
    const { owner, repo } = await request.json();
    const { repoData, files, packageJson } = await getRepoOverview(owner, repo);
    const analysis = await analyzeOverview(repoData, files, packageJson);
    
    return NextResponse.json({
      repository: {
        owner,
        repo,
        description: repoData.description
      },
      ...analysis
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

**Deliverable**: Working overview analysis that returns modules

---

## Phase 4: Module Analysis + Results (2 hours)

### 1. Create Module API (`app/api/module/route.ts`)

```typescript
import { NextResponse } from 'next/server';
import { getFileContents } from '@/lib/github';
import { analyzeModule } from '@/lib/llm';
import { DEFAULT_TEAM } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const { owner, repo, module } = await request.json();
    const files = await getFileContents(owner, repo, module.files);
    const analysis = await analyzeModule(module.name, files, DEFAULT_TEAM);
    
    return NextResponse.json(analysis);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

### 2. Create Results Page (`app/results/page.tsx`)

```typescript
'use client';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function Results() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const moduleId = params.get('module');
    
    // Fetch module analysis
    fetch('/api/module', {
      method: 'POST',
      body: JSON.stringify({
        owner: 'example',
        repo: 'repo',
        module: { id: moduleId, files: [] }
      })
    })
    .then(res => res.json())
    .then(data => {
      setTickets(data.tickets);
      setLoading(false);
    });
  }, []);
  
  const exportCSV = () => {
    const csv = [
      ['ID', 'Title', 'Priority', 'Assigned To', 'Description'],
      ...tickets.map(t => [t.id, t.title, t.priority, t.assignedTeamMember, t.description])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tickets.csv';
    a.click();
  };
  
  if (loading) return <div className="p-8">Loading...</div>;
  
  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-bold">Analysis Results</h1>
        <Button onClick={exportCSV}>Export CSV</Button>
      </div>
      
      <div className="space-y-4">
        {tickets.map(ticket => (
          <Card key={ticket.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{ticket.title}</h3>
                <p className="text-sm text-gray-600">{ticket.id}</p>
              </div>
              <Badge variant={ticket.priority === 'High' ? 'destructive' : 'default'}>
                {ticket.priority}
              </Badge>
            </div>
            
            <p className="mb-4">{ticket.description}</p>
            
            <div className="mb-4">
              <p className="text-sm font-semibold">Assigned: {ticket.assignedTeamMember}</p>
              <p className="text-sm text-gray-600">Files: {ticket.files.join(', ')}</p>
            </div>
            
            <div>
              <p className="text-sm font-semibold mb-2">Suggested Actions:</p>
              <ul className="list-disc list-inside text-sm">
                {ticket.actions.map((action, i) => (
                  <li key={i}>{action}</li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

**Deliverable**: Working end-to-end flow from URL to tickets

---

## Phase 5: CSV Export + Styling (1 hour)

### Quick Wins

1. **CSV Export**: Already included in results page above
2. **Basic Styling**: Use Tailwind defaults
3. **Error Handling**: Add try-catch and basic error messages
4. **Loading States**: Add spinners

### Minimal Polish

```typescript
// Add to layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <nav className="bg-white border-b p-4">
          <div className="container mx-auto">
            <h1 className="text-xl font-bold">Curious Bob</h1>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
```

**Deliverable**: Functional MVP with basic styling

---

## Phase 6: Testing & Demo Prep (2 hours)

### Testing Checklist

- [ ] Test with real GitHub repo (e.g., vercel/next.js)
- [ ] Verify modules are detected
- [ ] Verify tickets are generated
- [ ] Test CSV export
- [ ] Check error handling
- [ ] Test on mobile (basic)

### Demo Preparation

1. **Prepare Demo Repo**: Use a well-known repo (Next.js, React)
2. **Create Demo Script**:
   - Show landing page
   - Paste GitHub URL
   - Show module detection
   - Select a module
   - Show generated tickets
   - Export CSV
3. **Backup Plan**: Have screenshots/video in case of API issues

### Known Limitations (Document These)

- No authentication
- Limited to 20 files per module
- Basic error handling
- No caching
- No rate limiting
- Simplified prompts

**Deliverable**: Working demo ready to present

---

## Deployment (Optional, if time permits)

```bash
# Quick Vercel deployment
npm install -g vercel
vercel --prod

# Add environment variables in Vercel dashboard
# OPENAI_API_KEY=your-key
```

---

## Hackathon Presentation Tips

### Demo Flow (3-5 minutes)

1. **Problem** (30s): "Legacy codebases lack documentation and clear ownership"
2. **Solution** (30s): "Curious Bob analyzes repos and generates actionable tickets"
3. **Demo** (2-3min):
   - Paste GitHub URL
   - Show module detection
   - Show generated tickets with assignments
   - Export CSV
4. **Impact** (30s): "Speeds up onboarding, identifies tech debt, assigns work"

### Key Talking Points

- AI-powered code analysis
- Automatic ticket generation
- Team member assignment
- Export to CSV (future: Jira, GitHub Issues)
- Modular analysis (avoids context window limits)

### Backup Slides

- Architecture diagram
- Example tickets
- Future roadmap
- Cost analysis

---

## Critical Success Factors

### Must Have
- ✅ Accept GitHub URL
- ✅ Detect modules
- ✅ Generate tickets
- ✅ Export CSV
- ✅ Basic UI

### Nice to Have (Skip if time is short)
- Dark mode
- Multiple analysis modes
- Custom team roster
- Detailed error messages
- Loading animations

### Skip for Hackathon
- Authentication
- Database
- Caching
- Advanced filtering
- Integration with Jira/GitHub

---

## Emergency Fallbacks

### If GitHub API Fails
- Use hardcoded file tree
- Mock repository data

### If OpenAI API Fails
- Use pre-generated responses
- Show example tickets

### If Time Runs Out
- Focus on demo video
- Use screenshots
- Explain architecture

---

## Post-Hackathon TODO

If the project continues after the hackathon:

1. Add proper error handling
2. Implement caching
3. Add authentication
4. Support custom team rosters
5. Add multiple analysis modes
6. Implement proper state management
7. Add comprehensive testing
8. Improve prompts based on results
9. Add integrations (Jira, GitHub)
10. Scale infrastructure

---

## Quick Reference Commands

```bash
# Start development
npm run dev

# Build for production
npm run build

# Deploy to Vercel
vercel --prod

# Check for errors
npm run lint

# Format code
npx prettier --write .
```

---

## Time Tracking

Use this to stay on schedule:

| Time | Task | Status |
|------|------|--------|
| 0:00-1:00 | Setup | ⏳ |
| 1:00-3:00 | GitHub + UI | ⏳ |
| 3:00-5:00 | LLM + Overview | ⏳ |
| 5:00-7:00 | Module + Results | ⏳ |
| 7:00-8:00 | Export + Style | ⏳ |
| 8:00-10:00 | Test + Demo | ⏳ |

**Remember**: Done is better than perfect. Ship the MVP!