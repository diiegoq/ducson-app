# Epic 1: Repository Input & Validation

## Story 1.1: Enter GitHub Repository URL (P0)

**As a** developer exploring a legacy codebase  
**I want** to paste a GitHub repository URL into a clean, intuitive input field  
**So that** I can quickly start analyzing the repository without friction

### Acceptance Criteria
- [ ] Landing page displays a prominent, centered input field
- [ ] Input field has placeholder text: "Enter GitHub repository URL (e.g., https://github.com/vercel/next.js)"
- [ ] Input field is large enough to display full URLs (min 500px width)
- [ ] "Analyze Repository" button is clearly visible and styled as primary CTA
- [ ] Button is disabled until valid URL format is entered
- [ ] Input field has focus on page load for immediate typing

### UI/UX Considerations
- **Visual Hierarchy**: Input should be the hero element on the page
- **Color Scheme**: Use high-contrast colors for accessibility
- **Typography**: Large, readable font (18px+) for input text
- **Spacing**: Generous padding around input (40px+ vertical margins)
- **Feedback**: Subtle border color change on focus (blue accent)

### Technical Notes
- Use Next.js App Router with client component (`'use client'`)
- Implement real-time URL validation with regex
- Pattern: `https://github.com/[owner]/[repo]`
- Store URL in React state for submission

### Dependencies
- None (first user interaction)

---

## Story 1.2: Validate Repository URL Format (P0)

**As a** user  
**I want** immediate feedback on whether my URL is valid  
**So that** I don't waste time submitting incorrect URLs

### Acceptance Criteria
- [ ] URL validation happens on blur or after 500ms pause in typing
- [ ] Invalid URLs show red border and error message below input
- [ ] Error message is specific: "Please enter a valid GitHub repository URL"
- [ ] Valid URLs show green checkmark icon in input field
- [ ] Validation accepts both `https://github.com/` and `github.com/` formats
- [ ] Button remains disabled for invalid URLs

### UI/UX Considerations
- **Error States**: Red (#EF4444) for errors, green (#10B981) for success
- **Icons**: Use checkmark (✓) for valid, X (✗) for invalid
- **Animation**: Smooth 200ms transition for color changes
- **Message Placement**: Error text appears below input, aligned left
- **Font Size**: Error messages in 14px, slightly muted color

### Technical Notes
```typescript
const validateGitHubUrl = (url: string): boolean => {
  const pattern = /^(https?:\/\/)?(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/;
  return pattern.test(url);
};
```

### Dependencies
- Story 1.1 (input field exists)

---

## Story 1.3: Display Loading State During Analysis (P0)

**As a** user  
**I want** clear visual feedback that my repository is being analyzed  
**So that** I know the system is working and approximately how long to wait

### Acceptance Criteria
- [ ] Clicking "Analyze" button triggers loading state immediately
- [ ] Button text changes to "Analyzing..." with spinner icon
- [ ] Button is disabled during loading to prevent double-submission
- [ ] Loading spinner is animated (rotating circle or dots)
- [ ] Progress message appears: "Fetching repository data from GitHub..."
- [ ] Second progress message after 2s: "Analyzing with AI..."
- [ ] Loading state persists until API response received

### UI/UX Considerations
- **Spinner Design**: Use Tailwind's `animate-spin` utility
- **Button State**: Maintain same size to prevent layout shift
- **Progress Messages**: Fade in/out with 300ms transitions
- **Color**: Keep primary button color but reduce opacity to 80%
- **Cursor**: Change to `cursor-wait` during loading

### Technical Notes
```typescript
const [isLoading, setIsLoading] = useState(false);
const [loadingMessage, setLoadingMessage] = useState('');

// Update message after delay
useEffect(() => {
  if (isLoading) {
    setLoadingMessage('Fetching repository data...');
    const timer = setTimeout(() => {
      setLoadingMessage('Analyzing with AI...');
    }, 2000);
    return () => clearTimeout(timer);
  }
}, [isLoading]);
```

### Dependencies
- Story 1.1 (button exists)
- Story 1.2 (validation passes)

---

## Story 1.4: Handle Repository Not Found Error (P1)

**As a** user  
**I want** clear error messages when a repository doesn't exist  
**So that** I can correct my mistake and try again

### Acceptance Criteria
- [ ] 404 errors from GitHub API display user-friendly message
- [ ] Error message: "Repository not found. Please check the URL and try again."
- [ ] Error appears in a dismissible alert banner (red background)
- [ ] Input field remains populated with the attempted URL
- [ ] User can edit URL and retry without page reload
- [ ] Alert has close button (X) in top-right corner

### UI/UX Considerations
- **Alert Design**: Red background (#FEE2E2), dark red text (#991B1B)
- **Icon**: Warning triangle icon on left side
- **Positioning**: Alert appears above input field
- **Animation**: Slide down from top with 300ms ease-out
- **Dismissal**: Fade out when closed, remove from DOM after animation

### Technical Notes
```typescript
try {
  const response = await fetch('/api/overview', {
    method: 'POST',
    body: JSON.stringify({ url: repoUrl })
  });
  if (!response.ok) {
    if (response.status === 404) {
      setError('Repository not found. Please check the URL and try again.');
    }
  }
} catch (error) {
  setError('An error occurred. Please try again.');
}
```

### Dependencies
- Story 1.3 (API call implemented)

---

## Story 1.5: Handle Rate Limit Errors (P1)

**As a** user  
**I want** to know when GitHub's rate limit is exceeded  
**So that** I understand why the analysis failed and what to do next

### Acceptance Criteria
- [ ] Rate limit errors (403) display specific message
- [ ] Message: "GitHub rate limit exceeded. Try again in X minutes or add a GitHub token."
- [ ] Message includes link to GitHub token documentation
- [ ] Alert is yellow/warning color (not red error)
- [ ] Countdown timer shows minutes until rate limit resets
- [ ] Optional: Show input field for GitHub token

### UI/UX Considerations
- **Alert Color**: Yellow background (#FEF3C7), dark yellow text (#92400E)
- **Icon**: Info icon (ℹ️) instead of error icon
- **Link Styling**: Underlined, blue text for documentation link
- **Timer**: Bold, larger font for countdown (e.g., "Try again in 42 minutes")
- **Token Input**: Collapsible section "Add GitHub Token" (optional for MVP)

### Technical Notes
```typescript
if (response.status === 403) {
  const resetTime = response.headers.get('X-RateLimit-Reset');
  const minutesUntilReset = calculateMinutes(resetTime);
  setError(`Rate limit exceeded. Try again in ${minutesUntilReset} minutes.`);
}
```

### Dependencies
- Story 1.3 (API error handling)

---

## Story 1.6: Display Example Repositories (P2)

**As a** new user  
**I want** to see example repositories I can analyze  
**So that** I can quickly try the tool without finding my own repository

### Acceptance Criteria
- [ ] Below input field, show "Try an example:" heading
- [ ] Display 3 clickable example repository cards
- [ ] Examples: Next.js, React, Express.js (popular, well-structured repos)
- [ ] Clicking example auto-fills input and triggers analysis
- [ ] Cards show repository name, description, and star count
- [ ] Cards have hover effect (slight elevation/shadow)

### UI/UX Considerations
- **Card Layout**: Horizontal row of 3 cards, equal width
- **Card Design**: White background, subtle border, rounded corners
- **Hover Effect**: Lift card 2px, add shadow, change cursor to pointer
- **Content**: Repo icon, name (bold), 1-line description, star count
- **Spacing**: 16px gap between cards, 32px margin from input

### Technical Notes
```typescript
const examples = [
  { url: 'https://github.com/vercel/next.js', name: 'Next.js', stars: '120k' },
  { url: 'https://github.com/facebook/react', name: 'React', stars: '220k' },
  { url: 'https://github.com/expressjs/express', name: 'Express', stars: '64k' }
];
```

### Dependencies
- Story 1.1 (input field exists)
- Story 1.3 (analysis trigger works)

---

## Story 1.7: Responsive Mobile Layout (P2)

**As a** mobile user  
**I want** the input interface to work well on my phone  
**So that** I can analyze repositories on any device

### Acceptance Criteria
- [ ] Input field is full-width on mobile (< 768px)
- [ ] Button is full-width on mobile
- [ ] Example cards stack vertically on mobile
- [ ] Touch targets are minimum 44px height
- [ ] Font sizes scale appropriately (16px minimum to prevent zoom)
- [ ] Padding/margins adjust for smaller screens

### UI/UX Considerations
- **Breakpoints**: Mobile (< 768px), Tablet (768-1024px), Desktop (> 1024px)
- **Touch Targets**: All interactive elements 44x44px minimum
- **Viewport**: Set proper viewport meta tag
- **Scrolling**: Ensure no horizontal scroll on mobile
- **Keyboard**: Input doesn't zoom on focus (font-size: 16px minimum)

### Technical Notes
```typescript
// Tailwind responsive classes
<input className="w-full md:w-[600px] text-base md:text-lg" />
<button className="w-full md:w-auto" />
<div className="flex flex-col md:flex-row gap-4" />
```

### Dependencies
- All previous stories (responsive version of existing features)