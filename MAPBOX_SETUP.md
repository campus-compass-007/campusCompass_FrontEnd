# 🗺️ Mapbox Integration Setup Guide

## 🔑 Setting up Mapbox Token

1. **Get Mapbox Token:**
   - Go to your Mapbox account dashboard
   - Find your **Default public token** or create a new one

2. **Add the token to your environment:**
   - Open the `.env` file in your project root
   - Replace `your_mapbox_token_here` with your actual token:
   ```
   VITE_MAPBOX_TOKEN=token
   ```

3. **Restart your development server:**
   ```bash
   # Stop the current server (Ctrl+C)
   # Then restart:
   npm run dev
   ```

## 🏫 Customizing

1. **Update Campus Coordinates:**
   - Open `src/config/campus.ts`
   - Replace the coordinates with our campus location:
   ```typescript
   export const CAMPUS_CONFIG = {
     center: [-YOUR_LONGITUDE, YOUR_LATITUDE], // Our campus coordinates
     defaultZoom: 14,
     focusZoom: 16,
     name: 'North West University',
   };
   ```

2. **To Find Campus Coordinates:**
   - Go to [Google Maps](https://maps.google.com)
   - Right-click on the NWU location
   - Click on the coordinates that appear
   - Use the format: [longitude, latitude]

## 🎨 Map Styles Available

The integration supports these Mapbox styles:
- **Light mode:** `mapbox://styles/mapbox/streets-v12`
- **Dark mode:** `mapbox://styles/mapbox/dark-v11`

We can change these in `src/components/MapView.tsx` if needed.

## 📱 Next Steps

1. **Add Real Campus Data:** Replace mock locations with actual campus buildings
2. **Add Search:** Implement search for buildings and locations
3. **Add Routing:** Add directions between locations
4. **Add Offline Support:** Cache map tiles for offline use
5. **Add Campus-specific Features:** Parking, events, dining hours, etc.

## 📖 Resources

- [Mapbox GL JS Documentation](https://docs.mapbox.com/mapbox-gl-js/api/)
- [Mapbox Styles](https://docs.mapbox.com/api/maps/styles/)
- [Campus Coordinate Finder](https://www.latlong.net/)
