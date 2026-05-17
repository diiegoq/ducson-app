# Phase 1: Project Setup - Detailed Implementation Guide

## Overview

**Time Budget**: 1 hour  
**Goal**: Create a working Next.js application with all dependencies installed and basic project structure in place  
**Deliverable**: A testable Next.js app that runs locally with Material UI components

---

## Prerequisites

Before starting, ensure you have:
- Node.js 18+ installed (`node --version`)
- npm or yarn package manager
- Git installed
- A code editor (VS Code recommended)
- Google AI Studio API key (get from: https://aistudio.google.com/app/apikey)

---

## Step-by-Step Implementation

### Step 1: Create Next.js Project (5 minutes)

**Command:**
```bash
npx create-next-app@latest curious-bob --typescript --tailwind --app --no-src --import-alias "@/*"
```

**Interactive Prompts - Select These Options:**
- ✅ TypeScript: Yes
- ✅ ESLint: Yes
- ✅ Tailwind CSS: Yes
- ✅ `src/` directory: No
- ✅ App Router: Yes
- ✅ Import alias: Yes (@/*)

**Expected Output:**
```
Creating a new Next.js app in /path/to/curious-bob...

✔ Would you like to use TypeScript? Yes
✔ Would you like to use ESLint? Yes
✔ Would you like to use Tailwind CSS? Yes
✔ Would you like to use `src/` directory? No
✔ Would you like to use App Router? Yes
✔ Would you like to customize the default import alias? Yes
✔ What import alias would you like configured? @/*

Installing dependencies...
Success! Created curious-bob at /path/to/curious-bob
```

**Verification:**
```bash
cd curious-bob
ls -la
```

You should see:
- `app/` directory
- `package.json`
- `tsconfig.json`
- `tailwind.config.ts`
- `next.config.js`

---

### Step 2: Install Core Dependencies (5 minutes)

**Command:**
```bash
npm install @octokit/rest @google/generative-ai zod lucide-react
```

**What Each Package Does:**
- `@octokit/rest`: GitHub API client for fetching repository data
- `@google/generative-ai`: Google Gemini API client for AI analysis
- `zod`: Schema validation for API requests/responses
- `lucide-react`: Icon library for UI components

**Expected Output:**
```
added 45 packages, and audited 350 packages in 15s

120 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

---

### Step 3: Install Material UI (5 minutes)

**Command:**
```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
```

**What Each Package Does:**
- `@mui/material`: Material Design React components
- `@mui/icons-material`: Material Design icons
- `@emotion/react` & `@emotion/styled`: CSS-in-JS styling (required by MUI)

**Expected Output:**
```
added 28 packages, and audited 378 packages in 8s
```

---

### Step 4: Install shadcn/ui Components (10 minutes)

**Initialize shadcn/ui:**
```bash
npx shadcn-ui@latest init -y
```

**Expected Output:**
```
✔ Preflight checks
✔ Verifying framework. Found Next.js.
✔ Validating Tailwind CSS.
✔ Validating import alias.
✔ Writing components.json.
✔ Checking registry.
✔ Updating tailwind.config.js
✔ Updating app/globals.css

Success! Project is configured.
```

**Install Required Components:**
```bash
npx shadcn-ui@latest add button card input label
```

**Expected Output:**
```
✔ Checking registry.
✔ Installing components.
✔ Created 4 files:
  - components/ui/button.tsx
  - components/ui/card.tsx
  - components/ui/input.tsx
  - components/ui/label.tsx
```

**Verification:**
```bash
ls components/ui/
```

You should see:
- `button.tsx`
- `card.tsx`
- `input.tsx`
- `label.tsx`

---

### Step 5: Create Environment Variables (5 minutes)

**Create `.env.local` file:**
```bash
touch .env.local
```

**Add the following content:**
```env
# Google AI Studio API Key (Required)
GOOGLE_AI_API_KEY=your-google-ai-studio-key-here

# GitHub Personal Access Token (Optional - increases rate limit)
# GITHUB_TOKEN=ghp_your_token_here
```

**Get Your Google AI API Key:**
1. Visit: https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key and replace `your-google-ai-studio-key-here`

**Create `.env.local.example` for documentation:**
```bash
cat > .env.local.example << 'EOF'
# Google AI Studio API Key (Required)
# Get your key from: https://aistudio.google.com/app/apikey
GOOGLE_AI_API_KEY=

# GitHub Personal Access Token (Optional)
# Increases rate limit from 60 to 5000 requests/hour
# Get token from: https://github.com/settings/tokens
GITHUB_TOKEN=
EOF
```

**Verification:**
```bash
cat .env.local
```

Should show your API key (keep this secret!).

---

### Step 6: Create Project Structure (10 minutes)

**Create directory structure:**
```bash
mkdir -p lib
mkdir -p app/api/overview
mkdir -p app/api/module
mkdir -p app/results
```

**Create placeholder files:**
```bash
touch lib/github.ts
touch lib/llm.ts
touch lib/types.ts
touch app/api/overview/route.ts
touch app/api/module/route.ts
touch app/results/page.tsx
```

**Verification:**
```bash
tree -L 3 -I 'node_modules'
```

**Expected Structure:**
```
.
├── app/
│   ├── api/
│   │   ├── overview/
│   │   │   └── route.ts
│   │   └── module/
│   │       └── route.ts
│   ├── results/
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   ├── favicon.ico
│   └── globals.css
├── components/
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── label.tsx
├── lib/
│   ├── github.ts
│   ├── llm.ts
│   └── types.ts
├── public/
├── .env.local
├── .env.local.example
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

---

### Step 7: Create Basic Type Definitions (5 minutes)

**Edit `lib/types.ts`:**
```typescript
// Core data types for Curious Bob

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

**Verification:**
```bash
cat lib/types.ts
```

Should show the type definitions above.

---

### Step 8: Update Package.json Scripts (2 minutes)

**Edit `package.json` to ensure these scripts exist:**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

These should already be present from `create-next-app`.

---

### Step 9: Test the Setup (10 minutes)

**Start the development server:**
```bash
npm run dev
```

**Expected Output:**
```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Environments: .env.local

 ✓ Ready in 2.5s
```

**Open Browser:**
1. Navigate to: http://localhost:3000
2. You should see the default Next.js welcome page

**Test TypeScript Compilation:**
```bash
# In a new terminal (keep dev server running)
npx tsc --noEmit
```

**Expected Output:**
```
# No output means success (no TypeScript errors)
```

**Test Linting:**
```bash
npm run lint
```

**Expected Output:**
```
✔ No ESLint warnings or errors
```

---

## Deliverable Checklist

After completing all steps, verify you have:

- ✅ Next.js 14+ project created with TypeScript
- ✅ Tailwind CSS configured
- ✅ Material UI installed and ready
- ✅ shadcn/ui components installed (button, card, input, label)
- ✅ Core dependencies installed (@octokit/rest, @google/generative-ai, zod)
- ✅ `.env.local` file with Google AI API key
- ✅ Project structure created (lib/, app/api/, app/results/)
- ✅ Basic type definitions in `lib/types.ts`
- ✅ Development server runs without errors
- ✅ TypeScript compiles without errors
- ✅ ESLint passes without warnings

---

## Testing the Deliverable

### Test 1: Development Server Starts

**Command:**
```bash
npm run dev
```

**Expected Result:**
- Server starts on http://localhost:3000
- No compilation errors
- Browser shows Next.js welcome page

**Pass Criteria:** ✅ Server runs and page loads

---

### Test 2: TypeScript Configuration

**Command:**
```bash
npx tsc --noEmit
```

**Expected Result:**
- No TypeScript errors
- All type definitions are valid

**Pass Criteria:** ✅ Command completes with no output

---

### Test 3: Environment Variables

**Command:**
```bash
node -e "console.log(require('dotenv').config({ path: '.env.local' }).parsed)"
```

**Expected Result:**
```javascript
{
  GOOGLE_AI_API_KEY: 'your-actual-key-here'
}
```

**Pass Criteria:** ✅ API key is present and not the placeholder text

---

### Test 4: Dependencies Installed

**Command:**
```bash
npm list --depth=0
```

**Expected Result:**
Should include:
- `@octokit/rest@^20.x.x`
- `@google/generative-ai@^0.x.x`
- `@mui/material@^5.x.x`
- `@mui/icons-material@^5.x.x`
- `zod@^3.x.x`
- `lucide-react@^0.x.x`

**Pass Criteria:** ✅ All required packages are listed

---

### Test 5: File Structure

**Command:**
```bash
ls -R app lib components
```

**Expected Result:**
```
app:
api  favicon.ico  globals.css  layout.tsx  page.tsx  results

app/api:
module  overview

app/api/module:
route.ts

app/api/overview:
route.ts

app/results:
page.tsx

lib:
github.ts  llm.ts  types.ts

components:
ui

components/ui:
button.tsx  card.tsx  input.tsx  label.tsx
```

**Pass Criteria:** ✅ All directories and files exist

---

### Test 6: Material UI Integration

**Create test file `app/test-mui/page.tsx`:**
```typescript
import { Button, Card, CardContent, Typography } from '@mui/material';

export default function TestMUI() {
  return (
    <div style={{ padding: '2rem' }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Material UI Test
          </Typography>
          <Button variant="contained" color="primary">
            Test Button
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

**Test:**
1. Start dev server: `npm run dev`
2. Navigate to: http://localhost:3000/test-mui
3. You should see a Material UI card with a button

**Pass Criteria:** ✅ Material UI components render correctly

**Cleanup:**
```bash
rm -rf app/test-mui
```

---

## Expected Inputs & Outputs Summary

### Inputs Required

1. **System Requirements:**
   - Node.js 18+
   - npm or yarn
   - Terminal/Command line access

2. **API Keys:**
   - Google AI Studio API key (required)
   - GitHub Personal Access Token (optional)

3. **User Actions:**
   - Run installation commands
   - Configure environment variables
   - Verify setup steps

### Outputs Delivered

1. **Working Next.js Application:**
   - Runs on http://localhost:3000
   - TypeScript configured
   - Tailwind CSS ready
   - Material UI integrated

2. **Project Structure:**
   - `app/` - Next.js App Router pages
   - `app/api/` - API route handlers
   - `lib/` - Utility functions and types
   - `components/ui/` - Reusable UI components

3. **Dependencies Installed:**
   - GitHub API client (@octokit/rest)
   - Google Gemini AI client (@google/generative-ai)
   - Material UI components
   - shadcn/ui components
   - Validation library (zod)

4. **Configuration Files:**
   - `.env.local` - Environment variables
   - `tsconfig.json` - TypeScript configuration
   - `tailwind.config.ts` - Tailwind CSS configuration
   - `next.config.js` - Next.js configuration

---

## Troubleshooting

### Issue: `create-next-app` fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Try with npx
npx clear-npx-cache
npx create-next-app@latest curious-bob
```

---

### Issue: Port 3000 already in use

**Solution:**
```bash
# Kill process on port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

---

### Issue: TypeScript errors after installation

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Restart TypeScript server in VS Code
# Cmd/Ctrl + Shift + P -> "TypeScript: Restart TS Server"
```

---

### Issue: Material UI styles not loading

**Solution:**
Ensure `@emotion/react` and `@emotion/styled` are installed:
```bash
npm install @emotion/react @emotion/styled
```

---

### Issue: Environment variables not loading

**Solution:**
1. Ensure `.env.local` is in the project root
2. Restart the dev server after changing `.env.local`
3. Check that the file is not named `.env.local.txt` (Windows issue)

---

## Next Steps

After completing Phase 1, you're ready for:

**Phase 2: GitHub Integration + Basic UI** (2 hours)
- Implement GitHub API client in `lib/github.ts`
- Create landing page with URL input
- Build module card components
- Test with real GitHub repositories

**Success Criteria for Phase 1:**
- ✅ All tests pass
- ✅ Dev server runs without errors
- ✅ Material UI components render
- ✅ Environment variables configured
- ✅ Project structure matches specification

---

## Time Tracking

| Task | Estimated | Actual |
|------|-----------|--------|
| Create Next.js project | 5 min | ___ |
| Install core dependencies | 5 min | ___ |
| Install Material UI | 5 min | ___ |
| Install shadcn/ui | 10 min | ___ |
| Configure environment | 5 min | ___ |
| Create project structure | 10 min | ___ |
| Create type definitions | 5 min | ___ |
| Update package.json | 2 min | ___ |
| Test setup | 10 min | ___ |
| **Total** | **57 min** | ___ |

**Buffer:** 3 minutes for unexpected issues

---

## Summary

**What You Built:**
A fully configured Next.js 14 application with TypeScript, Tailwind CSS, Material UI, and all necessary dependencies for building Curious Bob.

**What You Can Do Now:**
- Start the development server
- Create React components with Material UI
- Make API calls to GitHub and Google Gemini
- Use TypeScript for type safety
- Style components with Tailwind CSS

**What's Next:**
Implement the GitHub API integration and build the landing page UI in Phase 2.

---

## Quick Reference Commands

```bash
# Start development server
npm run dev

# Run TypeScript check
npx tsc --noEmit

# Run linter
npm run lint

# Build for production
npm run build

# Install new package
npm install <package-name>

# Check installed packages
npm list --depth=0