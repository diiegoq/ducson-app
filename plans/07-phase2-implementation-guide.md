# Phase 2: GitHub Integration + Basic UI - Implementation Guide

## Overview

This guide provides step-by-step instructions for implementing Phase 2 of the Curious Bob MVP. Phase 2 focuses on creating the GitHub API integration and building the landing page UI that accepts repository URLs and displays module cards.

**Time Budget**: 2 hours  
**Prerequisites**: Phase 1 completed (project setup, dependencies installed)

---

## Deliverable

### What You'll Build

A working web application that:
1. Accepts GitHub repository URLs via a Material UI input form
2. Fetches repository metadata and file tree from GitHub API
3. Displays a loading state while processing
4. Shows placeholder module cards (actual LLM analysis comes in Phase 3)

### Success Criteria

- ✅ User can paste a GitHub URL (e.g., `https://github.com/vercel/next.js`)
- ✅ App validates URL format and extracts owner/repo
- ✅ GitHub API successfully fetches repository data
- ✅ File tree is retrieved and filtered (excludes node_modules, binaries)
- ✅ Loading spinner displays during API calls
- ✅ Error messages show for invalid URLs or API failures
- ✅ UI is responsive and uses Material UI components

---

## Implementation Steps

### Step 1: Implement GitHub Client (30 minutes)

**File**: [`lib/github.ts`](lib/github.ts)

Replace the placeholder implementation with full GitHub API integration:

```typescript
import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

export async function getRepoOverview(owner: string, repo: string) {
  try {
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
      .filter(item => !item.path?.includes('.git/'))
      .filter(item => !item.path?.match(/\.(jpg|jpeg|png|gif|svg|ico|pdf|zip|tar|gz|exe|dll|so|dylib)$/i))
      .map(item => item.path)
      .filter((path): path is string => path !== undefined);
    
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
    } catch {
      // package.json doesn't exist, that's okay
    }
    
    return { 
      repoData, 
      files, 
      packageJson 
    };
  } catch (error: any) {
    if (error.status === 404) {
      throw new Error('Repository not found. Please check the URL and ensure the repository is public.');
    }
    if (error.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please try again later or add a GITHUB_TOKEN.');
    }
    throw new Error(`GitHub API error: ${error.message}`);
  }
}

export async function getFileContents(owner: string, repo: string, paths: string[]) {
  const contents = await Promise.all(
    paths.slice(0, 20).map(async path => {
      try {
        const { data } = await octokit.repos.getContent({ owner, repo, path });
        if ('content' in data) {
          const content = Buffer.from(data.content, 'base64').toString();
          // Truncate large files to avoid token limits
          const truncatedContent = content.length > 5000 
            ? content.slice(0, 5000) + '\n... (truncated)'
            : content;
          return {
            path,
            content: truncatedContent
          };
        }
      } catch {
        // File couldn't be fetched, skip it
      }
      return null;
    })
  );
  return contents.filter((item): item is { path: string; content: string } => item !== null);
}
```

**Key Changes**:
- Added comprehensive error handling for 404 (not found) and 403 (rate limit)
- Enhanced file filtering to exclude more binary types and .git directory
- Added TypeScript type guards for better type safety
- Truncate large files to 5000 characters to avoid token limits
- Added try-catch for package.json (optional file)

---

### Step 2: Update Landing Page with Material UI (45 minutes)

**File**: [`app/page.tsx`](app/page.tsx)

Replace the placeholder with a full Material UI implementation:

```typescript
'use client';
import { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import { GitHub as GitHubIcon, Folder as FolderIcon } from '@mui/icons-material';

interface Module {
  id: string;
  name: string;
  description: string;
  files: string[];
  fileCount: number;
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modules, setModules] = useState<Module[]>([]);
  const [repoInfo, setRepoInfo] = useState<{ owner: string; repo: string; description: string } | null>(null);
  
  const handleAnalyze = async () => {
    setError('');
    setModules([]);
    setRepoInfo(null);
    
    // Validate URL format
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) {
      setError('Invalid GitHub URL. Please use format: https://github.com/owner/repo');
      return;
    }
    
    const [, owner, repo] = match;
    const cleanRepo = repo.replace(/\.git$/, ''); // Remove .git suffix if present
    
    setLoading(true);
    
    try {
      const res = await fetch('/api/overview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner, repo: cleanRepo })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Analysis failed');
      }
      
      setModules(data.modules || []);
      setRepoInfo(data.repository || null);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze repository');
    } finally {
      setLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleAnalyze();
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Curious Bob
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          AI-powered repository analysis and ticket generation
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <TextField
          fullWidth
          placeholder="https://github.com/vercel/next.js"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyPress={handleKeyPress}
          variant="outlined"
          disabled={loading}
          InputProps={{
            startAdornment: <GitHubIcon sx={{ mr: 1, color: 'text.secondary' }} />
          }}
        />
        <Button
          variant="contained"
          onClick={handleAnalyze}
          disabled={loading || !url.trim()}
          sx={{ minWidth: 140, height: 56 }}
          size="large"
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Analyze'}
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 4 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      {repoInfo && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            {repoInfo.owner}/{repoInfo.repo}
          </Typography>
          {repoInfo.description && (
            <Typography variant="body1" color="text.secondary">
              {repoInfo.description}
            </Typography>
          )}
        </Box>
      )}
      
      {modules.length > 0 && (
        <>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Detected Modules ({modules.length})
          </Typography>
          <Grid container spacing={3}>
            {modules.map(module => (
              <Grid item xs={12} sm={6} md={4} key={module.id}>
                <Card 
                  elevation={2}
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <FolderIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6" component="h3">
                        {module.name}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {module.description}
                    </Typography>
                    <Chip 
                      label={`${module.fileCount} files`} 
                      size="small" 
                      variant="outlined"
                    />
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => {
                        const params = new URLSearchParams({
                          owner: repoInfo?.owner || '',
                          repo: repoInfo?.repo || '',
                          moduleId: module.id,
                          moduleName: module.name,
                          moduleFiles: JSON.stringify(module.files)
                        });
                        window.location.href = `/results?${params.toString()}`;
                      }}
                    >
                      Analyze Module
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
      
      {loading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress size={60} />
          <Typography variant="body1" sx={{ mt: 2 }} color="text.secondary">
            Analyzing repository structure...
          </Typography>
        </Box>
      )}
    </Container>
  );
}
```

**Key Features**:
- Material UI components for consistent design
- URL validation with helpful error messages
- Loading states with spinner and disabled inputs
- Error handling with dismissible alerts
- Keyboard support (Enter key to submit)
- Hover effects on module cards
- Repository info display
- Pass module data via URL parameters to results page

---

### Step 3: Create Temporary Overview API (15 minutes)

**File**: [`app/api/overview/route.ts`](app/api/overview/route.ts)

For Phase 2, create a temporary API that returns mock modules (Phase 3 will add LLM integration):

```typescript
import { NextResponse } from 'next/server';
import { getRepoOverview } from '@/lib/github';

export async function POST(request: Request) {
  try {
    const { owner, repo } = await request.json();
    
    if (!owner || !repo) {
      return NextResponse.json(
        { error: 'Missing owner or repo parameter' },
        { status: 400 }
      );
    }
    
    const { repoData, files, packageJson } = await getRepoOverview(owner, repo);
    
    // TEMPORARY: Return mock modules for Phase 2 testing
    // Phase 3 will replace this with actual LLM analysis
    const mockModules = [
      {
        id: 'core-module',
        name: 'Core Module',
        description: 'Main application logic and core functionality',
        files: files.filter(f => f.includes('src/') || f.includes('lib/')).slice(0, 15),
        fileCount: files.filter(f => f.includes('src/') || f.includes('lib/')).length
      },
      {
        id: 'api-module',
        name: 'API Module',
        description: 'API routes and backend services',
        files: files.filter(f => f.includes('api/')).slice(0, 15),
        fileCount: files.filter(f => f.includes('api/')).length
      },
      {
        id: 'ui-module',
        name: 'UI Module',
        description: 'User interface components and pages',
        files: files.filter(f => f.includes('components/') || f.includes('pages/')).slice(0, 15),
        fileCount: files.filter(f => f.includes('components/') || f.includes('pages/')).length
      }
    ].filter(m => m.fileCount > 0); // Only include modules with files
    
    return NextResponse.json({
      repository: {
        owner,
        repo,
        description: repoData.description || 'No description available'
      },
      modules: mockModules,
      totalFiles: files.length,
      hasPackageJson: !!packageJson
    });
  } catch (error: any) {
    console.error('Overview API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze repository' },
      { status: 500 }
    );
  }
}
```

**Note**: This is a temporary implementation. Phase 3 will replace the mock modules with actual LLM-generated module detection.

---

### Step 4: Update Layout with Material UI Theme (15 minutes)

**File**: [`app/layout.tsx`](app/layout.tsx)

Add Material UI theme provider and navigation:

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppBar, Toolbar, Typography, Container, ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Curious Bob - AI Repository Analysis',
  description: 'Analyze GitHub repositories and generate actionable engineering tickets',
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: inter.style.fontFamily,
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppBar position="static" elevation={1}>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Curious Bob
              </Typography>
            </Toolbar>
          </AppBar>
          <main>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

### Step 5: Environment Configuration (5 minutes)

**File**: `.env.local`

Ensure your environment file has the GitHub token (optional but recommended):

```env
GITHUB_TOKEN=ghp_your_token_here
GOOGLE_AI_API_KEY=your_google_ai_key_here
```

**Note**: GitHub token is optional but increases rate limits from 60 to 5000 requests/hour.

---

## Testing Instructions

### Manual Testing Checklist

1. **Start Development Server**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:3000`

2. **Test Valid Repository**
   - Input: `https://github.com/vercel/next.js`
   - Expected: Loading spinner → Module cards appear
   - Verify: 3 module cards with names, descriptions, file counts

3. **Test Invalid URL**
   - Input: `https://example.com/invalid`
   - Expected: Error message "Invalid GitHub URL..."

4. **Test Non-existent Repository**
   - Input: `https://github.com/nonexistent/repo12345`
   - Expected: Error message "Repository not found..."

5. **Test Private Repository (without token)**
   - Input: `https://github.com/your-username/private-repo`
   - Expected: Error message "Repository not found..."

6. **Test Keyboard Navigation**
   - Type URL and press Enter
   - Expected: Analysis starts without clicking button

7. **Test Loading State**
   - Verify spinner appears
   - Verify input and button are disabled during loading
   - Verify loading message displays

8. **Test Module Cards**
   - Verify hover effect (card lifts up)
   - Verify file count displays
   - Verify "Analyze Module" button is clickable

9. **Test Responsive Design**
   - Resize browser window
   - Verify cards stack on mobile (1 column)
   - Verify cards show 2 columns on tablet
   - Verify cards show 3 columns on desktop

10. **Test Error Dismissal**
    - Trigger an error
    - Click X on error alert
    - Verify error disappears

### Expected Outputs

#### Successful Analysis Response

```json
{
  "repository": {
    "owner": "vercel",
    "repo": "next.js",
    "description": "The React Framework"
  },
  "modules": [
    {
      "id": "core-module",
      "name": "Core Module",
      "description": "Main application logic and core functionality",
      "files": ["src/index.ts", "src/app.ts", ...],
      "fileCount": 245
    },
    {
      "id": "api-module",
      "name": "API Module",
      "description": "API routes and backend services",
      "files": ["api/route.ts", ...],
      "fileCount": 87
    }
  ],
  "totalFiles": 1523,
  "hasPackageJson": true
}
```

#### Error Response

```json
{
  "error": "Repository not found. Please check the URL and ensure the repository is public."
}
```

---

## Verification Checklist

Before moving to Phase 3, verify:

- [ ] GitHub API successfully fetches repository metadata
- [ ] File tree is retrieved and filtered correctly
- [ ] Mock modules are generated based on file structure
- [ ] UI displays loading states appropriately
- [ ] Error messages are clear and helpful
- [ ] Module cards display with correct information
- [ ] Clicking "Analyze Module" navigates to results page
- [ ] URL parameters are passed correctly to results page
- [ ] Material UI theme is applied consistently
- [ ] Navigation bar displays at top
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] No console errors in browser developer tools
- [ ] TypeScript compiles without errors

---

## Common Issues & Solutions

### Issue: GitHub API Rate Limit

**Symptom**: Error "GitHub API rate limit exceeded"

**Solution**: 
1. Add `GITHUB_TOKEN` to `.env.local`
2. Generate token at https://github.com/settings/tokens
3. Restart development server

### Issue: Module Cards Not Displaying

**Symptom**: Loading completes but no cards appear

**Solution**:
1. Check browser console for errors
2. Verify API response in Network tab
3. Ensure `modules` array is not empty
4. Check that repository has files in expected directories

### Issue: TypeScript Errors

**Symptom**: Type errors in IDE or build

**Solution**:
1. Run `npm install` to ensure all types are installed
2. Check that `@types/node`, `@types/react` are in devDependencies
3. Restart TypeScript server in VSCode

### Issue: Material UI Styles Not Loading

**Symptom**: Unstyled components or missing theme

**Solution**:
1. Verify `ThemeProvider` wraps app in [`layout.tsx`](app/layout.tsx)
2. Check that `@mui/material` is installed
3. Clear `.next` cache: `rm -rf .next && npm run dev`

---

## Next Steps

After completing Phase 2:

1. **Test with Multiple Repositories**
   - Try different repo sizes (small, medium, large)
   - Test repos with different structures (monorepo, simple app)
   - Verify file filtering works correctly

2. **Prepare for Phase 3**
   - Ensure Google AI API key is in `.env.local`
   - Review LLM prompt strategy document
   - Understand module detection requirements

3. **Document Any Issues**
   - Note any GitHub API limitations encountered
   - Record any UI/UX improvements needed
   - List any edge cases discovered

---

## Time Tracking

| Task | Estimated | Actual |
|------|-----------|--------|
| GitHub Client Implementation | 30 min | ___ |
| Landing Page UI | 45 min | ___ |
| Overview API | 15 min | ___ |
| Layout & Theme | 15 min | ___ |
| Environment Setup | 5 min | ___ |
| Testing | 10 min | ___ |
| **Total** | **2 hours** | ___ |

---

## Success Metrics

Phase 2 is complete when:

1. ✅ User can input any public GitHub repository URL
2. ✅ App fetches and displays repository information
3. ✅ Mock modules are generated and displayed as cards
4. ✅ Error handling works for invalid URLs and API failures
5. ✅ UI is responsive and follows Material UI design patterns
6. ✅ All TypeScript types are correct with no errors
7. ✅ Navigation to results page works with proper parameters

**Ready for Phase 3**: LLM Integration & Overview Analysis