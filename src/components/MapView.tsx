import { useState, useRef, useEffect } from 'react';
import { Navigation } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import { CAMPUS_CONFIG } from '../config/campus';

interface Location {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: 'restaurant' | 'store' | 'landmark' | 'gas_station';
}

interface MapViewProps {
  onLocationSelect: (location: Location) => void;
  selectedLocation: Location | null;
  isDarkMode?: boolean;
}

// these are still hardcoded test values
// TODO use real buildings and locations coords with mapbox
const mockLocations: Location[] = [
  { id: '1', name: 'Central Park', address: '59th St, New York, NY', lat: 40.7829, lng: -73.9654, type: 'landmark' },
  { id: '2', name: 'Starbucks Coffee', address: '123 Main St, New York, NY', lat: 40.7580, lng: -73.9855, type: 'restaurant' },
  { id: '3', name: 'Shell Gas Station', address: '456 Broadway, New York, NY', lat: 40.7614, lng: -73.9776, type: 'gas_station' },
  { id: '4', name: 'Apple Store', address: '767 5th Ave, New York, NY', lat: 40.7648, lng: -73.9731, type: 'store' },
];

export function MapView({ onLocationSelect, selectedLocation, isDarkMode }: MapViewProps) {
  const [zoom] = useState(CAMPUS_CONFIG.defaultZoom);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // Set Mapbox access token
  mapboxgl.accessToken = (import.meta as any).env.VITE_MAPBOX_TOKEN || '';

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: isDarkMode ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/streets-v12',
      center: CAMPUS_CONFIG.center,
      zoom: zoom,
      attributionControl: false,
    });

    // Add navigation control
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add attribution control
    map.addControl(new mapboxgl.AttributionControl({
      compact: true,
      customAttribution: '© CampusCompass'
    }), 'bottom-left');

    mapInstanceRef.current = map;

    // Add markers for locations
    addMarkersToMap(map);

    // Clean up on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map style when dark mode changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      const newStyle = isDarkMode ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/streets-v12';
      mapInstanceRef.current.setStyle(newStyle);
    }
  }, [isDarkMode]);

  // Update markers when selectedLocation changes
  useEffect(() => {
    if (mapInstanceRef.current && selectedLocation) {
      // Center map on selected location
      mapInstanceRef.current.flyTo({
        center: [selectedLocation.lng, selectedLocation.lat],
        zoom: Math.max(zoom, CAMPUS_CONFIG.focusZoom),
        duration: 1000
      });
    }
  }, [selectedLocation, zoom]);

  // Update zoom when state changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(zoom);
    }
  }, [zoom]);

  // Function to add markers to the map
  const addMarkersToMap = (map: mapboxgl.Map) => {
    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    mockLocations.forEach((location) => {
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

      // Add icon to marker
      const icon = document.createElement('div');
      icon.innerHTML = '📍';
      icon.style.fontSize = '16px';
      markerElement.appendChild(icon);

      // Create the marker
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([location.lng, location.lat])
        .addTo(map);

      // Add click event
      markerElement.addEventListener('click', () => {
        handleLocationClick(location);
      });

      markersRef.current.push(marker);
    });
  };

  const getMarkerBackgroundColor = (type: string) => {
    switch (type) {
      case 'restaurant': return '#ef4444';
      case 'store': return '#3b82f6';
      case 'landmark': return '#22c55e';
      case 'gas_station': return '#eab308';
      default: return '#6b7280';
    }
  };

  const handleLocationClick = (location: Location) => {
    onLocationSelect(location);
    
    // Center map on selected location
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: [location.lng, location.lat],
        zoom: Math.max(zoom, CAMPUS_CONFIG.focusZoom),
        duration: 1000
      });
    }
  };

  const handleMyLocationClick = () => {
    if (navigator.geolocation && mapInstanceRef.current) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          mapInstanceRef.current?.flyTo({
            center: [longitude, latitude],
            zoom: CAMPUS_CONFIG.focusZoom,
            duration: 1000
          });
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

      {/* Zoom Level Indicator */}
      <div className={`absolute bottom-4 left-4 ${isDarkMode ? 'bg-gray-800' : 'bg-black'} bg-opacity-60 text-white px-2 py-1 rounded text-sm z-10`}>
        Zoom: {zoom}
      </div>
    </div>
  );
}