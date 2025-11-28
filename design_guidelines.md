# Design Guidelines: Bloomberg Terminal Style Data Console

## Design Approach

**Selected Framework:** Bloomberg Terminal / High-End Data Terminal
**Rationale:** Professional-grade data interface with monospace typography, dark theme, command-driven navigation, and information-dense layouts.

**Core Principles:**
- Dark theme by default (Bloomberg-style navy/charcoal)
- Monospace typography for data clarity
- Command palette (CMD+K) for power-user navigation
- Information density prioritized
- Status indicators and live data feel

## Typography System

**Font Family:** JetBrains Mono / Fira Code (monospace)
- All text uses monospace for terminal aesthetic
- Uppercase for labels and headers
- Letter-spacing: tracking-wider for labels

**Type Scale:**
- Page Title: text-sm font-semibold tracking-tight
- Section Headers: text-xs uppercase tracking-wider
- Body/Data: text-xs to text-sm
- Meta Info: text-[10px] uppercase tracking-wider

## Color System

**Primary Palette:**
- Background: Deep navy (#0a0d12)
- Foreground: Warm off-white (#e5e3dc)
- Primary (accent): Terminal green (#22c55e)
- Secondary: Muted navy (#1c2330)
- Accent: Amber/orange (#f59e0b)
- Destructive: Terminal red (#ef4444)

**Status Colors:**
- Active/Online/Completed: Primary green
- Pending/In Progress: Accent amber
- Inactive/Error: Destructive red

## Layout System

**Spacing Primitives:** Compact for data density
- Component padding: p-3 to p-4
- Section spacing: space-y-3 to space-y-4
- Card gaps: gap-3
- Minimal margins

**Grid System:**
- Mobile: Single column (grid-cols-1)
- Tablet: 2 columns (sm:grid-cols-2)
- Desktop: 3 columns (lg:grid-cols-3)
- Table view: Full-width with horizontal scroll

## Component Library

### Terminal Header
- Height: h-12 (compact)
- Fixed position with backdrop blur
- Logo/title with version number
- CMD button with keyboard shortcut hint
- Refresh button with loading animation
- Sync timestamp display

### Command Palette (CMD+K)
- Opens with CMD+K or CTRL+K
- Search/filter data
- Quick commands (Refresh, Toggle View, Sort)
- Navigate to records
- Keyboard shortcut hints

### Terminal Data Cards
- Compact padding: p-3
- Row index prefix: #001, #002, etc.
- Primary field highlighted in green
- Status badges with colored borders
- Monospace throughout

### Terminal Data Table
- Row numbers column
- Uppercase column headers
- Zebra striping with subtle hover
- Sortable columns with arrow indicators
- Status badges inline

### Terminal Footer
- Fixed bottom position
- Connection status indicator (LIVE/SYNCING/OFFLINE)
- Record count display
- View toggle (Grid/Table)
- Timestamp

### Loading States
- Animated dots for splash screen
- Skeleton cards with terminal styling
- Terminal icon with "INITIALIZING..." text

### Empty States
- Terminal icons
- Error codes as titles (NO_DATA_FOUND, QUERY_EMPTY)
- Comment-style descriptions (// prefix)
- Action buttons with uppercase labels

## Keyboard Shortcuts

- **CMD+K / CTRL+K**: Open command palette
- **R**: Refresh data
- **V**: Toggle view (cards/table)

## Status Indicators

**Connection Status:**
- LIVE (green): Connected and synced
- SYNCING (amber): Loading data
- OFFLINE (red): Connection error

**Data Status Badges:**
- Green border/bg: active, completed, done, approved, live, online
- Amber border/bg: pending, in progress, draft
- Red border/bg: cancelled, rejected, inactive, offline

## Mobile Optimizations

- Cards view default on mobile
- Touch-friendly tap targets
- Swipe gestures for navigation
- Compact header with essential controls
- Bottom status bar always visible

## Interaction Patterns

- Hover states with subtle elevation
- Click rows/cards to open detail modal
- Copy to clipboard in detail view
- External link indicators
- Toast notifications for actions

This design creates a high-end, Bloomberg-terminal-inspired data console that feels professional and powerful for creative teams managing client and project data.
