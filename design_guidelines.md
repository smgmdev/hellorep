# Design Guidelines: Creative Data Console

## Design Approach

**Selected Framework:** Design System Approach inspired by Linear and Notion
**Rationale:** This is a utility-focused data tool requiring efficiency, clarity, and mobile optimization. Drawing from Linear's clean data presentation and Notion's intuitive information hierarchy.

**Core Principles:**
- Mobile-first design with touch-optimized interactions
- Data clarity over decorative elements
- Fast scanning and comprehension
- Professional aesthetic suitable for creative teams

## Typography System

**Font Family:** Inter (Google Fonts) - optimized for screens and data display
- Headings: Inter 600 (Semibold)
- Body: Inter 400 (Regular)
- Data/Numbers: Inter 500 (Medium) - for emphasis in tables

**Type Scale:**
- Page Title: text-2xl md:text-3xl
- Section Headers: text-lg md:text-xl
- Card Titles: text-base md:text-lg
- Body/Data: text-sm md:text-base
- Meta Info: text-xs md:text-sm

## Layout System

**Spacing Primitives:** Use Tailwind units of 3, 4, 6, and 8 consistently
- Component padding: p-4 md:p-6
- Section spacing: space-y-6 md:space-y-8
- Card gaps: gap-4
- Tight groupings: space-y-3

**Grid System:**
- Mobile: Single column (grid-cols-1)
- Tablet: 2 columns where appropriate (md:grid-cols-2)
- Desktop: Maximum 3 columns for cards (lg:grid-cols-3)
- Data table: Full-width responsive with horizontal scroll on mobile

**Container Strategy:**
- Max width: max-w-7xl mx-auto
- Mobile padding: px-4
- Desktop padding: px-6 lg:px-8

## Component Library

### Header Bar
- Fixed position at top for mobile accessibility
- Height: h-16
- Contains: Logo/title (left), refresh button (right)
- Touch-friendly tap targets: min-h-12 min-w-12
- Sticky on scroll for quick access to refresh

### Data Cards (Mobile Priority)
- Rounded corners: rounded-lg
- Padding: p-4
- Shadow: shadow-sm with subtle border
- Each card displays: Title, key data points, timestamp
- Stacked layout on mobile, transitioning to grid on tablet+
- Tap to expand for full details

### Data Table (Desktop Enhancement)
- Clean header row with sortable columns
- Row height: h-12 for easy tapping
- Zebra striping for readability
- Horizontal scroll on mobile with sticky first column
- Sort indicators on headers (arrows)
- Responsive breakpoint: Show cards below md, table above md

### Search & Filter Bar
- Full-width on mobile: w-full
- Input height: h-12 (touch-friendly)
- Clear button inside input (right-aligned)
- Padding: px-4 py-3
- Search icon on left side of input

### Action Buttons
- Primary (Refresh): Prominent, full corner radius (rounded-full), px-6 py-3
- Touch target: min-h-12
- Loading spinner replaces icon when fetching

### Loading States
- Skeleton screens for data cards (animated pulse)
- Spinner for refresh action
- Smooth transitions: transition-all duration-200

### Empty States
- Centered content with icon
- Helpful message: "No data available" or "Pull to refresh"
- Call-to-action if applicable

### Error Handling
- Toast notifications at bottom of screen (mobile safe zone)
- Non-intrusive, auto-dismiss after 4s
- Clear error messages with retry option

## Mobile-Specific Optimizations

**Touch Interactions:**
- All interactive elements: Minimum 44x44px (Tailwind: min-h-11 min-w-11)
- Generous spacing between tappable items: gap-3 minimum
- Pull-to-refresh gesture support
- Swipe actions on cards (optional quick actions)

**Responsive Breakpoints:**
- Mobile-first base styles
- Tablet: md: (768px)
- Desktop: lg: (1024px)

**Safe Zones:**
- Top: Account for notch/status bar (pt-safe or pt-4)
- Bottom: Navigation safe area (pb-safe or pb-6)

**Viewport Management:**
- Header: Fixed positioning (h-16)
- Content area: Calc height minus header (h-[calc(100vh-4rem)])
- Overflow: Scrollable content area

## Visual Hierarchy

**Information Density:**
- Mobile: Show 3-4 key data points per card
- Desktop: Expand to show all available columns
- Progressive disclosure: Tap for details

**Emphasis Patterns:**
- Important values: Medium font weight (font-medium)
- Timestamps/meta: Smaller, muted treatment
- Status indicators: Subtle badges (rounded-full, text-xs, px-2 py-1)

## Interaction Patterns

**Data Refresh:**
- Manual: Refresh button in header
- Visual feedback: Button rotates during fetch
- Success: Subtle flash or updated timestamp

**Sorting:**
- Column headers are clickable
- Arrow indicators show sort direction
- Maintains sort state during refresh

**Search:**
- Instant client-side filtering
- Debounced input (300ms) for performance
- Clear button appears when text entered
- Highlight matching terms (optional)

## Performance Considerations

- Lazy load data cards beyond initial viewport
- Virtualized scrolling for large datasets (100+ items)
- Debounce search input
- Optimize table rendering with key props
- Cache fetched data, refresh on demand

## Accessibility

- Touch targets meet 44x44px minimum
- Sufficient contrast for data readability
- Keyboard navigation support (desktop)
- Screen reader labels on icons
- Focus indicators on interactive elements
- ARIA labels for dynamic content updates

This design creates a professional, mobile-optimized data console that feels fast and intuitive for creative teams managing client and project information on the go.