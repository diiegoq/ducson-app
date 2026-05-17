# Phase 3: LLM Integration + Overview Analysis - Implementation Guide

## Overview

This phase implements the AI-powered repository overview analysis using Google's Gemini 1.5 Flash model. The system will analyze GitHub repositories and intelligently identify 3-5 logical modules based on file structure, naming patterns, and code organization.

**Time Budget**: 2 hours  
**Phase Focus**: Overview Analysis ONLY (Module ticket generation is Phase 4)

---

## Deliverable

### What Phase 3 Delivers

A **working LLM-powered module detection system** that:

1. Accepts GitHub repository data (file tree, metadata, package.json)
2. Sends structured prompts to Gemini 1.5 Flash
3. Returns 3-5 intelligently identified modules with:
   - Unique IDs (e.g., "auth-module")
   - Descriptive names (e.g., "Authentication Module")
   - Clear descriptions
   - Associated file lists (up to 15 files per module)
   - Total file counts
4. Handles errors gracefully (API failures, rate limits, invalid JSON)
5. Validates LLM responses to ensure data quality

### What Phase 3 Does NOT Include

- ❌ Module-level ticket generation (that's Phase 4)
- ❌ Results display page (that's Phase 4)
- ❌ CSV export (that's Phase 5)

### Success Criteria

✅ **Input**: GitHub repository URL → Extract owner/repo  
✅ **Process**: Fetch repo data → Send to LLM → Parse response  
✅ **Output**: JSON with 3-5 modules displayed as cards in UI  
✅ **Error Handling**: Graceful failures with user-friendly messages  
✅ **Performance**: Response within 10-15 seconds for typical repos

---

## Implementation Steps

### Step 1: Implement Overview Analysis in LLM Client

**File**: [`lib/llm.ts`](../lib/llm.ts)

**What to do**: Replace the stub `analyzeOverview()` function with working Gemini 1.5 Flash integration. Leave `analyzeModule()` as a stub for Phase 4.

**Complete Code**:

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
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
```

**Key Implementation Details**:
- ✅ Gemini 1.5 Flash configuration with optimal parameters
- ✅ Structured prompt with clear instructions for JSON output
- ✅ Response cleaning (removes markdown code blocks)
- ✅ Validation of response structure
- ✅ Error handling for parsing failures
- ✅ `analyzeModule()` left as stub for Phase 4

---

### Step 2: Update Overview API to Use Real LLM

**File**: [`app/api/overview/route.ts`](../app/api/overview/route.ts)

**What to do**: Replace mock module generation with real LLM analysis.

**Complete Code**:

```typescript
import { NextResponse } from 'next/server';
import { getRepoOverview } from '@/lib/github';
import { analyzeOverview } from '@/lib/llm';

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
    
    const analysis = await analyzeOverview(repoData, files, packageJson);
    
    return NextResponse.json({
      repository: {
        owner,
        repo,
        description: repoData.description || 'No description available',
        language: repoData.language,
        stars: repoData.stargazers_count,
        url: repoData.html_url
      },
      modules: analysis.modules,
      totalFiles: files.length,
      hasPackageJson: !!packageJson
    });
  } catch (error: any) {
    console.error('Overview API error:', error);
    
    let errorMessage = 'Failed to analyze repository';
    let statusCode = 500;
    
    if (error.message.includes('not found')) {
      errorMessage = error.message;
      statusCode = 404;
    } else if (error.message.includes('rate limit')) {
      errorMessage = error.message;
      statusCode = 429;
    } else if (error.message.includes('parse')) {
      errorMessage = 'AI analysis failed. Please try again.';
      statusCode = 500;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
```

**Key Changes from Current Implementation**:
- ✅ Removed mock module generation logic
- ✅ Integrated real LLM analysis via `analyzeOverview()`
- ✅ Enhanced error handling with specific status codes
- ✅ Added repository metadata to response (language, stars, URL)
- ✅ Better error messages for different failure scenarios

---

## Testing Instructions

### Prerequisites

1. **Environment Variables**: Ensure `.env.local` has valid API key:
   ```env
   GOOGLE_AI_API_KEY=AIzaSyAxNXxlduHqh2F5EprxSLddS6mit4eGYss
   ```

2. **Development Server**: Start the app:
   ```bash
   npm run dev
   ```
   Server should be running at `http://localhost:3000`

### Test Case 1: Small Repository (Quick Test)

**Input**:
```
URL: https://github.com/vercel/next.js
```

**Steps**:
1. Open `http://localhost:3000`
2. Paste URL in input field
3. Click "Analyze" button
4. Wait 5-10 seconds

**Expected Behavior**:
- Loading spinner appears
- Button becomes disabled
- After 5-10 seconds, 3-5 module cards appear
- Each card shows:
  - Module name (e.g., "Core Framework")
  - File count badge
  - "Analyze Module" button

**Expected API Response**:
```json
{
  "repository": {
    "owner": "vercel",
    "repo": "next.js",
    "description": "The React Framework",
    "language": "TypeScript",
    "stars": 120000,
    "url": "https://github.com/vercel/next.js"
  },
  "modules": [
    {
      "id": "core-framework",
      "name": "Core Framework",
      "description": "Main Next.js framework code including server and client runtime",
      "files": [
        "packages/next/src/server/next-server.ts",
        "packages/next/src/client/index.tsx",
        "packages/next/src/shared/lib/router/router.ts"
      ],
      "fileCount": 450
    },
    {
      "id": "build-system",
      "name": "Build System",
      "description": "Webpack configuration and build pipeline",
      "files": [
        "packages/next/build/webpack-config.ts",
        "packages/next/build/babel/loader.ts"
      ],
      "fileCount": 120
    }
  ],
  "totalFiles": 2500,
  "hasPackageJson": true
}
```

### Test Case 2: Error Handling

**Test 2a: Invalid Repository**
```
Input: https://github.com/invalid/repo-that-does-not-exist
Expected: Error message "Repository not found. Please check the URL and ensure the repository is public."
Status Code: 404
```

**Test 2b: Invalid URL Format**
```
Input: not-a-valid-url
Expected: No API call (frontend validation should catch this)
```

**Test 2c: Missing API Key**
```
Action: Remove GOOGLE_AI_API_KEY from .env.local and restart server
Expected: Error message about API configuration
Status Code: 500
```

### Test Case 3: Real-World Repository

**Input**:
```
URL: https://github.com/facebook/react
```

**Expected Modules** (examples):
- React Core
- React DOM
- React Reconciler
- Development Tools
- Testing Utilities

**Validation Checklist**:
- [ ] 3-5 modules returned
- [ ] Each module has unique ID (kebab-case)
- [ ] File counts are reasonable (>0, <total files)
- [ ] Descriptions are clear and specific (not generic)
- [ ] Files array contains actual file paths from repo
- [ ] No duplicate module IDs

---

## Manual Testing Procedure

### Step-by-Step Test

1. **Open Browser**: Navigate to `http://localhost:3000`

2. **Enter Repository URL**:
   ```
   https://github.com/vercel/next.js
   ```

3. **Click "Analyze"**:
   - Loading spinner should appear immediately
   - Button should be disabled
   - Input field should remain visible

4. **Wait for Response** (5-15 seconds):
   - Module cards should appear below input
   - Each card should have:
     - Clear module name (title case)
     - File count badge (e.g., "450 files")
     - "Analyze Module" button (enabled)

5. **Verify Module Quality**:
   - Modules should make logical sense for the repository
   - Names should be descriptive (not just "Module 1")
   - File counts should be reasonable
   - No duplicate module names

6. **Check Browser Console** (F12):
   - No errors should appear
   - Network tab should show successful POST to `/api/overview`
   - Response should be valid JSON

7. **Test Error Case**:
   - Enter invalid URL: `https://github.com/invalid/repo`
   - Should show error message in UI
   - Should not crash or show blank screen

---

## Expected API Response Format

### Success Response

```json
{
  "repository": {
    "owner": "vercel",
    "repo": "next.js",
    "description": "The React Framework",
    "language": "TypeScript",
    "stars": 120000,
    "url": "https://github.com/vercel/next.js"
  },
  "modules": [
    {
      "id": "core-framework",
      "name": "Core Framework",
      "description": "Main Next.js framework code including server and client runtime",
      "files": [
        "packages/next/src/server/next-server.ts",
        "packages/next/src/client/index.tsx",
        "packages/next/src/shared/lib/router/router.ts"
      ],
      "fileCount": 450
    },
    {
      "id": "build-system",
      "name": "Build System",
      "description": "Webpack configuration and build pipeline",
      "files": [
        "packages/next/build/webpack-config.ts",
        "packages/next/build/babel/loader.ts"
      ],
      "fileCount": 120
    },
    {
      "id": "routing-system",
      "name": "Routing System",
      "description": "App and pages router implementation",
      "files": [
        "packages/next/src/shared/lib/router/router.ts",
        "packages/next/src/client/components/app-router.tsx"
      ],
      "fileCount": 85
    }
  ],
  "totalFiles": 2500,
  "hasPackageJson": true
}
```

### Error Response Examples

**404 - Repository Not Found**:
```json
{
  "error": "Repository not found. Please check the URL and ensure the repository is public."
}
```

**429 - Rate Limit**:
```json
{
  "error": "GitHub API rate limit exceeded. Please try again later or add a GITHUB_TOKEN."
}
```

**500 - LLM Parsing Error**:
```json
{
  "error": "AI analysis failed. Please try again."
}
```

---

## Troubleshooting

### Issue: "Failed to parse LLM response as JSON"

**Cause**: Gemini returned markdown-wrapped JSON or invalid JSON

**Solution**:
1. Check server console logs for raw LLM response
2. Verify prompt is clear about JSON-only output
3. The code already strips markdown, but if issues persist, add more aggressive cleaning:
   ```typescript
   const jsonText = response
     .replace(/```json\n?/g, '')
     .replace(/```\n?/g, '')
     .replace(/^[^{]*/g, '')  // Remove leading non-JSON
     .replace(/[^}]*$/g, '')  // Remove trailing non-JSON
     .trim();
   ```

### Issue: "No modules detected"

**Cause**: LLM returned empty modules array

**Solutions**:
1. Check if repository has sufficient files (needs at least 10-20 files)
2. Verify file filtering in [`lib/github.ts`](../lib/github.ts) isn't too aggressive
3. Check if repository is mostly binary files (images, PDFs, etc.)

### Issue: API Timeout

**Cause**: Large repository or slow LLM response

**Solutions**:
1. Reduce file list sent to LLM (currently 100 files, can reduce to 50)
2. Add timeout to LLM call:
   ```typescript
   const timeoutPromise = new Promise((_, reject) => 
     setTimeout(() => reject(new Error('LLM timeout')), 30000)
   );
   const result = await Promise.race([
     model.generateContent(prompt),
     timeoutPromise
   ]);
   ```

### Issue: Rate Limit Errors

**Cause**: Too many requests to GitHub API

**Solutions**:
1. Add `GITHUB_TOKEN` to `.env.local`:
   ```env
   GITHUB_TOKEN=ghp_your_token_here
   ```
2. This increases rate limit from 60/hour to 5000/hour

### Issue: Module Cards Not Appearing

**Cause**: Frontend state not updating

**Solutions**:
1. Check browser console for errors
2. Verify API response in Network tab
3. Check that `modules` array exists in response
4. Verify frontend code in [`app/page.tsx`](../app/page.tsx) is handling response correctly

---

## Performance Benchmarks

### Expected Response Times

| Repository Size | Files | Expected Time | Token Usage |
|----------------|-------|---------------|-------------|
| Small (<100 files) | 50 | 3-5 seconds | ~2000 tokens |
| Medium (100-1000 files) | 500 | 5-10 seconds | ~4000 tokens |
| Large (1000+ files) | 2000+ | 10-15 seconds | ~5000 tokens |

### Cost Estimates (Gemini 1.5 Flash)

- **Input tokens**: ~2000-5000 per request
- **Output tokens**: ~500-1000 per request
- **Cost per analysis**: ~$0.001-0.003
- **100 analyses**: ~$0.10-0.30

---

## Integration with Frontend

### Current Frontend Code

The frontend in [`app/page.tsx`](../app/page.tsx) is already set up to consume this API. When you click "Analyze":

1. Extracts owner/repo from URL using regex
2. Calls `POST /api/overview` with JSON body
3. Displays returned modules as Material-UI cards
4. Each card has "Analyze Module" button (will be implemented in Phase 4)

**No frontend changes needed** for Phase 3.

---

## Files Modified in Phase 3

### Files to Update

1. **[`lib/llm.ts`](../lib/llm.ts)**
   - Implement `analyzeOverview()` function
   - Leave `analyzeModule()` as stub

2. **[`app/api/overview/route.ts`](../app/api/overview/route.ts)**
   - Replace mock logic with real LLM call
   - Enhance error handling

### Files NOT Modified

- ✅ [`app/page.tsx`](../app/page.tsx) - Frontend already ready
- ✅ [`lib/github.ts`](../lib/github.ts) - GitHub client already working
- ✅ [`lib/types.ts`](../lib/types.ts) - Types already defined
- ✅ [`app/results/page.tsx`](../app/results/page.tsx) - Will be implemented in Phase 4

---

## Environment Setup

### Required Environment Variables

```env
# Required for Phase 3
GOOGLE_AI_API_KEY=AIzaSyAxNXxlduHqh2F5EprxSLddS6mit4eGYss

# Optional (recommended for higher rate limits)
GITHUB_TOKEN=ghp_your_token_here
```

### How to Get API Keys

**Google AI Studio API Key**:
1. Go to https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy key to `.env.local`

**GitHub Token** (optional):
1. Go to https://github.com/settings/tokens
2. Generate new token (classic)
3. Select `public_repo` scope
4. Copy token to `.env.local`

---

## Validation Checklist

Before marking Phase 3 complete, verify:

- [ ] [`lib/llm.ts`](../lib/llm.ts) has working `analyzeOverview()` function
- [ ] `analyzeModule()` is left as stub (not implemented)
- [ ] [`app/api/overview/route.ts`](../app/api/overview/route.ts) uses real LLM (no mocks)
- [ ] Test with `https://github.com/vercel/next.js` succeeds
- [ ] Test with invalid repo shows error message
- [ ] Response time is under 15 seconds
- [ ] Module cards display correctly in UI
- [ ] Console shows no errors during normal operation
- [ ] API returns 3-5 modules with valid structure
- [ ] Each module has unique ID, name, description, files, fileCount

---

## Next Steps (Phase 4)

After completing Phase 3, you'll have:
- ✅ Working module detection
- ✅ LLM integration for overview analysis
- ✅ Error handling
- ✅ Module cards displayed in UI

Phase 4 will implement:
- Implement `analyzeModule()` function in [`lib/llm.ts`](../lib/llm.ts)
- Create Module API endpoint ([`app/api/module/route.ts`](../app/api/module/route.ts))
- Create Results display page ([`app/results/page.tsx`](../app/results/page.tsx))
- Display generated tickets with assignments

---

## Quick Reference

### Test Command

```bash
# Start development server
npm run dev

# Open browser
# Navigate to: http://localhost:3000
# Enter: https://github.com/vercel/next.js
# Click "Analyze"
# Wait 5-10 seconds
# Verify 3-5 module cards appear
```

### Debug Commands

```bash
# Check environment variables
cat .env.local

# View server logs
# (logs appear in terminal where npm run dev is running)

# Test API directly with curl
curl -X POST http://localhost:3000/api/overview \
  -H "Content-Type: application/json" \
  -d '{"owner":"vercel","repo":"next.js"}'
```

---

## Success Metrics

Phase 3 is complete when:

1. ✅ Real repository analysis works end-to-end
2. ✅ 3-5 modules are detected and displayed
3. ✅ Error handling works for common failures
4. ✅ Response time is acceptable (<15s)
5. ✅ No console errors during normal operation
6. ✅ Module data structure matches expected format
7. ✅ `analyzeModule()` remains as stub for Phase 4

**Estimated Time**: 1.5-2 hours including testing

---

## Summary

**Phase 3 Scope**: Overview Analysis Only
- ✅ Implement `analyzeOverview()` in [`lib/llm.ts`](../lib/llm.ts)
- ✅ Update [`app/api/overview/route.ts`](../app/api/overview/route.ts)
- ✅ Test with real repositories
- ❌ Do NOT implement `analyzeModule()` (that's Phase 4)
- ❌ Do NOT implement results page (that's Phase 4)

**Deliverable**: Working module detection that displays 3-5 module cards in the UI when given a GitHub repository URL.