# Creative Data Console

## Overview
A mobile-friendly data console for creative teams that fetches and displays data from a Google Sheets API endpoint. Built for on-the-go access to team and client information.

## Current State
**Phase**: Frontend Design Prototype (completed)

## Project Architecture

### Frontend Structure
- `/client/src/pages/Console.tsx` - Main console page with data fetching
- `/client/src/components/` - Reusable UI components:
  - `ConsoleHeader.tsx` - Header with refresh and theme toggle
  - `SearchBar.tsx` - Search input with clear functionality
  - `DataCard.tsx` - Mobile-friendly card view for data rows
  - `DataTable.tsx` - Desktop table view with sorting
  - `LoadingState.tsx` - Skeleton loading states
  - `EmptyState.tsx` - Empty/error state displays
  - `DetailModal.tsx` - Modal for viewing full row details
  - `ViewToggle.tsx` - Toggle between card/table views
  - `ThemeToggle.tsx` - Dark/light mode toggle

### Data Source
- Google Sheets API endpoint: `https://script.google.com/macros/s/AKfycbx0cDSTDNWMB4t-YTyI2oN8u_sraa_ZZOSuyo7mQfQ88QegUBTVzDGR2yG_QjIzFa_bEw/exec`

### Key Features
- Mobile-first responsive design
- Real-time data fetching from Google Sheets
- Search and filter functionality
- Card view (mobile) and table view (desktop)
- Sortable columns
- Dark/light theme support
- Detail modal for full record viewing
- Loading and error states

## Design System
- Font: Inter
- Color scheme: Purple accent (#8B5CF6) with neutral grays
- Mobile-first breakpoints: sm (640px), md (768px), lg (1024px)

## Recent Changes
- November 28, 2025: Initial frontend prototype created

## User Preferences
- Mobile-friendly design prioritized
- Clean, professional aesthetic for creative teams
