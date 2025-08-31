# PWA Landing Page Structure

## Overview
The CampusCompass app now has a landing page structure that separates the marketing/download page from the installable PWA application.

## Route Structure

### Landing Page (`/` or `/landing`)
- **Purpose**: Marketing page with PWA installation and web app access
- **Features**: 
  - PWA installation prompt and button
  - "Open Web App" button for browser usage
  - App features showcase
  - Installation status detection
- **Not included in PWA**: This page is excluded from the installable app

### Main App (`/app/*`)
- **Purpose**: The actual campus navigation application
- **Features**: All existing functionality (map, buildings, contacts, etc.)
- **PWA Scope**: Only this route and its sub-routes are part of the installable app
- **Service Worker**: Only registers for app routes

## Key Files

### Components
- `src/pages/LandingPage.tsx` - Landing page component with PWA install logic
- `src/router/AppRouter.tsx` - Client-side routing between landing and app
- `src/App.tsx` - Main application (unchanged)

### PWA Configuration
- `public/manifest.json` - PWA manifest with app scope set to `/app/`
- `public/sw.js` - Service worker for offline functionality
- `src/utils/pwa.ts` - PWA utilities for service worker registration

### Configuration Updates
- `index.html` - Updated with PWA meta tags and manifest link
- `src/main.tsx` - Now uses AppRouter instead of direct App component

## Development Flow

1. **Landing Page** (`http://localhost:3000/`):
   - Shows app marketing and installation options
   - Detects if PWA is installable or already installed
   - Provides navigation to web app

2. **Main App** (`http://localhost:3000/app`):
   - Full campus navigation functionality
   - Registers service worker for offline use
   - Matches PWA scope for installation

## Installation Behavior

- **PWA Install**: Only includes `/app/*` routes in the installed application
- **Start URL**: PWA opens directly to `/app` when launched from home screen
- **Scope**: Installation is limited to the app functionality, excluding marketing pages
- **Offline**: Service worker caches app routes for offline functionality

## Benefits

1. **Clean Separation**: Marketing content separate from app functionality
2. **Better SEO**: Landing page optimized for discovery and installation
3. **Focused PWA**: Installed app contains only essential functionality
4. **Flexible Access**: Users can choose between installation or browser usage
5. **Progressive Enhancement**: Works as both web app and installable PWA

## Future Enhancements

- Add proper app icons in various sizes
- Include screenshot images for app store-like presentation
- Add analytics tracking for installation rates
- Implement deep linking from landing page to specific app features
