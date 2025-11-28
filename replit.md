# Creative Data Console - Bloomberg Terminal Style

## Overview
A high-end, Bloomberg terminal-style data console for searching and viewing content across multiple data sources (Google Apps Script, Google Sheets, external websites, and games). Clean, distraction-free interface with command palette for all interactions.

## Current State
**Phase**: MVP Complete - Multi-Source Console with Game & Trade Integration

## Project Architecture

### Frontend Structure
- `/client/src/pages/Console.tsx` - Main console with multi-source support and data fetching
- `/client/src/components/CommandPalette.tsx` - Search and navigation via CMD+K, source switching
- `/client/src/components/ProductDetailModal.tsx` - Full item details with copy function, hides images
- Terminal components: LoadingState, EmptyState

### Data Sources (4 Types)
1. **Media** (Type: script) - Google Apps Script endpoint with 120+ items
2. **Fashion** (Type: sheets) - Google Sheets CSV export with products
3. **Trade** (Type: trade) - go.stankeviciusinternational.com trade deals (demo: 6 items, actual: 167+)
4. **Play Solana** (Type: game) - Interactive game at solanapricebet.com in iframe modal

### Backend Features
- `/server/routes.ts` - Express endpoint `/api/fetch-trades` for fetching trade data
- Handles CORS issues by fetching on server-side
- HTML parsing with cheerio for extracting trade information
- Fallback to demo data when website content is client-side rendered

### Frontend Features
- **Command Palette Interface**: Press CMD+K/CTRL+K for all interaction
- **Source Switching**: Select `<Media>`, `<Fashion>`, `<Trade>`, or `<Play Solana>` from command palette
- **Live Search**: Type to search within selected source
- **Detail View**: Click any result to see full details in modal
- **Game Integration**: Click `<Play Solana>` to open game in full-screen modal
- **Data Indicators**: Shows "✓ ACTIVE" for active sources, "GAME" for games, "FETCH" for trade sources
- **Refresh Data**: Press R or select refresh command to reload current source
- **Settings Panel**: Add custom data sources (comma for settings)

### Design System
- Font: JetBrains Mono / Fira Code (monospace)
- Color scheme: Dark navy background with green/primary accents
- Status colors: Green (active), Amber (pending), Red (error)
- Terminal-inspired, professional Bloomberg aesthetic
- No visible buttons on default view - all interaction through command palette

## Data Access
- **Google Apps Script**: Direct JSON endpoints
- **Google Sheets**: CSV export API (`https://docs.google.com/spreadsheets/d/{SHEET_ID}/export?format=csv`)
- **Trade Deals**: Backend proxy endpoint to bypass CORS
- **Games**: Embedded iframes with sandbox security

## Recent Changes
- November 28, 2025:
  - Added Trade source with backend proxy fetching
  - Integrated Solana game in modal popup
  - Improved command palette with source type indicators
  - Enhanced error handling and fallback to demo data
  - Hidden image fields from product details
  - Created `/api/fetch-trades` endpoint for server-side fetching

## User Preferences
- Terminal-oriented, command-driven interface
- Minimal visual clutter on default view
- All interactions happen inside command palette
- Support for multiple data source types (API, sheets, websites, games)
- Professional, high-end aesthetic
- Separate search context per source

## Next Steps (Optional Enhancements)
- If trade website has API: Update base URL or add `/api/trades` endpoint
- To fetch all 167+ trades: Provide API endpoint URL for server to query
- To add more games/sources: Use command palette settings to add custom sources
