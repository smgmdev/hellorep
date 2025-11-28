# Creative Data Console - Bloomberg Terminal Style

## Overview
A high-end, Bloomberg terminal-style data console for creative teams. Features a dark theme, monospace typography, command palette navigation (CMD+K), and professional data visualization.

## Current State
**Phase**: Frontend Design Prototype (completed)

## Project Architecture

### Frontend Structure
- `/client/src/pages/Console.tsx` - Main console page with terminal-style interface
- `/client/src/components/` - Terminal-style UI components:
  - `TerminalHeader.tsx` - Compact header with sync status and CMD button
  - `TerminalDataCard.tsx` - Terminal-style data cards with row indices
  - `TerminalDataTable.tsx` - Professional data table with sorting
  - `TerminalLoadingState.tsx` - Terminal splash and skeleton states
  - `TerminalEmptyState.tsx` - Error-code style empty states
  - `TerminalDetailModal.tsx` - Full record detail view
  - `TerminalFooter.tsx` - Status bar with connection info
  - `CommandPalette.tsx` - CMD+K command palette for navigation

### Data Source
- Google Sheets API endpoint: `https://script.google.com/macros/s/AKfycbx0cDSTDNWMB4t-YTyI2oN8u_sraa_ZZOSuyo7mQfQ88QegUBTVzDGR2yG_QjIzFa_bEw/exec`

### Key Features
- Bloomberg terminal-inspired dark theme
- Command palette (CMD+K / CTRL+K) for quick navigation
- Keyboard shortcuts (R = refresh, V = toggle view)
- Real-time data fetching from Google Sheets
- Search and sort functionality
- Card view (mobile) and table view (desktop)
- Detail modal with copy-to-clipboard
- Connection status indicators (LIVE/SYNCING/OFFLINE)
- Monospace typography throughout

### Keyboard Shortcuts
- `CMD+K` or `CTRL+K`: Open command palette
- `R`: Refresh data
- `V`: Toggle between cards and table view

## Design System
- Font: JetBrains Mono / Fira Code (monospace)
- Color scheme: Dark navy background with green/amber accents
- Status colors: Green (active), Amber (pending), Red (error)

## Recent Changes
- November 28, 2025: Bloomberg terminal-style redesign with command palette

## User Preferences
- Terminal-oriented, high-end aesthetic
- Command palette for power-user navigation
- Dark theme with data-dense layouts
