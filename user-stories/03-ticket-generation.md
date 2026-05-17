# Epic 3: Ticket Generation & Management

## Story 3.1: Display Generated Tickets List (P0)

**As a** user  
**I want** to see generated tickets in a clean, organized list  
**So that** I can review all actionable items for the selected module

### Acceptance Criteria
- [ ] Tickets appear below selected module in a dedicated section
- [ ] Section heading: "Generated Tickets for [Module Name] (X tickets)"
- [ ] Each ticket is a card in a vertical list
- [ ] Tickets load with staggered animation (similar to modules)
- [ ] Empty state if no tickets generated
- [ ] Smooth scroll to tickets section after generation

### UI/UX Considerations
- **Section Design**: Clear visual separation from modules (border-top, padding)
- **Heading**: Large (24px), bold, with module name highlighted
- **List Layout**: Vertical stack with 16px gaps between cards
- **Animation**: Slide in from right with 100ms stagger
- **Empty State**: "No tickets generated. Try analyzing a different module."
- **Scroll Behavior**: Smooth scroll with 500ms duration

### Technical Notes
```typescript
interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  estimatedHours: number;
  assignedTeam: string;
  tags: string[];
  files: string[];
}

// Smooth scroll to tickets
const scrollToTickets = () => {
  document.getElementById('tickets-section')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
};
```

### Dependencies
- Story 2.3 (module analysis returns ticket data)

---

## Story 3.2: Ticket Card Design & Content (P0)

**As a** user  
**I want** each ticket to clearly show its title, description, priority, and assignment  
**So that** I can quickly understand what work needs to be done

### Acceptance Criteria
- [ ] Ticket title is prominent (18px, bold)
- [ ] Priority badge shows in top-right (High/Medium/Low)
- [ ] Description shows below title (max 4 lines, expandable)
- [ ] Assigned team displays with icon
- [ ] Estimated hours shows with clock icon
- [ ] Tags display as small pills at bottom
- [ ] "View Details" button expands full description

### UI/UX Considerations
- **Card Design**: White background, border, rounded corners, hover shadow
- **Priority Colors**:
  - High: Red (#EF4444) badge with white text
  - Medium: Orange (#F97316) badge with white text
  - Low: Blue (#3B82F6) badge with white text
- **Typography**:
  - Title: 18px, font-weight: 600, line-height: 1.3
  - Description: 14px, font-weight: 400, line-height: 1.6, gray-700
- **Icons**: Use consistent icon set (Heroicons or Lucide)
- **Expandable**: "Read more" link if description > 4 lines

### Technical Notes
```typescript
const TicketCard = ({ ticket }: { ticket: Ticket }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold">{ticket.title}</h3>
        <PriorityBadge priority={ticket.priority} />
      </div>
      <p className={expanded ? '' : 'line-clamp-4'}>
        {ticket.description}
      </p>
      {ticket.description.length > 200 && (
        <button onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}
      <div className="flex gap-4 mt-4 text-sm text-gray-600">
        <span>👥 {ticket.assignedTeam}</span>
        <span>⏱️ {ticket.estimatedHours}h</span>
      </div>
    </div>
  );
};
```

### Dependencies
- Story 3.1 (ticket list container exists)

---

## Story 3.3: Ticket Priority Filtering (P1)

**As a** user  
**I want** to filter tickets by priority level  
**So that** I can focus on high-priority items first

### Acceptance Criteria
- [ ] Filter buttons appear above ticket list
- [ ] Three buttons: "All", "High", "Medium", "Low"
- [ ] Active filter button is highlighted
- [ ] Clicking filter shows only matching tickets
- [ ] Ticket count updates: "Showing X of Y tickets"
- [ ] Default: Show all tickets

### UI/UX Considerations
- **Button Group**: Horizontal row, connected buttons (no gap)
- **Active State**: Blue background, white text
- **Inactive State**: White background, gray text, gray border
- **Hover**: Light blue background on inactive buttons
- **Count Badge**: Small circle with number next to each filter label
- **Animation**: Filtered tickets fade out, remaining tickets reflow

### Technical Notes
```typescript
const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

const filteredTickets = tickets.filter(ticket => 
  priorityFilter === 'all' || ticket.priority === priorityFilter
);

const priorityCounts = {
  all: tickets.length,
  high: tickets.filter(t => t.priority === 'high').length,
  medium: tickets.filter(t => t.priority === 'medium').length,
  low: tickets.filter(t => t.priority === 'low').length
};
```

### Dependencies
- Story 3.2 (tickets display with priority)

---

## Story 3.4: Ticket Team Assignment Display (P0)

**As a** user  
**I want** to see which team is assigned to each ticket  
**So that** I know who should work on it

### Acceptance Criteria
- [ ] Team name displays prominently in ticket card
- [ ] Team icon/avatar shows next to name
- [ ] Color-coded by team (consistent across all tickets)
- [ ] Tooltip shows team description on hover
- [ ] Filter by team option in ticket list
- [ ] Team legend shows all teams with colors

### UI/UX Considerations
- **Team Colors**: Assign consistent colors to each team
  - Frontend: Blue (#3B82F6)
  - Backend: Green (#10B981)
  - DevOps: Purple (#8B5CF6)
  - QA: Orange (#F97316)
- **Avatar**: Circular icon with team initial
- **Position**: Below description, left side of card
- **Legend**: Collapsible sidebar or top section showing all teams
- **Filter**: Dropdown or button group similar to priority filter

### Technical Notes
```typescript
const teamConfig = {
  'Frontend Team': { color: '#3B82F6', icon: '🎨', description: 'UI/UX development' },
  'Backend Team': { color: '#10B981', icon: '⚙️', description: 'API and database' },
  'DevOps Team': { color: '#8B5CF6', icon: '🚀', description: 'Infrastructure' },
  'QA Team': { color: '#F97316', icon: '🔍', description: 'Testing and quality' }
};

const TeamBadge = ({ team }: { team: string }) => {
  const config = teamConfig[team];
  return (
    <div 
      className="flex items-center gap-2 px-3 py-1 rounded-full"
      style={{ backgroundColor: `${config.color}20`, color: config.color }}
    >
      <span>{config.icon}</span>
      <span className="font-medium">{team}</span>
    </div>
  );
};
```

### Dependencies
- Story 3.2 (ticket cards exist)

---

## Story 3.5: Ticket Sorting Options (P1)

**As a** user  
**I want** to sort tickets by different criteria  
**So that** I can organize them in the most useful way

### Acceptance Criteria
- [ ] Sort dropdown appears above ticket list
- [ ] Sort options: Priority (High→Low), Priority (Low→High), Hours (Most→Least), Hours (Least→Most), Alphabetical
- [ ] Default sort: Priority (High→Low)
- [ ] Tickets reorder with smooth animation
- [ ] Selected sort option is highlighted
- [ ] Sort persists when filtering

### UI/UX Considerations
- **Dropdown Design**: Minimal, right-aligned above tickets
- **Label**: "Sort by:" prefix before dropdown
- **Animation**: Tickets fade and reposition with 300ms stagger
- **Icon**: Up/down arrows indicating sort direction
- **Mobile**: Full-width dropdown on small screens

### Technical Notes
```typescript
type SortOption = 'priority-desc' | 'priority-asc' | 'hours-desc' | 'hours-asc' | 'alpha';

const sortTickets = (tickets: Ticket[], sortBy: SortOption): Ticket[] => {
  const sorted = [...tickets];
  switch (sortBy) {
    case 'priority-desc':
      return sorted.sort((a, b) => priorityValue[b.priority] - priorityValue[a.priority]);
    case 'priority-asc':
      return sorted.sort((a, b) => priorityValue[a.priority] - priorityValue[b.priority]);
    case 'hours-desc':
      return sorted.sort((a, b) => b.estimatedHours - a.estimatedHours);
    case 'hours-asc':
      return sorted.sort((a, b) => a.estimatedHours - b.estimatedHours);
    case 'alpha':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
  }
};

const priorityValue = { high: 3, medium: 2, low: 1 };
```

### Dependencies
- Story 3.2 (tickets display)

---

## Story 3.6: Ticket Detail Modal (P1)

**As a** user  
**I want** to click a ticket to see full details in a modal  
**So that** I can review all information without cluttering the list

### Acceptance Criteria
- [ ] Clicking ticket card opens modal overlay
- [ ] Modal shows full description (no truncation)
- [ ] Lists all affected files with syntax highlighting
- [ ] Shows all tags and metadata
- [ ] "Close" button and click-outside-to-close
- [ ] Keyboard navigation: ESC to close, arrow keys to navigate tickets

### UI/UX Considerations
- **Modal Design**: Centered, max-width 800px, white background
- **Overlay**: Semi-transparent black (rgba(0,0,0,0.5))
- **Animation**: Fade in overlay, scale up modal (300ms)
- **Close Button**: X in top-right corner, large touch target
- **Scrolling**: Modal content scrolls, overlay fixed
- **File List**: Monospace font, collapsible sections for long lists

### Technical Notes
```typescript
const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

const TicketModal = ({ ticket, onClose }: { ticket: Ticket; onClose: () => void }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8">
        {/* Modal content */}
      </div>
    </div>
  );
};
```

### Dependencies
- Story 3.2 (ticket cards clickable)

---

## Story 3.7: Ticket Editing Capability (P2)

**As a** user  
**I want** to edit ticket details before exporting  
**So that** I can customize them for my team's workflow

### Acceptance Criteria
- [ ] "Edit" button appears in ticket card
- [ ] Clicking opens inline edit mode or modal
- [ ] Can edit: title, description, priority, estimated hours
- [ ] Changes save to local state (not persisted)
- [ ] "Save" and "Cancel" buttons
- [ ] Visual indicator that ticket has been edited

### UI/UX Considerations
- **Edit Button**: Pencil icon, appears on hover
- **Edit Mode**: Card expands, fields become editable
- **Input Styling**: Clear borders, focus states
- **Save Button**: Green, prominent
- **Cancel Button**: Gray, secondary
- **Edited Indicator**: Small dot or badge showing "Edited"

### Technical Notes
```typescript
const [editingTicket, setEditingTicket] = useState<string | null>(null);
const [editedTickets, setEditedTickets] = useState<Map<string, Ticket>>(new Map());

const saveTicketEdit = (ticketId: string, updates: Partial<Ticket>) => {
  setEditedTickets(prev => {
    const next = new Map(prev);
    const original = tickets.find(t => t.id === ticketId)!;
    next.set(ticketId, { ...original, ...updates });
    return next;
  });
  setEditingTicket(null);
};
```

### Dependencies
- Story 3.2 (ticket cards exist)

---

## Story 3.8: Ticket Selection for Export (P0)

**As a** user  
**I want** to select which tickets to export  
**So that** I can export only relevant tickets

### Acceptance Criteria
- [ ] Checkbox appears on each ticket card
- [ ] "Select All" / "Deselect All" buttons above list
- [ ] Selected tickets have blue border highlight
- [ ] Selection count shows: "X tickets selected"
- [ ] "Export Selected" button appears when 1+ selected
- [ ] Default: All tickets selected

### UI/UX Considerations
- **Checkbox Position**: Top-left of ticket card
- **Checkbox Style**: Blue when checked, gray border when unchecked
- **Selected State**: 2px blue border around entire card
- **Bulk Actions**: Button group at top of list
- **Export Button**: Fixed at bottom-right of screen, blue, prominent
- **Count Badge**: Shows number on export button

### Technical Notes
```typescript
const [selectedTickets, setSelectedTickets] = useState<Set<string>>(
  new Set(tickets.map(t => t.id))
);

const toggleTicket = (ticketId: string) => {
  setSelectedTickets(prev => {
    const next = new Set(prev);
    if (next.has(ticketId)) {
      next.delete(ticketId);
    } else {
      next.add(ticketId);
    }
    return next;
  });
};

const selectAll = () => setSelectedTickets(new Set(tickets.map(t => t.id)));
const deselectAll = () => setSelectedTickets(new Set());
```

### Dependencies
- Story 3.2 (ticket cards exist)

---

## Story 3.9: Ticket Summary Statistics (P2)

**As a** user  
**I want** to see summary statistics for all tickets  
**So that** I can understand the overall scope of work

### Acceptance Criteria
- [ ] Summary panel shows above ticket list
- [ ] Displays: Total tickets, Total estimated hours, Tickets by priority, Tickets by team
- [ ] Visual charts: Pie chart for priority distribution, bar chart for team distribution
- [ ] Updates dynamically when filtering/sorting
- [ ] Collapsible panel to save space

### UI/UX Considerations
- **Panel Design**: Light gray background, rounded corners, padding
- **Layout**: Grid of stat cards (2x2 on desktop, 1 column on mobile)
- **Stat Cards**: Large number, small label, icon
- **Charts**: Simple, colorful, using team/priority colors
- **Collapse Button**: Chevron icon, "Show/Hide Summary"

### Technical Notes
```typescript
const calculateStats = (tickets: Ticket[]) => ({
  total: tickets.length,
  totalHours: tickets.reduce((sum, t) => sum + t.estimatedHours, 0),
  byPriority: {
    high: tickets.filter(t => t.priority === 'high').length,
    medium: tickets.filter(t => t.priority === 'medium').length,
    low: tickets.filter(t => t.priority === 'low').length
  },
  byTeam: tickets.reduce((acc, t) => {
    acc[t.assignedTeam] = (acc[t.assignedTeam] || 0) + 1;
    return acc;
  }, {} as Record<string, number>)
});
```

### Dependencies
- Story 3.2 (ticket data available)

---

## Story 3.10: Ticket Search Functionality (P2)

**As a** user  
**I want** to search tickets by title or description  
**So that** I can quickly find specific tickets

### Acceptance Criteria
- [ ] Search input appears above ticket list
- [ ] Real-time search with 300ms debounce
- [ ] Searches title, description, and tags
- [ ] Case-insensitive matching
- [ ] Highlights matching text in results
- [ ] Shows "No tickets match your search" if empty

### UI/UX Considerations
- **Search Input**: Full-width, search icon on left, clear button on right
- **Placeholder**: "Search tickets by title, description, or tags..."
- **Highlighting**: Yellow background on matching text
- **Results Count**: "Showing X of Y tickets"
- **Clear Button**: X icon, only visible when text entered

### Technical Notes
```typescript
const [searchQuery, setSearchQuery] = useState('');

const searchTickets = (tickets: Ticket[], query: string): Ticket[] => {
  if (!query) return tickets;
  const lowerQuery = query.toLowerCase();
  return tickets.filter(ticket =>
    ticket.title.toLowerCase().includes(lowerQuery) ||
    ticket.description.toLowerCase().includes(lowerQuery) ||
    ticket.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

// Debounced search
const debouncedSearch = useMemo(
  () => debounce((query: string) => setSearchQuery(query), 300),
  []
);
```

### Dependencies
- Story 3.2 (tickets display)