export interface RouteStep {
  instruction: string;
  distance: number;
  duration: number;
  maneuver: {
    type: string;
    modifier?: string;
  };
}

export interface RouteGeometry {
  type: string;
  coordinates: [number, number][];
}

export interface Route {
  distance: number; // in meters
  duration: number; // in seconds
  steps: RouteStep[];
  geometry: RouteGeometry;
}

/**
 * Fetch a walking route from Mapbox Directions API
 * @param start - Starting coordinates [lng, lat]
 * @param end - Destination coordinates [lng, lat]
 * @param accessToken - Mapbox access token
 * @returns Route information including geometry and turn-by-turn instructions
 */
export async function getWalkingRoute(
  start: [number, number],
  end: [number, number],
  accessToken: string
): Promise<Route> {
  const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${start[0]},${start[1]};${end[0]},${end[1]}?alternatives=false&geometries=geojson&language=en&overview=full&steps=true&access_token=${accessToken}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      throw new Error('No route found');
    }

    const route = data.routes[0];
    
    return {
      distance: route.distance,
      duration: route.duration,
      geometry: route.geometry,
      steps: route.legs[0].steps.map((step: any) => ({
        instruction: step.maneuver.instruction,
        distance: step.distance,
        duration: step.duration,
        maneuver: {
          type: step.maneuver.type,
          modifier: step.maneuver.modifier
        }
      }))
    };
  } catch (error) {
    console.error('Error fetching route:', error);
    throw error;
  }
}

/**
 * Draw a route on the map
 * @param map - Mapbox map instance
 * @param route - Route geometry to draw
 * @param sourceId - ID for the route source (default: 'route')
 * @param layerId - ID for the route layer (default: 'route-line')
 */
export function drawRouteOnMap(
  map: any,
  route: Route,
  sourceId: string = 'route',
  layerId: string = 'route-line'
): void {
  // Remove existing route if any
  if (map.getLayer(layerId)) {
    map.removeLayer(layerId);
  }
  
  const outlineLayerId = `${layerId}-outline`;
  if (map.getLayer(outlineLayerId)) {
    map.removeLayer(outlineLayerId);
  }
  
  if (map.getSource(sourceId)) {
    map.removeSource(sourceId);
  }

  // Add route source with explicit LineString geometry
  const geojsonData = {
    type: 'Feature' as const,
    properties: {},
    geometry: {
      type: 'LineString' as const,
      coordinates: route.geometry.coordinates
    }
  };

  map.addSource(sourceId, {
    type: 'geojson',
    data: geojsonData
  });

  // Add route outline layer first (wider, lighter)
  map.addLayer({
    id: outlineLayerId,
    type: 'line',
    source: sourceId,
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#1e3a8a', // Dark blue for outline
      'line-width': 10,
      'line-opacity': 0.5
    }
  });

  // Add main route layer on top (narrower, brighter)
  map.addLayer({
    id: layerId,
    type: 'line',
    source: sourceId,
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#3b82f6', // Bright blue color for the route
      'line-width': 6,
      'line-opacity': 0.95
    }
  });
}

/**
 * Clear route from the map
 * @param map - Mapbox map instance
 * @param sourceId - ID for the route source (default: 'route')
 * @param layerId - ID for the route layer (default: 'route-line')
 */
export function clearRouteFromMap(
  map: any,
  sourceId: string = 'route',
  layerId: string = 'route-line'
): void {
  const outlineLayerId = `${layerId}-outline`;
  
  if (map.getLayer(outlineLayerId)) {
    map.removeLayer(outlineLayerId);
  }
  if (map.getLayer(layerId)) {
    map.removeLayer(layerId);
  }
  if (map.getSource(sourceId)) {
    map.removeSource(sourceId);
  }
}

/**
 * Format distance for display
 * @param meters - Distance in meters
 * @returns Formatted string (e.g., "500m" or "1.2km")
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

/**
 * Format duration for display
 * @param seconds - Duration in seconds
 * @returns Formatted string (e.g., "5 min" or "1h 30min")
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}min`;
}
