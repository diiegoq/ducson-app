# Epic 2: Module Discovery & Display

## Story 2.1: Display Module Cards Grid (P0)

**As a** user  
**I want** to see detected modules in an attractive, scannable grid layout  
**So that** I can quickly understand the repository structure at a glance

### Acceptance Criteria
- [ ] Modules display in a responsive grid (2-3 columns on desktop, 1 on mobile)
- [ ] Each module is a card with clear visual hierarchy
- [ ] Cards have consistent height or use masonry layout
- [ ] Grid appears with staggered fade-in animation (100ms delay between cards)
- [ ] Heading above grid: "Detected Modules (X found)"
- [ ] Empty state message if no modules found

### UI/UX Considerations
- **Grid Layout**: CSS Grid with `grid-template-columns: repeat(auto-fit, minmax(320px, 1fr))`
- **Card Design**: White background, border, rounded corners (8px), shadow on hover
- **Animation**: Fade in from bottom with `opacity` and `translateY` transitions
- **Spacing**: 24px gap between cards, 48px margin from top
- **Empty State**: Centered message with icon, "No modules detected. Try a different repository."

### Technical Notes
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {modules.map((module, index) => (
    <div 
      key={module.name}
      className="animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <ModuleCard module={module} />
    </div>
  ))}
</div>
```

### Dependencies
- Story 1.3 (API returns module data)

---

## Story 2.2: Module Card Content & Hierarchy (P0)

**As a** user  
**I want** each module card to clearly show its name, purpose, and file count  
**So that** I can understand what each module does without clicking

### Acceptance Criteria
- [ ] Module name is displayed as card heading (20px, bold)
- [ ] Module description shows below name (14px, 2-3 lines max)
- [ ] File count badge shows number of files (e.g., "12 files")
- [ ] Technology tags display if available (e.g., "React", "TypeScript")
- [ ] "Analyze Module" button at bottom of card
- [ ] Card has subtle hover effect (lift + shadow)

### UI/UX Considerations
- **Typography Hierarchy**:
  - Module name: 20px, font-weight: 600, line-height: 1.2
  - Description: 14px, font-weight: 400, line-height: 1.5, color: gray-600
  - File count: 12px, font-weight: 500, color: gray-500
- **Badge Design**: Rounded pill shape, light gray background, dark text
- **Button**: Full-width, secondary style (outlined), hover effect
- **Truncation**: Description truncates with ellipsis after 3 lines

### Technical Notes
```typescript
interface ModuleCardProps {
  module: {
    name: string;
    description: string;
    fileCount: number;
    technologies?: string[];
    files: string[];
  };
}

// CSS for line clamping
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

### Dependencies
- Story 2.1 (card container exists)

---

## Story 2.3: Module Selection Interaction (P0)

**As a** user  
**I want** to click on a module card to analyze it in detail  
**So that** I can generate tickets for that specific module

### Acceptance Criteria
- [ ] Clicking "Analyze Module" button triggers module analysis
- [ ] Card shows loading state (spinner, disabled button)
- [ ] Button text changes to "Analyzing..."
- [ ] Other cards remain visible but slightly dimmed (opacity: 0.5)
- [ ] Loading state persists until ticket data received
- [ ] Error state shows if analysis fails

### UI/UX Considerations
- **Active State**: Selected card has blue border (2px solid)
- **Loading Spinner**: Small spinner icon next to "Analyzing..." text
- **Dimming Effect**: Smooth 300ms opacity transition on other cards
- **Focus Management**: Scroll to tickets section when loaded
- **Error Recovery**: Show error in card, allow retry

### Technical Notes
```typescript
const [selectedModule, setSelectedModule] = useState<string | null>(null);
const [loadingModule, setLoadingModule] = useState<string | null>(null);

const handleAnalyzeModule = async (module: Module) => {
  setLoadingModule(module.name);
  try {
    const response = await fetch('/api/module', {
      method: 'POST',
      body: JSON.stringify({ module })
    });
    const tickets = await response.json();
    setSelectedModule(module.name);
    // Scroll to tickets section
  } catch (error) {
    setError(`Failed to analyze ${module.name}`);
  } finally {
    setLoadingModule(null);
  }
};
```

### Dependencies
- Story 2.2 (button exists in card)

---

## Story 2.4: Module File List Preview (P1)

**As a** user  
**I want** to see which files are included in each module  
**So that** I can verify the module detection is accurate

### Acceptance Criteria
- [ ] Expandable "View Files" section in each card
- [ ] Clicking expands to show file list (max 10 files)
- [ ] Files display with syntax highlighting for file type
- [ ] If more than 10 files, show "... and X more files"
- [ ] Collapse/expand with smooth animation
- [ ] File paths are truncated if too long

### UI/UX Considerations
- **Expand/Collapse**: Chevron icon rotates 180° when expanded
- **File List**: Monospace font, 12px, gray background
- **File Icons**: Show appropriate icon for file type (JS, TS, CSS, etc.)
- **Animation**: Max-height transition with 300ms ease-in-out
- **Truncation**: Show ".../" for long paths, keep filename visible

### Technical Notes
```typescript
const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

const toggleExpanded = (moduleName: string) => {
  setExpandedModules(prev => {
    const next = new Set(prev);
    if (next.has(moduleName)) {
      next.delete(moduleName);
    } else {
      next.add(moduleName);
    }
    return next;
  });
};
```

### Dependencies
- Story 2.2 (card content exists)

---

## Story 2.5: Module Filtering & Search (P2)

**As a** user  
**I want** to filter modules by name or technology  
**So that** I can quickly find specific modules in large repositories

### Acceptance Criteria
- [ ] Search input appears above module grid
- [ ] Typing filters modules in real-time (debounced 300ms)
- [ ] Filter by module name or description (case-insensitive)
- [ ] Technology filter chips below search (if technologies detected)
- [ ] Clicking chip filters to only modules with that technology
- [ ] Clear filters button appears when filters active

### UI/UX Considerations
- **Search Input**: Icon on left, clear button on right when text entered
- **Filter Chips**: Rounded pills, toggle on/off, blue when active
- **Results Count**: Update "Detected Modules (X of Y shown)" dynamically
- **No Results**: Show message "No modules match your filters"
- **Animation**: Filtered-out cards fade out, remaining cards reflow

### Technical Notes
```typescript
const [searchTerm, setSearchTerm] = useState('');
const [selectedTechs, setSelectedTechs] = useState<Set<string>>(new Set());

const filteredModules = modules.filter(module => {
  const matchesSearch = module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       module.description.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesTech = selectedTechs.size === 0 || 
                     module.technologies?.some(tech => selectedTechs.has(tech));
  return matchesSearch && matchesTech;
});
```

### Dependencies
- Story 2.1 (module grid exists)

---

## Story 2.6: Module Complexity Indicators (P2)

**As a** user  
**I want** to see visual indicators of module complexity  
**So that** I can prioritize which modules to analyze first

### Acceptance Criteria
- [ ] Each card shows complexity badge (Low, Medium, High)
- [ ] Complexity based on file count and estimated lines of code
- [ ] Color-coded: Green (Low), Yellow (Medium), Red (High)
- [ ] Tooltip explains complexity calculation on hover
- [ ] Sort option: "Sort by Complexity" dropdown
- [ ] Default sort: Alphabetical by name

### UI/UX Considerations
- **Badge Position**: Top-right corner of card
- **Colors**: 
  - Low: Green (#10B981) background, dark green text
  - Medium: Yellow (#F59E0B) background, dark yellow text
  - High: Red (#EF4444) background, dark red text
- **Tooltip**: Small popup on hover, 200ms delay
- **Sort Dropdown**: Top-right of grid, minimal design

### Technical Notes
```typescript
const calculateComplexity = (module: Module): 'low' | 'medium' | 'high' => {
  const fileCount = module.fileCount;
  if (fileCount < 5) return 'low';
  if (fileCount < 15) return 'medium';
  return 'high';
};

const complexityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800'
};
```

### Dependencies
- Story 2.2 (card design exists)

---

## Story 2.7: Module Analysis Progress Indicator (P1)

**As a** user  
**I want** to see overall progress when analyzing multiple modules  
**So that** I know how much work remains

### Acceptance Criteria
- [ ] Progress bar appears when analyzing modules
- [ ] Shows "Analyzing X of Y modules"
- [ ] Progress bar fills as modules complete
- [ ] Individual module cards show checkmark when complete
- [ ] Failed modules show error icon
- [ ] "Analyze All Modules" button option (batch analysis)

### UI/UX Considerations
- **Progress Bar**: Full-width, blue fill, 8px height, rounded
- **Position**: Sticky at top of viewport during analysis
- **Percentage**: Display "45%" inside or next to bar
- **Checkmark**: Green circle with white checkmark icon
- **Error Icon**: Red circle with white X icon
- **Animation**: Smooth progress bar fill with 500ms transition

### Technical Notes
```typescript
const [analyzedCount, setAnalyzedCount] = useState(0);
const totalModules = modules.length;
const progress = (analyzedCount / totalModules) * 100;

const analyzeAllModules = async () => {
  for (const module of modules) {
    await analyzeModule(module);
    setAnalyzedCount(prev => prev + 1);
  }
};
```

### Dependencies
- Story 2.3 (module analysis works)

---

## Story 2.8: Module Comparison View (P3)

**As a** user  
**I want** to compare multiple modules side-by-side  
**So that** I can understand relationships and dependencies

### Acceptance Criteria
- [ ] "Compare" checkbox appears on each module card
- [ ] Select 2-3 modules to compare
- [ ] "Compare Selected" button appears when 2+ selected
- [ ] Comparison view shows modules in columns
- [ ] Highlights common files/technologies
- [ ] Shows dependency relationships if detected

### UI/UX Considerations
- **Checkbox**: Top-left of card, blue when checked
- **Compare Button**: Fixed at bottom of screen, slides up when active
- **Comparison Layout**: Side-by-side columns, equal width
- **Common Elements**: Highlighted in yellow background
- **Exit Comparison**: "Back to Grid" button at top

### Technical Notes
```typescript
const [selectedForComparison, setSelectedForComparison] = useState<Set<string>>(new Set());

const compareModules = () => {
  const modulesToCompare = modules.filter(m => 
    selectedForComparison.has(m.name)
  );
  // Show comparison view
};
```

### Dependencies
- Story 2.2 (module cards exist)
- Story 2.4 (file lists available)