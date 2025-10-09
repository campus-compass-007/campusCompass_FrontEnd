import { useState, useRef, useEffect, useCallback } from 'react';
import { Navigation } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import { CAMPUS_CONFIG } from '../config/campus';
import { Location } from '../types';
import axios from 'axios';
import { getWalkingRoute, drawRouteOnMap, clearRouteFromMap, Route } from '../services/routingService';

interface MapViewProps {
  onLocationSelect: (location: Location) => void;
  selectedLocation: Location | null;
  isDarkMode?: boolean;
  onRouteCalculated?: (route: Route, destination: Location) => void;
  shouldCalculateRoute?: boolean;
  onRouteClear?: () => void;
}

// Mock user location for testing (NWU Main Gate area)
// TODO: Replace with real GPS location later
const MOCK_USER_LOCATION: [number, number] = [27.0947, -26.6879]; // [lng, lat]

export function MapView({ onLocationSelect, selectedLocation, isDarkMode, onRouteCalculated, shouldCalculateRoute, onRouteClear }: MapViewProps) {
  const [locations,setLocations] = useState<Location[]>([])
  const [zoom] = useState(CAMPUS_CONFIG.defaultZoom);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const onLocationSelectRef = useRef(onLocationSelect);
  const userLocationMarkerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
      try{
          axios.get(`http://${import.meta.env.VITE_API_GATEWAY_URL}/api/buildings`).then((res) =>{
          // Add dummy test building for routing
          const testBuilding: Location = {
            id: 'test-building-1',
            name: 'Test Building (Routing Demo)',
            address: 'Test Location for Routing',
            lat: -26.6875002,
            lng: 27.0930933,
            type: 'landmark'
          };
          setLocations([testBuilding, ...res.data])
        })
      } catch(err) {
        console.error(err)
      }
  },[isDarkMode])
  
  // Update the ref when onLocationSelect changes
  useEffect(() => {
    onLocationSelectRef.current = onLocationSelect;
  }, [onLocationSelect]);

  // Set Mapbox access token
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';

  const getMarkerBackgroundColor = (type: string) => {
    switch (type) {
      case 'restaurant': return '#00ffddff'; // Cyan for dining
      case 'store': return '#3b82f6';      // Blue for library/services
      case 'landmark': return '#22c55e';   // Green for academic/general buildings
      case 'gas_station': return '#eab308'; // Yellow for sports/special facilities
      case 'recreational': return '#00741dff';   // dark Green for recreational
      case 'residential': return '#d97706'; // Orange for residential
      case 'library': return '#ffffffff';      // White for library
      case 'health': return '#ff0707ff';      // Red for health services
      case 'security': return '#000000ff';   // Black for security
      default: return '#6c3d91';           // Purple (campus theme) for others
    }
  };

  const handleLocationClick = useCallback((location: Location) => {
    onLocationSelectRef.current(location);
    
    // Center map on selected location but respect campus bounds WITHOUT zooming
    if (mapInstanceRef.current) {
      const [west, south, east, north] = CAMPUS_CONFIG.bounds;
      const targetLng = Math.max(west, Math.min(east, location.lng));
      const targetLat = Math.max(south, Math.min(north, location.lat));
      
      // Only pan to center, maintain current zoom level
      mapInstanceRef.current.flyTo({
        center: [targetLng, targetLat],
        // Remove zoom parameter to maintain current zoom level
        duration: 1000
      });
    }
  }, []); // No dependencies needed since we use ref

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: isDarkMode ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/streets-v12',
      center: CAMPUS_CONFIG.center,
      zoom: zoom,
      attributionControl: false,
      // Set max bounds to restrict map view to campus area only
      maxBounds: CAMPUS_CONFIG.bounds,
      // Restrict zoom levels to prevent users from zooming out too far
      // Increased minZoom to ensure polygon always fills viewport and no outside areas visible
      minZoom: 17,
      maxZoom: 20,
    });

    // Add navigation control
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add attribution control
    map.addControl(new mapboxgl.AttributionControl({
      compact: true,
      customAttribution: '© CampusCompass'
    }), 'bottom-left');

    // Remove fitBounds call - map starts at optimal zoom level to fit polygon perfectly
    // This eliminates the loading delay and ensures immediate proper bounds

    // Add campus boundary visualization
    map.on('load', () => {
      // Add campus boundary source
      map.addSource('campus-boundary', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [CAMPUS_CONFIG.boundary]
          }
        }
      });

      // Add campus boundary layer (outline)
      map.addLayer({
        id: 'campus-boundary-line',
        type: 'line',
        source: 'campus-boundary',
        layout: {},
        paint: {
          'line-color': '#6c3d91',
          'line-width': 3,
          'line-opacity': 0.8
        }
      });

      // Add campus boundary fill (optional, subtle)
      map.addLayer({
        id: 'campus-boundary-fill',
        type: 'fill',
        source: 'campus-boundary',
        layout: {},
        paint: {
          'fill-color': '#6c3d91',
          'fill-opacity': 0.1
        }
      });

      // 🆕 NEW: Create blank canvas mask for areas outside campus
      // This creates an inverted polygon that covers everything outside the campus
      // Use much larger bounds to ensure complete coverage of visible map area
      const maskBounds = [
        27.08,   // west - expanded significantly
        -26.71,  // south - expanded significantly
        28.10,   // east - expanded significantly
        -26.67   // north - expanded significantly
      ];

      const invertedPolygon = [
        [
          [maskBounds[0], maskBounds[1]], // bottom-left of expanded bounds
          [maskBounds[2], maskBounds[1]], // bottom-right of expanded bounds
          [maskBounds[2], maskBounds[3]], // top-right of expanded bounds
          [maskBounds[0], maskBounds[3]], // top-left of expanded bounds
          [maskBounds[0], maskBounds[1]]  // back to bottom-left
        ],
        CAMPUS_CONFIG.boundary // hole for the campus area
      ];

      // Add mask source with inverted polygon (hole for campus)
      map.addSource('campus-mask', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: invertedPolygon
          },
          properties: {}
        }
      });

      // Add blank canvas layer to hide everything outside campus
      // This layer covers the entire map except the campus area
      map.addLayer({
        id: 'campus-mask-fill',
        type: 'fill',
        source: 'campus-mask',
        layout: {},
        paint: {
          'fill-color': isDarkMode ? '#1f2937' : '#ffffff', // Dark gray for dark mode, white for light mode
          'fill-opacity': 1.0 // Completely opaque to hide all map content
        }
      });
    });

    mapInstanceRef.current = map;

    // Clean up on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isDarkMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Add/update markers whenever locations change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    locations.forEach((location) => {
      // Create a DOM element for the marker
      const markerElement = document.createElement('div');
      markerElement.className = 'custom-marker';
      markerElement.style.cssText = `
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 2px solid white;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: ${getMarkerBackgroundColor(location.type)};
      `;

      // Add custom emoji icon based on location type
      const icon = document.createElement('div');
      let emoji = '📍';
      switch (location.type) {
        case 'restaurant': emoji = '🍽'; break;
        case 'library': emoji = '📚'; break;
        case 'store': emoji = '🛒'; break;
        case 'landmark': emoji = '🏛️'; break;
        case 'gas_station': emoji = '⛽'; break;
        case 'recreational': emoji = '💬'; break;
        case 'residential': emoji = '🏠'; break;
        case 'health': emoji = '👨‍⚕️'; break;
        case 'security': emoji = '🛡️'; break;
        default: emoji = '📍';
      }
      icon.innerHTML = emoji;
      icon.style.fontSize = '16px';
      markerElement.appendChild(icon);

      // Create the marker
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([location.lng, location.lat])
        .addTo(mapInstanceRef.current!);

      // Add click event
      markerElement.addEventListener('click', () => {
        handleLocationClick(location);
      });

      markersRef.current.push(marker);
    });
  }, [handleLocationClick, locations]); // Re-run when locations change

  // Update map style when dark mode changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      const newStyle = isDarkMode ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/streets-v12';
      
      // Add a small delay to prevent flashing during transitions
      const timeoutId = setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setStyle(newStyle);
        }
      }, 50);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isDarkMode]);

  // Update markers when selectedLocation changes
  useEffect(() => {
    if (mapInstanceRef.current && selectedLocation) {
      // Center map on selected location WITHOUT zooming
      mapInstanceRef.current.flyTo({
        center: [selectedLocation.lng, selectedLocation.lat],
        // Remove zoom parameter to maintain current zoom level
        duration: 1000
      });
    }
  }, [selectedLocation]);

  // Removed zoom update useEffect to prevent map reinitialization conflicts

  // Add mock user location marker to map
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Remove existing user location marker if any
    if (userLocationMarkerRef.current) {
      userLocationMarkerRef.current.remove();
    }

    // Create user location marker element (blue dot with pulse animation)
    const userMarkerElement = document.createElement('div');
    userMarkerElement.className = 'user-location-marker';
    userMarkerElement.style.cssText = `
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: #3b82f6;
      border: 3px solid white;
      box-shadow: 0 0 0 rgba(59, 130, 246, 0.4);
      animation: pulse 2s infinite;
    `;

    // Add pulse animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% {
          box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
        }
        70% {
          box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
        }
      }
    `;
    document.head.appendChild(style);

    // Create and add the marker
    const userMarker = new mapboxgl.Marker(userMarkerElement)
      .setLngLat(MOCK_USER_LOCATION)
      .addTo(mapInstanceRef.current);

    userLocationMarkerRef.current = userMarker;

    // Add hardcoded dummy building pin for testing
    const dummyBuildingLocation: Location = {
      id: 'test-building-dummy',
      name: 'Test Building (Routing Demo)',
      address: 'Test Location for Routing',
      lat: -26.6875002,
      lng: 27.0930933,
      type: 'landmark'
    };

    // Create building marker element
    const buildingMarkerElement = document.createElement('div');
    buildingMarkerElement.className = 'custom-marker';
    buildingMarkerElement.style.cssText = `
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid white;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #22c55e;
    `;

    const buildingIcon = document.createElement('div');
    buildingIcon.innerHTML = '🏛️';
    buildingIcon.style.fontSize = '16px';
    buildingMarkerElement.appendChild(buildingIcon);

    // Create the building marker
    const buildingMarker = new mapboxgl.Marker(buildingMarkerElement)
      .setLngLat([dummyBuildingLocation.lng, dummyBuildingLocation.lat])
      .addTo(mapInstanceRef.current);

    // Add click event to the building marker
    buildingMarkerElement.addEventListener('click', () => {
      handleLocationClick(dummyBuildingLocation);
    });

    // Store in markers ref so it gets cleaned up
    markersRef.current.push(buildingMarker);

    return () => {
      if (userLocationMarkerRef.current) {
        userLocationMarkerRef.current.remove();
      }
    };
  }, [handleLocationClick]);

  // Handle route calculation when requested
  useEffect(() => {
    if (!shouldCalculateRoute || !selectedLocation || !mapInstanceRef.current) return;

    const calculateRoute = async () => {
      try {
        const accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';
        const destination: [number, number] = [selectedLocation.lng, selectedLocation.lat];
        
        console.log('🗺️ Calculating route from:', MOCK_USER_LOCATION, 'to:', destination);
        
        // Get route from mock user location to selected destination
        //const route = await getWalkingRoute(MOCK_USER_LOCATION, destination, accessToken);
        const url = await axios.get(`https://api.mapbox.com/directions/v5/mapbox/walking/${MOCK_USER_LOCATION[0]},${MOCK_USER_LOCATION[1]};${destination[0]},${destination[1]}?alternatives=false&geometries=geojson&language=en&overview=full&steps=true&access_token=${accessToken}`)
        const data = url.data.routes[0];
        const route = data.geometry;
        const geojson = {
          'type': 'Feature',
          'properties': {},
          'geometry': data.geometry
        }

        if (mapInstanceRef.current?.getSource('route')){
          mapInstanceRef.current?.getSource('route').setData(geojson)
        } else{
          mapInstanceRef.current?.addLayer({
            id: 'route',
            type: 'line',
            source: {
              type: 'geojson',
              data: geojson
            },
            layout: {
              "line-join": 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#3887be',
              'line-width': 5,
              'line-opacity': 0.75
            }
          })
        }

      } catch (error) {
        console.error('Error calculating route:', error);
        alert('Failed to calculate route. Please try again.');
        if (onRouteClear) {
          onRouteClear();
        }
      }
    };

    calculateRoute();
  }, [onRouteClear, selectedLocation, shouldCalculateRoute]);

  // Clear route when location selection is closed
  useEffect(() => {
    if (!selectedLocation && mapInstanceRef.current) {
      clearRouteFromMap(mapInstanceRef.current);
    }
  }, [selectedLocation]);

  const handleMyLocationClick = () => {
    if (navigator.geolocation && mapInstanceRef.current) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          
          // Check if user location is within campus bounds
          const [west, south, east, north] = CAMPUS_CONFIG.bounds;
          const isWithinCampus = 
            longitude >= west && longitude <= east && 
            latitude >= south && latitude <= north;
          
          if (isWithinCampus) {
            // User is on campus, center on their location WITHOUT zooming
            mapInstanceRef.current?.flyTo({
              center: [longitude, latitude],
              // Remove zoom parameter to maintain current zoom level
              duration: 1000
            });
          } else {
            // User is outside campus, show campus overview (this one can zoom to fit)
            mapInstanceRef.current?.fitBounds(CAMPUS_CONFIG.bounds, {
              padding: { top: 50, bottom: 50, left: 50, right: 50 },
              duration: 1000
            });
            alert('You appear to be outside the campus area. Showing campus overview instead.');
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please check your location permissions.');
        }
      );
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Mapbox container */}
      <div 
        ref={mapRef}
        className="absolute inset-0 w-full h-full"
        style={{ minHeight: '400px' }}
      />


      {/* My Location Button */}
      <div className="absolute bottom-32 right-4 z-10">
        <button 
          onClick={handleMyLocationClick}
          className={`w-12 h-12 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} rounded-full shadow-lg flex items-center justify-center transition-colors`}
        >
          <Navigation className="w-6 h-6 text-blue-600" />
        </button>
      </div>
    </div>
  );
}