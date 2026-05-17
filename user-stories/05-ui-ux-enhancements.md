# Epic 5: UI/UX Enhancements

## Story 5.1: Implement Design System & Theme (P0)

**As a** user  
**I want** a consistent, professional visual design throughout the app  
**So that** the interface feels polished and trustworthy

### Acceptance Criteria
- [ ] Define color palette (primary, secondary, accent, neutral, semantic)
- [ ] Establish typography scale (headings, body, captions)
- [ ] Create spacing system (4px base unit)
- [ ] Define shadow/elevation levels
- [ ] Implement border radius standards
- [ ] Create reusable component styles

### UI/UX Considerations
- **Color Palette**:
  - Primary: Blue (#3B82F6) - CTAs, links, active states
  - Secondary: Indigo (#6366F1) - accents, highlights
  - Success: Green (#10B981) - success states, positive actions
  - Warning: Yellow (#F59E0B) - warnings, cautions
  - Error: Red (#EF4444) - errors, destructive actions
  - Neutral: Gray scale (#F9FAFB to #111827)
- **Typography**:
  - Font Family: Inter or System UI stack
  - Headings: 32px, 24px, 20px, 18px (bold)
  - Body: 16px (regular), 14px (small)
  - Captions: 12px
- **Spacing**: 4, 8, 12, 16, 24, 32, 48, 64px
- **Shadows**: 
  - sm: 0 1px 2px rgba(0,0,0,0.05)
  - md: 0 4px 6px rgba(0,0,0,0.1)
  - lg: 0 10px 15px rgba(0,0,0,0.1)
- **Border Radius**: 4px (small), 8px (medium), 16px (large)

### Technical Notes
```typescript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EFF6FF',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8'
        },
        // ... other colors
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      spacing: {
        // 4px base unit
      }
    }
  }
};
```

### Dependencies
- None (foundational)

---

## Story 5.2: Add Loading Skeletons (P1)

**As a** user  
**I want** to see skeleton loaders while content loads  
**So that** I understand the page structure and feel the app is responsive

### Acceptance Criteria
- [ ] Module cards show skeleton placeholders during loading
- [ ] Ticket cards show skeleton placeholders during loading
- [ ] Skeletons match the shape/size of actual content
- [ ] Animated shimmer effect on skeletons
- [ ] Smooth transition from skeleton to real content

### UI/UX Considerations
- **Skeleton Design**: Light gray background (#E5E7EB)
- **Shimmer Animation**: Gradient sweep from left to right
- **Timing**: 1.5s animation duration, infinite loop
- **Shapes**: Rounded rectangles matching content blocks
- **Count**: Show 3-6 skeleton cards initially
- **Transition**: Fade in real content over 300ms

### Technical Notes
```typescript
const SkeletonCard = () => (
  <div className="bg-white border rounded-lg p-6 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
    <div className="flex gap-2 mt-4">
      <div className="h-6 bg-gray-200 rounded w-20"></div>
      <div className="h-6 bg-gray-200 rounded w-16"></div>
    </div>
  </div>
);

// Shimmer animation in CSS
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.animate-shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 1000px 100%;
  animation: shimmer 1.5s infinite;
}
```

### Dependencies
- Story 2.1 (module cards)
- Story 3.1 (ticket cards)

---

## Story 5.3: Implement Toast Notifications (P1)

**As a** user  
**I want** non-intrusive notifications for actions and errors  
**So that** I receive feedback without disrupting my workflow

### Acceptance Criteria
- [ ] Toast appears in top-right corner
- [ ] Auto-dismisses after 3-5 seconds
- [ ] Manual dismiss with X button
- [ ] Different styles for success, error, warning, info
- [ ] Stacks multiple toasts vertically
- [ ] Slide-in animation from right

### UI/UX Considerations
- **Position**: Fixed top-right, 24px from edges
- **Size**: Max-width 400px, auto height
- **Colors**:
  - Success: Green background, white text, checkmark icon
  - Error: Red background, white text, X icon
  - Warning: Yellow background, dark text, warning icon
  - Info: Blue background, white text, info icon
- **Animation**: Slide in from right (300ms), fade out (200ms)
- **Stacking**: 8px gap between toasts, max 3 visible
- **Duration**: 3s for success, 5s for errors, infinite for critical

### Technical Notes
```typescript
interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

const ToastContext = createContext<{
  showToast: (message: string, type: Toast['type'], duration?: number) => void;
}>({
  showToast: () => {}
});

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: Toast['type'], duration = 3000) => {
    const id = generateUniqueId();
    const toast: Toast = { id, type, message, duration };
    setToasts(prev => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map(toast => (
          <ToastComponent key={toast.id} toast={toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
```

### Dependencies
- None (global utility)

---

## Story 5.4: Add Smooth Page Transitions (P2)

**As a** user  
**I want** smooth transitions between different views  
**So that** the app feels fluid and professional

### Acceptance Criteria
- [ ] Fade transition when switching between input and results
- [ ] Slide transition when opening modals
- [ ] Smooth scroll to sections
- [ ] Loading state transitions
- [ ] No jarring layout shifts

### UI/UX Considerations
- **Fade Duration**: 300ms ease-in-out
- **Slide Duration**: 400ms ease-out
- **Scroll Duration**: 500ms smooth
- **Easing**: Use cubic-bezier for natural feel
- **Layout Stability**: Reserve space for loading content

### Technical Notes
```typescript
// Framer Motion for animations
import { motion, AnimatePresence } from 'framer-motion';

const PageTransition = ({ children }: { children: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

// Smooth scroll utility
const smoothScrollTo = (elementId: string) => {
  document.getElementById(elementId)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
};
```

### Dependencies
- All page components

---

## Story 5.5: Implement Dark Mode (P3)

**As a** user  
**I want** a dark mode option  
**So that** I can use the app comfortably in low-light environments

### Acceptance Criteria
- [ ] Toggle switch in header for dark/light mode
- [ ] Persists preference in localStorage
- [ ] Smooth transition between modes (300ms)
- [ ] All components support dark mode
- [ ] Respects system preference by default
- [ ] Proper contrast ratios for accessibility

### UI/UX Considerations
- **Toggle Design**: Moon/sun icon, smooth slide animation
- **Dark Colors**:
  - Background: #111827
  - Surface: #1F2937
  - Text: #F9FAFB
  - Borders: #374151
- **Transition**: All colors transition smoothly
- **Images**: Adjust opacity/filters for dark mode
- **Syntax Highlighting**: Dark-friendly code colors

### Technical Notes
```typescript
const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check localStorage
    const saved = localStorage.getItem('theme');
    if (saved) {
      setTheme(saved as 'light' | 'dark');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Tailwind dark mode classes
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
```

### Dependencies
- Story 5.1 (design system)

---

## Story 5.6: Add Keyboard Shortcuts (P2)

**As a** power user  
**I want** keyboard shortcuts for common actions  
**So that** I can navigate and use the app more efficiently

### Acceptance Criteria
- [ ] `/` to focus search input
- [ ] `Esc` to close modals/clear search
- [ ] `Ctrl/Cmd + K` to open command palette
- [ ] `Ctrl/Cmd + E` to export
- [ ] Arrow keys to navigate between tickets
- [ ] `?` to show keyboard shortcuts help

### UI/UX Considerations
- **Help Modal**: Triggered by `?`, shows all shortcuts
- **Visual Feedback**: Highlight focused elements
- **Conflicts**: Don't override browser shortcuts
- **Accessibility**: Ensure shortcuts work with screen readers
- **Hints**: Show keyboard hints on hover (e.g., "Press / to search")

### Technical Notes
```typescript
const useKeyboardShortcuts = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search
      if (e.key === '/' && !isInputFocused()) {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }

      // Close modals
      if (e.key === 'Escape') {
        closeAllModals();
      }

      // Command palette
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openCommandPalette();
      }

      // Export
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        triggerExport();
      }

      // Help
      if (e.key === '?' && !isInputFocused()) {
        e.preventDefault();
        showKeyboardHelp();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
};
```

### Dependencies
- All interactive components

---

## Story 5.7: Implement Progress Indicators (P1)

**As a** user  
**I want** clear progress indicators for long-running operations  
**So that** I know the system is working and how long to wait

### Acceptance Criteria
- [ ] Linear progress bar for sequential operations
- [ ] Circular spinner for indeterminate operations
- [ ] Step indicator for multi-step processes
- [ ] Percentage display for quantifiable progress
- [ ] Estimated time remaining (when possible)
- [ ] Cancel button for cancellable operations

### UI/UX Considerations
- **Linear Progress**: Full-width bar, blue fill, 4px height
- **Circular Spinner**: 24px diameter, rotating animation
- **Step Indicator**: Numbered circles connected by lines
- **Colors**: Blue for active, green for complete, gray for pending
- **Position**: Context-dependent (inline or overlay)
- **Animation**: Smooth, not distracting

### Technical Notes
```typescript
const ProgressBar = ({ progress, total }: { progress: number; total: number }) => {
  const percentage = (progress / total) * 100;
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
      <p className="text-sm text-gray-600 mt-1">
        {progress} of {total} ({Math.round(percentage)}%)
      </p>
    </div>
  );
};

const StepIndicator = ({ steps, currentStep }: { steps: string[]; currentStep: number }) => (
  <div className="flex items-center justify-between">
    {steps.map((step, index) => (
      <div key={step} className="flex items-center">
        <div className={`
          w-8 h-8 rounded-full flex items-center justify-center
          ${index < currentStep ? 'bg-green-500 text-white' : 
            index === currentStep ? 'bg-blue-500 text-white' : 
            'bg-gray-300 text-gray-600'}
        `}>
          {index < currentStep ? '✓' : index + 1}
        </div>
        {index < steps.length - 1 && (
          <div className={`h-1 w-16 ${index < currentStep ? 'bg-green-500' : 'bg-gray-300'}`} />
        )}
      </div>
    ))}
  </div>
);
```

### Dependencies
- Story 1.3 (loading states)
- Story 2.7 (module analysis progress)

---

## Story 5.8: Add Empty States & Illustrations (P2)

**As a** user  
**I want** helpful empty states with clear next actions  
**So that** I'm never confused about what to do

### Acceptance Criteria
- [ ] Empty state for no modules found
- [ ] Empty state for no tickets generated
- [ ] Empty state for no search results
- [ ] Each empty state has illustration or icon
- [ ] Clear call-to-action in each empty state
- [ ] Helpful tips or suggestions

### UI/UX Considerations
- **Layout**: Centered, vertical stack
- **Illustration**: Simple, friendly, on-brand
- **Heading**: Clear, empathetic (e.g., "No modules detected")
- **Description**: Explain why and what to do next
- **CTA Button**: Prominent, actionable
- **Colors**: Muted, not alarming

### Technical Notes
```typescript
const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action 
}: { 
  icon: ReactNode; 
  title: string; 
  description: string; 
  action?: { label: string; onClick: () => void } 
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="text-6xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 max-w-md mb-6">{description}</p>
    {action && (
      <button 
        onClick={action.onClick}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        {action.label}
      </button>
    )}
  </div>
);

// Usage
<EmptyState
  icon="🔍"
  title="No modules detected"
  description="We couldn't find any logical modules in this repository. Try analyzing a different repository with a clearer structure."
  action={{ label: "Try Another Repository", onClick: () => router.push('/') }}
/>
```

### Dependencies
- All list/grid views

---

## Story 5.9: Implement Tooltips & Help Text (P2)

**As a** user  
**I want** helpful tooltips and explanations  
**So that** I understand what each feature does

### Acceptance Criteria
- [ ] Tooltips on hover for icons and buttons
- [ ] Help text for complex features
- [ ] Info icons with expandable explanations
- [ ] Contextual help in modals
- [ ] Keyboard shortcut hints in tooltips
- [ ] Delay before showing tooltip (500ms)

### UI/UX Considerations
- **Tooltip Design**: Dark background, white text, small arrow
- **Position**: Above element by default, adjust if near edge
- **Delay**: 500ms hover before showing
- **Duration**: Stays visible while hovering
- **Content**: Concise, 1-2 sentences max
- **Accessibility**: Readable by screen readers

### Technical Notes
```typescript
const Tooltip = ({ 
  children, 
  content 
}: { 
  children: ReactNode; 
  content: string 
}) => {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = (e: React.MouseEvent) => {
    timeoutRef.current = setTimeout(() => {
      const rect = e.currentTarget.getBoundingClientRect();
      setPosition({ x: rect.left + rect.width / 2, y: rect.top });
      setShow(true);
    }, 500);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShow(false);
  };

  return (
    <div 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
      className="relative inline-block"
    >
      {children}
      {show && (
        <div 
          className="absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded shadow-lg"
          style={{ 
            left: position.x, 
            top: position.y - 40,
            transform: 'translateX(-50%)'
          }}
        >
          {content}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
            <div className="border-4 border-transparent border-t-gray-900" />
          </div>
        </div>
      )}
    </div>
  );
};
```

### Dependencies
- All interactive elements

---

## Story 5.10: Add Micro-interactions & Animations (P2)

**As a** user  
**I want** subtle animations and feedback  
**So that** the interface feels responsive and delightful

### Acceptance Criteria
- [ ] Button hover effects (scale, shadow)
- [ ] Card hover effects (lift, shadow)
- [ ] Input focus effects (border glow)
- [ ] Checkbox/toggle animations
- [ ] Success checkmark animation
- [ ] Loading spinner animation

### UI/UX Considerations
- **Timing**: Fast (100-200ms) for immediate feedback
- **Easing**: Natural curves (ease-out for entrances, ease-in for exits)
- **Scale**: Subtle (1.02-1.05x for hover)
- **Shadows**: Increase on hover/focus
- **Colors**: Smooth transitions (200ms)
- **Performance**: Use transform and opacity for smooth 60fps

### Technical Notes
```typescript
// Button hover effect
<button className="
  px-6 py-3 bg-blue-600 text-white rounded-lg
  transition-all duration-200
  hover:bg-blue-700 hover:scale-105 hover:shadow-lg
  active:scale-95
">
  Click Me
</button>

// Card hover effect
<div className="
  bg-white border rounded-lg p-6
  transition-all duration-300
  hover:shadow-xl hover:-translate-y-1
  cursor-pointer
">
  Card Content
</div>

// Input focus effect
<input className="
  border border-gray-300 rounded-lg px-4 py-2
  transition-all duration-200
  focus:border-blue-500 focus:ring-2 focus:ring-blue-200
  focus:outline-none
" />

// Success checkmark animation
@keyframes checkmark {
  0% { transform: scale(0) rotate(45deg); }
  50% { transform: scale(1.2) rotate(45deg); }
  100% { transform: scale(1) rotate(45deg); }
}

.checkmark {
  animation: checkmark 0.4s ease-out;
}
```

### Dependencies
- All interactive components

---

## Story 5.11: Implement Accessibility Features (P1)

**As a** user with accessibility needs  
**I want** the app to be fully accessible  
**So that** I can use it regardless of my abilities

### Acceptance Criteria
- [ ] All interactive elements are keyboard accessible
- [ ] Proper ARIA labels and roles
- [ ] Focus indicators are visible
- [ ] Color contrast meets WCAG AA standards
- [ ] Screen reader friendly
- [ ] Skip navigation links

### UI/UX Considerations
- **Focus Indicators**: 2px blue outline, visible on all elements
- **Color Contrast**: Minimum 4.5:1 for text, 3:1 for UI elements
- **ARIA Labels**: Descriptive labels for all interactive elements
- **Semantic HTML**: Use proper heading hierarchy, landmarks
- **Alt Text**: Descriptive alt text for all images
- **Keyboard Navigation**: Logical tab order, no keyboard traps

### Technical Notes
```typescript
// Accessible button
<button
  aria-label="Export tickets to CSV"
  className="focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  Export
</button>

// Accessible modal
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Modal Title</h2>
  <p id="modal-description">Modal description</p>
</div>

// Skip navigation
<a 
  href="#main-content" 
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
>
  Skip to main content
</a>

// Screen reader only text
<span className="sr-only">Loading tickets</span>
```

### Dependencies
- All components

---

## Story 5.12: Add Responsive Images & Icons (P2)

**As a** user  
**I want** crisp, well-sized images and icons  
**So that** the interface looks professional on all devices

### Acceptance Criteria
- [ ] Use SVG icons for scalability
- [ ] Consistent icon set throughout app
- [ ] Proper icon sizing (16px, 20px, 24px)
- [ ] Icons have proper spacing and alignment
- [ ] Loading states for images
- [ ] Fallback for missing images

### UI/UX Considerations
- **Icon Library**: Heroicons or Lucide React
- **Sizes**: Small (16px), Medium (20px), Large (24px), XL (32px)
- **Colors**: Inherit text color or use semantic colors
- **Spacing**: 8px gap between icon and text
- **Alignment**: Vertically centered with text
- **Loading**: Skeleton or spinner while loading

### Technical Notes
```typescript
import { CheckIcon, XMarkIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const IconButton = ({ icon: Icon, label }: { icon: any; label: string }) => (
  <button className="flex items-center gap-2 px-4 py-2">
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </button>
);

// Responsive image
<img
  src="/logo.png"
  srcSet="/logo.png 1x, /logo@2x.png 2x"
  alt="Curious Bob Logo"
  className="w-32 h-auto"
  loading="lazy"
/>
```

### Dependencies
- All components with icons/images