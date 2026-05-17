# UI Mockups & Visual Design Specifications

This document provides detailed visual specifications and ASCII mockups for key screens.

## Design Principles

1. **Clarity**: Information hierarchy is clear and scannable
2. **Consistency**: Patterns repeat across the interface
3. **Feedback**: Every action has immediate visual feedback
4. **Efficiency**: Common tasks require minimal clicks
5. **Beauty**: Professional, modern aesthetic

---

## Color Palette

### Primary Colors
```
Primary Blue:    #3B82F6  ████  (Buttons, links, active states)
Primary Dark:    #2563EB  ████  (Hover states)
Primary Light:   #DBEAFE  ████  (Backgrounds, highlights)
```

### Semantic Colors
```
Success Green:   #10B981  ████  (Success states, completed)
Warning Yellow:  #F59E0B  ████  (Warnings, medium priority)
Error Red:       #EF4444  ████  (Errors, high priority)
Info Blue:       #3B82F6  ████  (Information, low priority)
```

### Neutral Colors
```
Gray 50:         #F9FAFB  ████  (Page background)
Gray 100:        #F3F4F6  ████  (Card backgrounds)
Gray 200:        #E5E7EB  ████  (Borders, dividers)
Gray 600:        #4B5563  ████  (Secondary text)
Gray 900:        #111827  ████  (Primary text)
```

---

## Screen 1: Landing Page / Repository Input

```
┌─────────────────────────────────────────────────────────────────┐
│  🤖 Curious Bob                                    [Dark Mode 🌙] │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│                                                                   │
│              Analyze GitHub Repositories with AI                 │
│                                                                   │
│         Generate actionable engineering tickets from              │
│              legacy codebases in minutes                          │
│                                                                   │
│   ┌───────────────────────────────────────────────────────┐     │
│   │  Enter GitHub repository URL                          │     │
│   │  https://github.com/vercel/next.js              [✓]   │     │
│   └───────────────────────────────────────────────────────┘     │
│                                                                   │
│                  [ Analyze Repository ]                          │
│                                                                   │
│                                                                   │
│                    Try an example:                               │
│                                                                   │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│   │ 🎨 Next.js  │  │ ⚛️  React   │  │ 🚀 Express  │            │
│   │ 120k ⭐     │  │ 220k ⭐     │  │ 64k ⭐      │            │
│   │ Click to    │  │ Click to    │  │ Click to    │            │
│   │ analyze     │  │ analyze     │  │ analyze     │            │
│   └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Visual Specifications

**Hero Section**
- Background: Gradient from `#F9FAFB` to `#FFFFFF`
- Heading: 48px, font-weight: 700, color: `#111827`
- Subheading: 20px, font-weight: 400, color: `#4B5563`
- Vertical spacing: 64px from top

**Input Field**
- Width: 600px (max-width on desktop)
- Height: 56px
- Border: 2px solid `#E5E7EB`
- Border radius: 12px
- Font size: 18px
- Padding: 16px 20px
- Focus state: Border `#3B82F6`, shadow `0 0 0 3px rgba(59, 130, 246, 0.1)`
- Valid state: Green checkmark icon on right

**Analyze Button**
- Width: 240px
- Height: 56px
- Background: `#3B82F6`
- Color: `#FFFFFF`
- Border radius: 12px
- Font size: 18px, font-weight: 600
- Hover: Background `#2563EB`, scale 1.02
- Active: Scale 0.98
- Disabled: Background `#E5E7EB`, color `#9CA3AF`, cursor not-allowed

**Example Cards**
- Width: 200px each
- Height: 140px
- Background: `#FFFFFF`
- Border: 1px solid `#E5E7EB`
- Border radius: 12px
- Padding: 20px
- Hover: Shadow `0 10px 15px rgba(0,0,0,0.1)`, translateY -2px
- Gap: 16px between cards

---

## Screen 2: Module Discovery

```
┌─────────────────────────────────────────────────────────────────┐
│  🤖 Curious Bob                    [Search] [Export] [Dark 🌙]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ← Back to Input                                                 │
│                                                                   │
│  📦 vercel/next.js                                               │
│  Detected Modules (5 found)                                      │
│                                                                   │
│  [All] [Frontend] [Backend] [DevOps]    Sort by: Priority ▼     │
│                                                                   │
│  ┌──────────────────────┐  ┌──────────────────────┐            │
│  │ 🎨 Authentication    │  │ 📊 Data Layer        │            │
│  │ Module          [🔴] │  │ Module          [🟡] │            │
│  │                      │  │                      │            │
│  │ Handles user auth,   │  │ Database access,     │            │
│  │ session management,  │  │ ORM configuration,   │            │
│  │ and OAuth flows      │  │ and migrations       │            │
│  │                      │  │                      │            │
│  │ 👥 Frontend Team     │  │ 👥 Backend Team      │            │
│  │ ⏱️  8 hours          │  │ ⏱️  12 hours         │            │
│  │ 📁 15 files          │  │ 📁 22 files          │            │
│  │                      │  │                      │            │
│  │ [TypeScript] [React] │  │ [PostgreSQL] [Prisma]│            │
│  │                      │  │                      │            │
│  │  [ Analyze Module ]  │  │  [ Analyze Module ]  │            │
│  └──────────────────────┘  └──────────────────────┘            │
│                                                                   │
│  ┌──────────────────────┐  ┌──────────────────────┐            │
│  │ 🚀 API Routes        │  │ 🎨 UI Components     │            │
│  │ Module          [🟢] │  │ Module          [🟡] │            │
│  │ ...                  │  │ ...                  │            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Visual Specifications

**Module Grid**
- Grid: `repeat(auto-fit, minmax(320px, 1fr))`
- Gap: 24px
- Margin: 48px from top

**Module Card**
- Background: `#FFFFFF`
- Border: 1px solid `#E5E7EB`
- Border radius: 12px
- Padding: 24px
- Min-height: 280px
- Hover: Shadow `0 10px 15px rgba(0,0,0,0.1)`, translateY -4px

**Complexity Badge** (Top-right)
- High 🔴: Background `#FEE2E2`, color `#991B1B`
- Medium 🟡: Background `#FEF3C7`, color `#92400E`
- Low 🟢: Background `#D1FAE5`, color `#065F46`
- Size: 8px circle
- Position: Absolute top-right, 16px from edges

**Module Name**
- Font size: 20px
- Font weight: 600
- Color: `#111827`
- Margin bottom: 12px

**Description**
- Font size: 14px
- Line height: 1.6
- Color: `#4B5563`
- Max lines: 3 (line-clamp)
- Margin bottom: 16px

**Metadata Row**
- Display: Flex, gap 16px
- Font size: 13px
- Color: `#6B7280`
- Icons: 16px, aligned with text

**Technology Tags**
- Display: Inline-flex, gap 8px
- Background: `#F3F4F6`
- Color: `#374151`
- Padding: 4px 12px
- Border radius: 16px (pill)
- Font size: 12px
- Margin top: 16px

**Analyze Button**
- Width: 100%
- Height: 40px
- Background: Transparent
- Border: 2px solid `#3B82F6`
- Color: `#3B82F6`
- Border radius: 8px
- Font weight: 600
- Hover: Background `#3B82F6`, color `#FFFFFF`

---

## Screen 3: Ticket Generation

```
┌─────────────────────────────────────────────────────────────────┐
│  🤖 Curious Bob                    [Search] [Export] [Dark 🌙]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ← Back to Modules                                               │
│                                                                   │
│  📦 vercel/next.js > 🎨 Authentication Module                    │
│  Generated Tickets (12 tickets)                                  │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  📊 Summary                                              │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │   │
│  │  Total: 12 tickets  |  Hours: 48h  |  🔴 4  🟡 5  🟢 3  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  [☑ Select All] [☐ Deselect All]                                │
│  Filter: [All] [High] [Medium] [Low]    Sort: Priority ▼        │
│  🔍 Search tickets...                                            │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ☑  Implement OAuth 2.0 Flow                        [🔴] │   │
│  │                                                          │   │
│  │  Add OAuth 2.0 authentication flow with support for     │   │
│  │  Google, GitHub, and Microsoft providers. Include       │   │
│  │  token refresh logic and secure session management.     │   │
│  │                                                          │   │
│  │  👥 Frontend Team  |  ⏱️ 8 hours  |  📁 5 files         │   │
│  │  [OAuth] [Security] [TypeScript]                        │   │
│  │                                                          │   │
│  │  [ View Details ]                                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ☑  Add Session Timeout Handling                    [🟡] │   │
│  │                                                          │   │
│  │  Implement automatic session timeout after 30 minutes   │   │
│  │  of inactivity. Show warning modal 5 minutes before...  │   │
│  │                                                          │   │
│  │  👥 Frontend Team  |  ⏱️ 4 hours  |  📁 3 files         │   │
│  │  [Session] [UX] [React]                                 │   │
│  │                                                          │   │
│  │  [ View Details ]                                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│                                                                   │
│                    [ 📥 Export Selected (12) ]                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Visual Specifications

**Summary Panel**
- Background: `#F9FAFB`
- Border: 1px solid `#E5E7EB`
- Border radius: 12px
- Padding: 24px
- Margin bottom: 32px

**Summary Stats**
- Display: Flex, justify-content: space-between
- Font size: 16px
- Font weight: 600
- Color: `#111827`

**Filter/Sort Bar**
- Display: Flex, justify-content: space-between
- Margin bottom: 24px
- Gap: 16px

**Filter Buttons**
- Display: Inline-flex, gap 8px
- Height: 40px
- Padding: 0 16px
- Border radius: 8px
- Font size: 14px
- Font weight: 500
- Active: Background `#3B82F6`, color `#FFFFFF`
- Inactive: Background `#FFFFFF`, border `1px solid #E5E7EB`, color `#4B5563`

**Search Input**
- Width: 300px
- Height: 40px
- Border: 1px solid `#E5E7EB`
- Border radius: 8px
- Padding: 0 16px 0 40px (space for icon)
- Font size: 14px

**Ticket Card**
- Background: `#FFFFFF`
- Border: 2px solid `#E5E7EB`
- Border radius: 12px
- Padding: 24px
- Margin bottom: 16px
- Selected: Border color `#3B82F6`

**Checkbox**
- Size: 20px
- Border: 2px solid `#D1D5DB`
- Border radius: 4px
- Checked: Background `#3B82F6`, white checkmark

**Priority Badge** (Top-right)
- High 🔴: Background `#FEE2E2`, color `#991B1B`, text "HIGH"
- Medium 🟡: Background `#FEF3C7`, color `#92400E`, text "MEDIUM"
- Low 🟢: Background `#D1FAE5`, color `#065F46`, text "LOW"
- Padding: 4px 12px
- Border radius: 12px
- Font size: 11px
- Font weight: 700
- Letter spacing: 0.5px

**Ticket Title**
- Font size: 18px
- Font weight: 600
- Color: `#111827`
- Margin bottom: 12px

**Ticket Description**
- Font size: 14px
- Line height: 1.6
- Color: `#4B5563`
- Max lines: 3 (expandable)
- Margin bottom: 16px

**Metadata Row**
- Display: Flex, gap 24px
- Font size: 13px
- Color: `#6B7280`
- Margin bottom: 12px

**Tags**
- Display: Inline-flex, gap 8px
- Background: `#F3F4F6`
- Color: `#374151`
- Padding: 4px 10px
- Border radius: 12px
- Font size: 11px
- Font weight: 500

**Export Button** (Fixed bottom-right)
- Position: Fixed, bottom 32px, right 32px
- Width: 200px
- Height: 56px
- Background: `#3B82F6`
- Color: `#FFFFFF`
- Border radius: 28px (pill)
- Font size: 16px
- Font weight: 600
- Shadow: `0 10px 25px rgba(59, 130, 246, 0.3)`
- Hover: Background `#2563EB`, scale 1.05

---

## Screen 4: Export Modal

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│   ┌───────────────────────────────────────────────────────┐     │
│   │  Export Tickets                                    [✕] │     │
│   ├───────────────────────────────────────────────────────┤     │
│   │                                                        │     │
│   │  12 tickets selected                                  │     │
│   │                                                        │     │
│   │  Format:                                              │     │
│   │  ○ CSV (Recommended)                                  │     │
│   │  ○ JSON                                               │     │
│   │  ○ Markdown                                           │     │
│   │                                                        │     │
│   │  Include:                                             │     │
│   │  ☑ Title                                              │     │
│   │  ☑ Description                                        │     │
│   │  ☑ Priority                                           │     │
│   │  ☑ Estimated Hours                                    │     │
│   │  ☑ Assigned Team                                      │     │
│   │  ☑ Tags                                               │     │
│   │  ☑ File List                                          │     │
│   │                                                        │     │
│   │  ┌────────────────────────────────────────────────┐  │     │
│   │  │  Preview (first 3 tickets)                     │  │     │
│   │  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │  │     │
│   │  │  Title,Description,Priority,Hours,Team...      │  │     │
│   │  │  "Implement OAuth 2.0","Add OAuth...","High"...│  │     │
│   │  │  "Add Session Timeout","Implement...","Med"... │  │     │
│   │  │  ...                                            │  │     │
│   │  └────────────────────────────────────────────────┘  │     │
│   │                                                        │     │
│   │              [ Cancel ]  [ Download CSV ]             │     │
│   │                                                        │     │
│   └───────────────────────────────────────────────────────┘     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Visual Specifications

**Modal Overlay**
- Background: `rgba(0, 0, 0, 0.5)`
- Backdrop blur: 4px
- Z-index: 50

**Modal Container**
- Width: 600px
- Max-height: 80vh
- Background: `#FFFFFF`
- Border radius: 16px
- Padding: 32px
- Shadow: `0 20px 25px rgba(0,0,0,0.15)`

**Modal Header**
- Font size: 24px
- Font weight: 700
- Color: `#111827`
- Margin bottom: 24px
- Close button: 24px, top-right, hover background `#F3F4F6`

**Radio Buttons**
- Size: 20px
- Border: 2px solid `#D1D5DB`
- Selected: Border `#3B82F6`, inner circle `#3B82F6`
- Label: 16px, margin-left 12px

**Checkboxes**
- Size: 18px
- Border: 2px solid `#D1D5DB`
- Checked: Background `#3B82F6`, white checkmark
- Label: 14px, margin-left 10px

**Preview Box**
- Background: `#F9FAFB`
- Border: 1px solid `#E5E7EB`
- Border radius: 8px
- Padding: 16px
- Font family: Monospace
- Font size: 12px
- Max-height: 200px
- Overflow: Auto

**Action Buttons**
- Display: Flex, gap 12px, justify-content: flex-end
- Cancel: Background `#FFFFFF`, border `1px solid #E5E7EB`, color `#4B5563`
- Download: Background `#3B82F6`, color `#FFFFFF`
- Height: 44px
- Padding: 0 24px
- Border radius: 8px
- Font weight: 600

---

## Responsive Breakpoints

### Mobile (< 768px)
- Single column layout
- Full-width cards
- Stacked filters
- Bottom sheet modals
- Larger touch targets (44px min)

### Tablet (768px - 1024px)
- 2-column grid for modules
- 1-column for tickets
- Side-by-side filters
- Standard modals

### Desktop (> 1024px)
- 3-column grid for modules
- 1-column for tickets (better readability)
- All filters inline
- Large modals

---

## Animation Specifications

### Page Transitions
```css
.fade-in {
  animation: fadeIn 300ms ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Card Hover
```css
.card {
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px rgba(0,0,0,0.1);
}
```

### Button Press
```css
.button {
  transition: transform 100ms ease-out;
}

.button:active {
  transform: scale(0.98);
}
```

### Loading Skeleton
```css
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 1000px 100%;
  animation: shimmer 1.5s infinite;
}
```

---

## Accessibility Specifications

### Focus States
- Outline: 2px solid `#3B82F6`
- Offset: 2px
- Border radius: Matches element

### Color Contrast
- Text on white: Minimum 4.5:1 (WCAG AA)
- Large text: Minimum 3:1
- UI elements: Minimum 3:1

### Touch Targets
- Minimum size: 44x44px
- Spacing: 8px between targets

### Screen Reader
- All images have alt text
- All buttons have aria-labels
- Form inputs have labels
- Modals have aria-modal and role="dialog"