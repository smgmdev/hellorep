# Creative Data Console - Bloomberg Terminal Style

## Overview
A high-end, Bloomberg terminal-style data console for searching and viewing content across multiple data sources (Google Sheets and Google Apps Script). Clean, distraction-free interface with category selection and search-only interface.

## Current State
**Phase**: MVP Complete - Multi-Source Console with Direct Sheet Support

## Project Architecture

### Frontend Structure
- `/client/src/pages/Console.tsx` - Main console with category selection and multi-source support
- `/client/src/components/CommandPalette.tsx` - Search and navigation via CMD+K
- `/client/src/components/ProductDetailModal.tsx` - Full item details with copy, hides image fields
- Terminal components: LoadingState, EmptyState

### Data Sources
- **Media**: Google Apps Script endpoint (122+ items)
- **Fashion**: Direct Google Sheets access via CSV export API
- Supports both:
  - Google Apps Script endpoints (returns JSON)
  - Direct Google Sheets URLs (parsed and fetched via CSV API)
- Each source can return: `{ services: [...] }`, `{ data: [...] }`, or direct array

### Key Features
- **Category Selection Screen**: Choose between Media, Fashion, or custom sources
- **Source-Specific Search**: Only search within selected category
- **Search-First Interface**: CMD+K/CTRL+K opens search, type to find items
- **Multi-Source Support**: Switch between sources via "SWITCH_CATEGORY" button
- **Settings Panel**: Add/remove data sources (auto-detects Google Sheets vs Script)
- **Detail Modal**: Click result to see full record details with copy function
- **Direct Sheet Access**: Works with Google Sheets URLs without needing Google Apps Script
- **Keyboard Shortcuts**: 
  - CMD+K or CTRL+K: Open search
  - R: Refresh current data
  - , (comma): Open settings

### Design System
- Font: JetBrains Mono / Fira Code (monospace)
- Color scheme: Dark navy background with green/primary accents
- Status colors: Green (active), Amber (pending), Red (error)
- Terminal-inspired, professional Bloomberg aesthetic

## Data Access
- **Google Apps Script**: Direct JSON endpoints
- **Google Sheets**: CSV export API (`https://docs.google.com/spreadsheets/d/{SHEET_ID}/export?format=csv`)
- No authentication required for public sheets

## Recent Changes
- November 28, 2025: 
  - Added Fashion source with direct Google Sheets support
  - Implemented category selection screen
  - Auto-detection of source type (script vs sheets)
  - Direct CSV parsing for Google Sheets

## User Preferences
- Terminal-oriented, command-driven interface
- Minimal visual clutter on default view
- All interactions happen inside command palette
- Support for connecting different data sources
- Professional, high-end aesthetic
- Separate search for different content categories
