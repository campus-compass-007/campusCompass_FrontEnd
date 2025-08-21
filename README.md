# CampusCompass Mobile PWA App 🧭

A React-based mobile campus navigation app with MongoDB backend integration.

![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue)
![Vite](https://img.shields.io/badge/Vite-5.4.1-646CFF)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.3-38B2AC)

## 🚀 Quick Start for Developers

### Prerequisites
- **Node.js** 18+ (LTS recommended)
- **npm** or **yarn**
- Access to backend API endpoints

### Setup Instructions

1. **Clone and Install**
   ```bash
   git clone https://github.com/[organization-name]/campusCompass_FrontEnd.git
   cd campusCompass_FrontEnd
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   # App runs on http://localhost:5173
   ```

## 📋 Development Scripts

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `npm run dev` | Development server with HMR | Daily development |
| `npm run build` | Production build | Before deployment |
| `npm run preview` | Test production build locally | Pre-deployment testing |
| `npm run lint` | Check code quality | Before commits |

## 🏗️ Project Architecture

```
src/
├── components/              # Reusable UI components
│   ├── TopNav.tsx          # Header with logo & dark mode toggle
│   ├── BottomNav.tsx       # Bottom navigation tabs
│   ├── MapView.tsx         # Main map interface
│   ├── BottomSheet.tsx     # Location details popup
│   ├── BuildingsMenu.tsx   # Buildings listing & search
│   ├── ContactsMenu.tsx    # Campus contacts directory
│   └── SearchBar.tsx       # Search functionality
├── styles/
│   └── globals.css         # Tailwind config & global styles
├── hooks/                  # Custom React hooks (to be added)
├── types/                  # TypeScript interfaces (to be added)
├── utils/                  # Helper functions (to be added)
├── App.tsx                 # Main app component & state management
└── main.tsx               # React app entry point
```

## 🔧 Technical Stack

### Frontend
- **React 18** - Component library with hooks
- **TypeScript** - Type safety and better DX
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library

### Backend Integration
- **MongoDB** - Database for campus data
- **REST API** - Backend communication
- **Admin Authentication** - Content management system

## 📱 Component Breakdown

### Core Components

#### `App.tsx` - Main Application
- **State Management**: Active tab, dark mode, location selection
- **Event Handlers**: Navigation, menu toggles, location selection
- **Layout**: Orchestrates all child components

#### `TopNav.tsx` - Header Navigation
- **Props**: `isDarkMode`, `onToggleDarkMode`
- **Features**: App logo, dark mode toggle
- **Styling**: Purple theme (#6c3d91)

#### `BottomNav.tsx` - Tab Navigation
- **Props**: `activeTab`, `onHomeClick`, `onBuildingsClick`, `onContactsClick`
- **Features**: Home, Buildings, Contacts tabs
- **State**: Visual active tab indication

#### `MapView.tsx` - Interactive Map
- **Props**: `onLocationSelect`, `selectedLocation`, `isDarkMode`
- **Features**: Location markers, selection handling
- **Future**: Will integrate with real mapping service

#### `BottomSheet.tsx` - Location Details
- **Props**: `location`, `onClose`, `isDarkMode`
- **Features**: Sliding panel with location info
- **Animation**: Smooth slide-up/down transitions

#### `BuildingsMenu.tsx` - Buildings Directory
- **Props**: `isOpen`, `onClose`
- **Features**: Search, filter, building list
- **Data Source**: Will connect to MongoDB buildings collection

#### `ContactsMenu.tsx` - Campus Contacts
- **Props**: `isOpen`, `onClose`
- **Features**: Contact search, emergency contacts
- **Data Source**: Will connect to MongoDB contacts collection

## 🔄 Data Flow

### Current (Mock Data)
```
Component → Mock Data Arrays → UI Rendering
```

### Target (MongoDB Integration)
```
Component → API Call → MongoDB → Response → State Update → UI Rendering
```

## 🧪 Testing Guidelines

### What to Test
1. **Component Rendering** - All components render without errors
2. **Navigation** - Tab switching works correctly
3. **Dark Mode** - Theme toggle functionality
4. **Search** - Filter functionality in menus
5. **Mobile Responsiveness** - Test on various screen sizes

### Testing Workflow
```bash
# 1. Start dev server
npm run dev

# 2. Test on different devices/browsers
# - Chrome DevTools mobile simulation
# - Physical mobile devices
# - Different screen sizes

# 3. Test all user flows
# - Navigation between tabs
# - Opening/closing menus
# - Dark mode toggle
# - Location selection (when available)
```

## � Common Issues & Solutions

### Development Issues

| Issue | Solution |
|-------|----------|
| Port 5173 in use | `npx kill-port 5173` or change port in vite.config.ts |
| TypeScript errors | Check import paths and interface definitions |
| Tailwind not applying | Verify tailwind.config.js paths include all component files |
| Components not updating | Check if you're importing from correct path |

### Mobile Testing
- Use Chrome DevTools responsive mode
- Test touch interactions
- Verify bottom navigation doesn't conflict with browser UI
- Check dark mode in different lighting conditions

## 📡 Backend Integration (Upcoming)

### API Endpoints to Implement
```typescript
// Buildings
GET /api/buildings          # Get all buildings
GET /api/buildings/:id      # Get specific building

// Contacts  
GET /api/contacts           # Get all contacts
GET /api/contacts/:id       # Get specific contact

// Admin (for content management)
POST /api/admin/login       # Admin authentication
GET /api/admin/buildings    # Admin building management
PUT /api/admin/buildings/:id # Update building
DELETE /api/admin/buildings/:id # Delete building
```

### Data Models
```typescript
interface Building {
  id: string;
  name: string;
  description: string;
  coordinates: { lat: number; lng: number };
  image?: string;
  category: 'academic' | 'administrative' | 'residential' | 'recreational';
  isActive: boolean;
}

interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  department: string;
  buildingId?: string;
  isEmergency: boolean;
}
```

## 🔒 Environment Variables

```bash
# Required for backend integration
VITE_API_BASE_URL=          # Backend API URL
VITE_MAPBOX_TOKEN=          # Mapbox API key (future)
VITE_APP_VERSION=           # App version for cache busting
```

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] Run `npm run lint` - No errors
- [ ] Run `npm run build` - Build succeeds
- [ ] Test production build with `npm run preview`
- [ ] Verify all environment variables are set
- [ ] Test on mobile devices
- [ ] Check dark mode functionality
- [ ] Verify all navigation flows

### Build Output
```bash
npm run build
# Generates dist/ folder for deployment
# Static files ready for any web server
```

## 👥 Development Workflow

### Branch Strategy
- `main` - Production ready code
- `develop` - Integration branch
- `feature/*` - New features
- `bugfix/*` - Bug fixes

### Code Standards
- **ESLint** configuration enforces code quality
- **TypeScript** strict mode enabled
- **Tailwind CSS** for all styling (no custom CSS)
- **Component naming** - PascalCase for components
- **File organization** - One component per file

### Commit Guidelines
```bash
# Use conventional commits
feat: add building search functionality
fix: resolve dark mode toggle issue
refactor: extract bottom nav to separate component
docs: update API integration guide
```

---

**Note**: This is a mobile-first application. Always test on mobile devices or mobile simulation first.


