# Creative Data Console - Bloomberg Terminal Style

## Overview
A high-end, Bloomberg terminal-style data console for searching and viewing media/content across multiple data sources. Clean, distraction-free interface—only shows instructions until user opens the command palette to search.

## Current State
**Phase**: MVP Complete - Multi-Source Console

## Project Architecture

### Frontend Structure
- `/client/src/pages/Console.tsx` - Main console with settings for data sources
- `/client/src/components/CommandPalette.tsx` - Search and navigation via CMD+K
- `/client/src/components/ProductDetailModal.tsx` - Full item details with copy
- Terminal components: LoadingState, EmptyState, DataTable

### Data Sources
- Supports multiple Google Sheets via Apps Script endpoints
- Each source returns JSON data (supports `{ services: [...] }`, `{ data: [...] }`, or direct array)
- Default: "Media" source with 122+ items
- Users can add/remove sources from Settings (comma key or button)

### Key Features
- **Clean Home Screen**: Shows instructions, no data clutter
- **Search-First Interface**: CMD+K/CTRL+K opens search, type to find items
- **Multi-Source Support**: Switch between different Google Sheets on the fly
- **Settings Panel**: Add/remove data sources with custom names and URLs
- **Detail Modal**: Click result to see full record details with copy function
- **Keyboard Shortcuts**: 
  - CMD+K or CTRL+K: Open search
  - R: Refresh current data
  - , (comma): Open settings

### Design System
- Font: JetBrains Mono / Fira Code (monospace)
- Color scheme: Dark navy background with green/primary accents
- Status colors: Green (active), Amber (pending), Red (error)
- Terminal-inspired, professional Bloomberg aesthetic

## Recent Changes
- November 28, 2025: 
  - Simplified to search-only interface (no default data display)
  - Added multi-source support with settings dialog
  - Users can add custom Google Sheets endpoints
  - Clean instruction screen on load

## User Preferences
- Terminal-oriented, command-driven interface
- Minimal visual clutter on default view
- All interactions happen inside command palette
- Support for connecting different data sources
- Professional, high-end aesthetic
