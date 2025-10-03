# Mapbox Routing Implementation Guide

## Overview
The routing functionality has been successfully implemented using the Mapbox Directions API. Users can now get walking directions from their current location to any selected building pin on the map.

## Features Implemented

### 1. **Mock User Location**
- **Location**: NWU Main Gate area (27.0947, -26.6879)
- **Visual Indicator**: Blue pulsing dot on the map
- **Purpose**: Simulates user's current location for testing
- **Future**: Easy to replace with real GPS coordinates

### 2. **Route Calculation**
- Uses Mapbox Directions API (walking profile)
- Calculates optimal walking route
- Draws route on map with blue line
- Automatically fits map bounds to show entire route

### 3. **Turn-by-Turn Navigation**
- **DirectionsPanel** component slides in from the right
- Shows total distance and duration
- Lists all navigation steps with:
  - Turn-by-turn instructions
  - Distance for each step
  - Duration for each step
  - Visual icons for maneuvers (arrows)

### 4. **User Interface**
- **"Go" Button**: Located in the BottomSheet when a pin is selected
- **Directions Panel**: Full-screen panel with navigation instructions
- **Route Visualization**: Blue route line on the map
- **Close Button**: Clear route and return to normal view

## How to Test

### Step 1: Start the Development Server
```bash
npm run dev
```

### Step 2: Use the Routing Feature
1. **Open the app** in your browser
2. **Find the blue pulsing dot** - This is your mock current location (Main Gate area)
3. **Click on any building pin** on the map
4. **BottomSheet opens** with building information
5. **Click the "Go" button** (blue button with Navigation icon)
6. **Watch the magic**:
   - Route is calculated
   - Blue line appears showing the walking path
   - Map zooms to fit the entire route
   - Directions panel slides in from the right

### Step 3: View Turn-by-Turn Directions
- **Directions Panel** shows:
  - Destination name at the top
  - Total distance and duration
  - Step-by-step instructions
  - Each step with distance and duration
- **Scroll through** all navigation steps
- **Close** by clicking the X button

### Step 4: Clear the Route
- Click the **X button** in the Directions Panel
- Route disappears from the map
- Map returns to normal view

## Code Architecture

### New Files Created

#### 1. `src/services/routingService.ts`
**Purpose**: Core routing logic and API integration

**Key Functions**:
- `getWalkingRoute()` - Fetches route from Mapbox API
- `drawRouteOnMap()` - Renders route on the map
- `clearRouteFromMap()` - Removes route from the map
- `formatDistance()` - Formats meters to readable format
- `formatDuration()` - Formats seconds to readable format

**Interfaces**:
```typescript
interface Route {
  distance: number;
  duration: number;
  steps: RouteStep[];
  geometry: RouteGeometry;
}
```

#### 2. `src/components/DirectionsPanel.tsx`
**Purpose**: Displays turn-by-turn navigation instructions

**Features**:
- Sticky header with total distance/duration
- Scrollable step list
- Visual icons for different maneuvers
- Summary card at the bottom
- Responsive design (full screen on mobile, sidebar on desktop)

### Modified Files

#### 1. `src/components/MapView.tsx`
**Added**:
- User location marker (blue pulsing dot)
- Route calculation logic
- Route drawing on map
- Map bound fitting for routes
- Props for routing control

**Key Props**:
- `onRouteCalculated` - Callback when route is ready
- `shouldCalculateRoute` - Trigger route calculation
- `onRouteClear` - Callback when route is cleared

#### 2. `src/components/BottomSheet.tsx`
**Added**:
- `onNavigate` prop for routing trigger
- "Go" button instead of "Directions"
- Click handler to start navigation

#### 3. `src/App.tsx`
**Added**:
- Route state management
- Route destination tracking
- Navigation handlers
- DirectionsPanel integration

**State Variables**:
```typescript
const [currentRoute, setCurrentRoute] = useState<Route | null>(null);
const [routeDestination, setRouteDestination] = useState<Location | null>(null);
const [shouldCalculateRoute, setShouldCalculateRoute] = useState(false);
```

## Environment Variables Required

Make sure your `.env` file has:
```env
VITE_MAPBOX_TOKEN=your_mapbox_access_token
VITE_API_GATEWAY_URL=your_backend_url
```

## Migration to Real Data

### Replace Mock User Location with Real GPS

**Current (Mock)**:
```typescript
const MOCK_USER_LOCATION: [number, number] = [27.0947, -26.6879];
```

**Future (Real GPS)**:
```typescript
// In MapView.tsx, replace MOCK_USER_LOCATION with:
const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

useEffect(() => {
  navigator.geolocation.watchPosition((position) => {
    setUserLocation([position.coords.longitude, position.coords.latitude]);
  });
}, []);
```

### Connect to MongoDB Backend

**Current**: Buildings loaded via API at `http://${VITE_API_GATEWAY_URL}/api/buildings`

**Already Configured**: 
```typescript
useEffect(() => {
  try {
    axios.get(`http://${import.meta.env.VITE_API_GATEWAY_URL}/api/buildings`)
      .then((res) => {
        setLocations(res.data)
      })
  } catch(err) {
    console.error(err)
  }
}, [])
```

## API Usage Notes

### Mapbox Directions API
- **Endpoint**: `https://api.mapbox.com/directions/v5/mapbox/walking/...`
- **Profile**: Walking (optimized for pedestrian routes)
- **Parameters**:
  - `alternatives=false` - Single best route
  - `geometries=geojson` - GeoJSON format for easy map rendering
  - `steps=true` - Turn-by-turn instructions
  - `overview=full` - Complete route geometry

### Rate Limits
- Free tier: 100,000 requests/month
- Monitor usage in Mapbox dashboard
- Consider caching routes for popular destinations

## Styling & Customization

### Route Line Colors
Located in `routingService.ts`:
```typescript
paint: {
  'line-color': '#3b82f6', // Main route color (blue)
  'line-width': 6,
  'line-opacity': 0.8
}
```

### User Location Marker
Located in `MapView.tsx`:
```typescript
background-color: #3b82f6; // Blue dot
border: 3px solid white;
animation: pulse 2s infinite;
```

### Directions Panel
Located in `DirectionsPanel.tsx`:
- Header: `bg-blue-600` (light mode) / `bg-gray-900` (dark mode)
- Steps: `bg-gray-50` (light mode) / `bg-gray-700` (dark mode)

## Testing Checklist

- [x] User location marker visible on map
- [x] Clicking building pin shows BottomSheet
- [x] "Go" button visible in BottomSheet
- [x] Clicking "Go" calculates route
- [x] Route appears as blue line on map
- [x] Directions panel slides in with instructions
- [x] All steps shown with distance/duration
- [x] Close button clears route
- [x] Map bounds fit to route automatically
- [x] Dark mode works correctly
- [x] Responsive on mobile and desktop

## Troubleshooting

### Route Not Appearing
1. Check Mapbox token in `.env`
2. Check browser console for API errors
3. Verify coordinates are within reasonable range
4. Check network tab for failed API calls

### User Location Not Visible
1. Check `MOCK_USER_LOCATION` coordinates
2. Verify coordinates are within campus bounds
3. Check map zoom level (should be 17-20)

### Directions Panel Not Showing
1. Verify route was calculated successfully
2. Check `currentRoute` state is not null
3. Look for TypeScript errors in console

## Next Steps

1. **Real GPS Integration**: Replace mock location with actual GPS
2. **Offline Caching**: Cache routes for offline use
3. **Alternative Routes**: Show multiple route options
4. **Route Preferences**: Allow user to choose fastest/shortest/accessible routes
5. **Real-Time Updates**: Update route if user deviates
6. **Voice Navigation**: Add voice turn-by-turn instructions
7. **Save Favorites**: Let users save frequently used routes

## Performance Considerations

- Route calculation is async (doesn't block UI)
- Route drawn using Mapbox GL layers (GPU accelerated)
- Directions panel uses virtual scrolling for long routes
- Map bounds fitting is animated smoothly

## Browser Support

- Modern browsers with ES6+ support
- Geolocation API support
- WebGL support required for Mapbox
- Tested on Chrome, Firefox, Safari, Edge

---

**Implementation Complete** ✅
All routing features are now functional and ready for testing!
