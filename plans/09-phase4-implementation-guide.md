# Phase 4: Module Analysis + Results - Implementation Guide

## Overview

**Time Budget**: 2 hours  
**Phase Goal**: Complete the end-to-end flow from module selection to ticket generation and display

This phase implements the core value proposition of Curious Bob: analyzing a specific module and generating actionable engineering tickets with team assignments.

---

## Deliverable Specification

### What This Phase Delivers

A **fully functional module analysis system** that:

1. **Accepts module selection** from the landing page
2. **Fetches file contents** from GitHub for the selected module
3. **Analyzes code using LLM** to generate actionable tickets
4. **Displays tickets** in a clean, organized interface
5. **Exports tickets to CSV** for external use

### Success Criteria

- ✅ User can click "Analyze Module" on any detected module
- ✅ System fetches up to 20 files from the selected module
- ✅ LLM generates 3-5 actionable tickets with team assignments
- ✅ Tickets display with all required fields (title, priority, description, files, actions)
- ✅ CSV export works and includes all ticket data
- ✅ Error handling for API failures and timeouts

---

## Implementation Steps

### Step 1: Implement Module Analysis API (30 minutes)

**File**: [`app/api/module/route.ts`](../app/api/module/route.ts)

**Current State**: Stub implementation returning placeholder message

**Required Changes**:

```typescript
import { NextResponse } from 'next/server';
import { getFileContents } from '@/lib/github';
import { analyzeModule } from '@/lib/llm';
import { DEFAULT_TEAM } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const { owner, repo, module } = await request.json();
    
    // Validate input
    if (!owner || !repo || !module) {
      return NextResponse.json(
        { error: 'Missing required fields: owner, repo, module' },
        { status: 400 }
      );
    }
    
    if (!module.files || !Array.isArray(module.files)) {
      return NextResponse.json(
        { error: 'Module must include files array' },
        { status: 400 }
      );
    }
    
    // Fetch file contents (max 20 files)
    const files = await getFileContents(owner, repo, module.files);
    
    if (files.length === 0) {
      return NextResponse.json(
        { error: 'No files could be fetched from the module' },
        { status: 404 }
      );
    }
    
    // Analyze module with LLM
    const analysis = await analyzeModule(module.name, files, DEFAULT_TEAM);
    
    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error('Module analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Module analysis failed' },
      { status: 500 }
    );
  }
}
```

**Key Points**:
- Validates all required input fields
- Uses existing [`getFileContents()`](../lib/github.ts:56) function (already limits to 20 files)
- Calls [`analyzeModule()`](../lib/llm.ts:76) which needs implementation
- Returns structured error messages for debugging

---

### Step 2: Implement LLM Module Analysis (45 minutes)

**File**: [`lib/llm.ts`](../lib/llm.ts)

**Current State**: Stub function returning placeholder message

**Required Changes**:

Replace the [`analyzeModule()`](../lib/llm.ts:76) function with:

```typescript
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
```

**Key Points**:
- Provides detailed context about the module and files
- Includes clear instructions for ticket generation
- Shows example output format to guide the LLM
- Validates response structure thoroughly
- Handles JSON parsing errors gracefully

---

### Step 3: Implement Results Page with Material UI (45 minutes)

**File**: [`app/results/page.tsx`](../app/results/page.tsx)

**Current State**: Placeholder page with basic structure

**Required Changes**:

```typescript
'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack
} from '@mui/material';
import {
  Download as DownloadIcon,
  ArrowBack as ArrowBackIcon,
  BugReport as BugIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Build as BuildIcon,
  Star as StarIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { Ticket } from '@/lib/types';

export default function Results() {
  const searchParams = useSearchParams();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [moduleInfo, setModuleInfo] = useState({
    owner: '',
    repo: '',
    moduleName: ''
  });

  useEffect(() => {
    const owner = searchParams.get('owner');
    const repo = searchParams.get('repo');
    const moduleId = searchParams.get('moduleId');
    const moduleName = searchParams.get('moduleName');
    const moduleFilesStr = searchParams.get('moduleFiles');

    if (!owner || !repo || !moduleId || !moduleName || !moduleFilesStr) {
      setError('Missing required parameters. Please start from the home page.');
      setLoading(false);
      return;
    }

    setModuleInfo({ owner, repo, moduleName });

    let moduleFiles: string[] = [];
    try {
      moduleFiles = JSON.parse(moduleFilesStr);
    } catch {
      setError('Invalid module files data');
      setLoading(false);
      return;
    }

    // Fetch module analysis
    fetch('/api/module', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        owner,
        repo,
        module: {
          id: moduleId,
          name: moduleName,
          files: moduleFiles
        }
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          throw new Error(data.error);
        }
        setTickets(data.tickets || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to analyze module');
        setLoading(false);
      });
  }, [searchParams]);

  const exportCSV = () => {
    const headers = ['ID', 'Title', 'Category', 'Priority', 'Assigned To', 'Description', 'Files', 'Actions'];
    const rows = tickets.map(t => [
      t.id,
      `"${t.title.replace(/"/g, '""')}"`,
      t.category,
      t.priority,
      t.assignedTeamMember,
      `"${t.description.replace(/"/g, '""')}"`,
      `"${t.files.join('; ')}"`,
      `"${t.actions.join('; ')}"`
    ]);

    const csv = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `curious-bob-tickets-${moduleInfo.moduleName.toLowerCase().replace(/\s+/g, '-')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'bug': return <BugIcon />;
      case 'security': return <SecurityIcon />;
      case 'performance': return <SpeedIcon />;
      case 'technical debt': return <BuildIcon />;
      case 'feature': return <StarIcon />;
      case 'documentation': return <DescriptionIcon />;
      default: return <BuildIcon />;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 3 }} color="text.secondary">
            Analyzing {moduleInfo.moduleName}...
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
            This may take 30-60 seconds
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => window.location.href = '/'}
        >
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => window.location.href = '/'}
          sx={{ mb: 2 }}
        >
          Back to Modules
        </Button>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              {moduleInfo.moduleName}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {moduleInfo.owner}/{moduleInfo.repo}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={exportCSV}
            disabled={tickets.length === 0}
            size="large"
          >
            Export CSV
          </Button>
        </Box>
        
        <Typography variant="body2" color="text.secondary">
          {tickets.length} ticket{tickets.length !== 1 ? 's' : ''} generated
        </Typography>
      </Box>

      <Stack spacing={3}>
        {tickets.map((ticket) => (
          <Card key={ticket.id} elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getCategoryIcon(ticket.category)}
                  <Box>
                    <Typography variant="h6" component="h2" fontWeight="bold">
                      {ticket.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {ticket.id}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    label={ticket.priority}
                    color={getPriorityColor(ticket.priority)}
                    size="small"
                  />
                  <Chip
                    label={ticket.category}
                    variant="outlined"
                    size="small"
                  />
                </Box>
              </Box>

              <Typography variant="body1" sx={{ mb: 2 }}>
                {ticket.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Assigned To
                </Typography>
                <Chip label={ticket.assignedTeamMember} color="primary" variant="outlined" />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Affected Files
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {ticket.files.map((file, index) => (
                    <Chip
                      key={index}
                      label={file}
                      size="small"
                      variant="outlined"
                      sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
                    />
                  ))}
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Suggested Actions
                </Typography>
                <List dense disablePadding>
                  {ticket.actions.map((action, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemText
                        primary={`${index + 1}. ${action}`}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {tickets.length === 0 && (
        <Alert severity="info">
          No tickets were generated for this module. This might indicate a well-maintained codebase or insufficient context.
        </Alert>
      )}
    </Container>
  );
}
```

**Key Points**:
- Uses Material UI components for consistent styling
- Extracts module info from URL parameters (passed from home page)
- Shows loading state during analysis
- Displays tickets with all fields in organized cards
- Implements CSV export with proper escaping
- Includes category icons and priority colors
- Handles empty states and errors gracefully

---

## Input/Output Specifications

### API Endpoint: POST /api/module

**Input (Request Body)**:
```json
{
  "owner": "vercel",
  "repo": "next.js",
  "module": {
    "id": "auth-module",
    "name": "Authentication Module",
    "files": [
      "packages/next/src/server/web/spec-extension/cookies.ts",
      "packages/next/src/server/web/spec-extension/request.ts"
    ]
  }
}
```

**Output (Success - 200)**:
```json
{
  "tickets": [
    {
      "id": "CB-001",
      "title": "Implement secure cookie handling",
      "category": "Security",
      "priority": "High",
      "assignedTeamMember": "Security Engineer",
      "description": "Current cookie implementation lacks HttpOnly and Secure flags...",
      "files": ["packages/next/src/server/web/spec-extension/cookies.ts"],
      "actions": [
        "Add HttpOnly flag to all authentication cookies",
        "Implement SameSite=Strict policy",
        "Add cookie encryption for sensitive data"
      ]
    }
  ]
}
```

**Output (Error - 400/500)**:
```json
{
  "error": "Missing required fields: owner, repo, module"
}
```

### Results Page URL Parameters

**Format**:
```
/results?owner=vercel&repo=next.js&moduleId=auth-module&moduleName=Authentication%20Module&moduleFiles=["file1.ts","file2.ts"]
```

**Parameters**:
- `owner` (string, required): GitHub repository owner
- `repo` (string, required): GitHub repository name
- `moduleId` (string, required): Unique module identifier
- `moduleName` (string, required): Display name of the module
- `moduleFiles` (JSON string, required): Array of file paths in the module

---

## Testing Instructions

### Prerequisites

1. **Environment Setup**:
   ```bash
   # Ensure .env.local has required API key
   GOOGLE_AI_API_KEY=your-key-here
   GITHUB_TOKEN=your-token-here  # Optional but recommended
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

### Test Case 1: Happy Path - Full Flow

**Steps**:
1. Navigate to `http://localhost:3000`
2. Enter URL: `https://github.com/vercel/next.js`
3. Click "Analyze" and wait for modules to load
4. Click "Analyze Module" on any module (e.g., "Server Components")
5. Wait 30-60 seconds for ticket generation
6. Verify tickets display with all fields
7. Click "Export CSV" and verify download

**Expected Results**:
- ✅ 3-5 tickets displayed
- ✅ Each ticket has: ID, title, category, priority, assignee, description, files, actions
- ✅ CSV file downloads with all ticket data
- ✅ No console errors

### Test Case 2: Error Handling - Invalid Module

**Steps**:
1. Navigate directly to: `http://localhost:3000/results?owner=invalid&repo=invalid&moduleId=test&moduleName=Test&moduleFiles=[]`
2. Observe error handling

**Expected Results**:
- ✅ Error message displayed
- ✅ "Back to Home" button works
- ✅ No application crash

### Test Case 3: Edge Case - Large Module

**Steps**:
1. Analyze a repository with large modules (e.g., `facebook/react`)
2. Select a module with many files
3. Verify only 20 files are fetched (check Network tab)

**Expected Results**:
- ✅ Analysis completes within 60 seconds
- ✅ Only 20 files fetched from GitHub
- ✅ Tickets still generated successfully

### Test Case 4: CSV Export Validation

**Steps**:
1. Complete a successful analysis
2. Export CSV
3. Open CSV in Excel/Google Sheets
4. Verify data integrity

**Expected Results**:
- ✅ All columns present: ID, Title, Category, Priority, Assigned To, Description, Files, Actions
- ✅ Special characters (quotes, commas) properly escaped
- ✅ Multi-line descriptions display correctly
- ✅ File lists and action lists readable

### Test Case 5: API Direct Testing

**Using curl or Postman**:

```bash
curl -X POST http://localhost:3000/api/module \
  -H "Content-Type: application/json" \
  -d '{
    "owner": "vercel",
    "repo": "next.js",
    "module": {
      "id": "test",
      "name": "Test Module",
      "files": ["package.json", "README.md"]
    }
  }'
```

**Expected Response**:
```json
{
  "tickets": [
    { /* ticket object */ }
  ]
}
```

---

## Common Issues & Solutions

### Issue 1: LLM Returns Invalid JSON

**Symptoms**: Error "Failed to parse LLM response as JSON"

**Solutions**:
1. Check [`lib/llm.ts`](../lib/llm.ts) prompt formatting
2. Verify JSON cleaning regex patterns
3. Add more explicit instructions in prompt
4. Reduce file content length if hitting token limits

### Issue 2: GitHub Rate Limit

**Symptoms**: Error "GitHub API rate limit exceeded"

**Solutions**:
1. Add `GITHUB_TOKEN` to `.env.local`
2. Reduce number of files analyzed
3. Wait for rate limit reset (check response headers)

### Issue 3: Timeout on Large Modules

**Symptoms**: Request takes >60 seconds, Vercel timeout

**Solutions**:
1. Reduce file content truncation limit in [`lib/github.ts`](../lib/github.ts:64)
2. Limit to fewer files (currently 20)
3. Optimize LLM prompt to be more concise

### Issue 4: No Tickets Generated

**Symptoms**: Empty tickets array returned

**Solutions**:
1. Check if files were successfully fetched
2. Verify LLM prompt includes enough context
3. Try different module with more code
4. Check LLM API key is valid

---

## Performance Considerations

### Expected Timings

- **GitHub API calls**: 2-5 seconds (20 files)
- **LLM analysis**: 20-40 seconds
- **Total page load**: 30-60 seconds

### Optimization Opportunities (Post-Hackathon)

1. **Caching**: Store file contents to avoid re-fetching
2. **Streaming**: Stream LLM responses for faster perceived performance
3. **Parallel processing**: Analyze multiple modules simultaneously
4. **Batch API calls**: Reduce GitHub API requests

---

## Verification Checklist

Before marking Phase 4 complete, verify:

- [ ] [`app/api/module/route.ts`](../app/api/module/route.ts) implemented with validation
- [ ] [`lib/llm.ts`](../lib/llm.ts) `analyzeModule()` function complete
- [ ] [`app/results/page.tsx`](../app/results/page.tsx) displays tickets correctly
- [ ] CSV export works with proper escaping
- [ ] Error handling for all failure cases
- [ ] Loading states display during analysis
- [ ] URL parameters passed correctly from home page
- [ ] All TypeScript types match [`lib/types.ts`](../lib/types.ts)
- [ ] No console errors in browser
- [ ] Tested with real GitHub repository

---

## Next Steps (Phase 5)

After completing Phase 4, proceed to:

1. **Polish UI styling** (if time permits)
2. **Add error recovery** (retry buttons)
3. **Improve loading indicators** (progress bars)
4. **Test with multiple repositories**
5. **Prepare demo script**

---

## Quick Reference

### Key Files Modified
- [`app/api/module/route.ts`](../app/api/module/route.ts) - Module analysis API
- [`lib/llm.ts`](../lib/llm.ts) - LLM integration
- [`app/results/page.tsx`](../app/results/page.tsx) - Results display

### Key Functions
- [`getFileContents()`](../lib/github.ts:56) - Fetches file contents from GitHub
- [`analyzeModule()`](../lib/llm.ts:76) - Generates tickets using LLM
- `exportCSV()` - Exports tickets to CSV file

### Environment Variables Required
```env
GOOGLE_AI_API_KEY=your-key-here
GITHUB_TOKEN=your-token-here  # Optional
```

### Test Repository Suggestions
- `vercel/next.js` - Large, well-structured
- `facebook/react` - Complex, multiple modules
- `microsoft/vscode` - TypeScript codebase
- Your own repositories for real-world testing