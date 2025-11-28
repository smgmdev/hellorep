# Creative Data Console - Bloomberg Terminal Style

## Overview
A high-end, Bloomberg terminal-style data console for creative teams. Features a dark theme, monospace typography, command palette navigation (CMD+K), and professional data visualization with title-based search in the Media Section.

## Current State
**Phase**: Feature Complete - Media Section with Search

## Project Architecture

### Frontend Structure
- `/client/src/pages/Console.tsx` - Main console page with Media Section integration
- `/client/src/components/` - Terminal-style UI components:
  - `MediaHeader.tsx` - Header with MEDIA_CONSOLE branding and refresh
  - `MediaSearchBar.tsx` - Title-based search with CMD+K shortcut button
  - `ProductCard.tsx` - Professional product cards with field detection
  - `ProductDetailModal.tsx` - Full product detail modal with copy function
  - `TerminalDataTable.tsx` - Professional data table with sorting
  - `TerminalLoadingState.tsx` - Terminal splash and skeleton states
  - `TerminalEmptyState.tsx` - Error-code style empty states
  - `TerminalFooter.tsx` - Status bar with connection info
  - `CommandPalette.tsx` - CMD+K command palette with title search

### Data Source
- Google Sheets API endpoint: `https://script.google.com/macros/s/AKfycbx0cDSTDNWMB4t-YTyI2oN8u_sraa_ZZOSuyo7mQfQ88QegUBTVzDGR2yG_QjIzFa_bEw/exec`
- Returns `{ services: [...] }` with 122+ media products
- Fields: id, title, price, usdt, image, category, url, description, tab, subcategory

### Key Features
- Bloomberg terminal-inspired dark theme
- **Media Section** with professional product display
- **Title-based search** in both search bar and command palette
- Command palette (CMD+K / CTRL+K) for quick navigation
- Keyboard shortcuts (R = refresh, V = toggle view, / = focus search)
- Real-time data fetching from Google Sheets
- Search and sort functionality
- Card view (mobile) and table view (desktop)
- Detail modal with copy-to-clipboard
- Connection status indicators (LIVE/SYNCING/OFFLINE)
- Monospace typography throughout

### Keyboard Shortcuts
- `CMD+K` or `CTRL+K`: Open command palette
- `/`: Focus search bar
- `R`: Refresh data
- `V`: Toggle between cards and table view

## Design System
- Font: JetBrains Mono / Fira Code (monospace)
- Color scheme: Dark navy background with green/amber accents
- Status colors: Green (active), Amber (pending), Red (error)
- Cards: Semi-transparent with border accents
- Professional Bloomberg-style aesthetics

## Recent Changes
- November 28, 2025: 
  - Added Media Section with title-based search
  - Created ProductCard and ProductDetailModal components
  - Enhanced CommandPalette to search by title
  - Fixed API data parsing for `services` array format

## User Preferences
- Terminal-oriented, high-end aesthetic
- Command palette for power-user navigation
- Dark theme with data-dense layouts
- Mobile-friendly card layouts
- Title-based search for media items
