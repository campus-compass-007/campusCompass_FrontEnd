import { useState, useRef } from 'react';
import { MapPin, Plus, Minus, Navigation } from 'lucide-react';

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

const mockLocations: Location[] = [
  { id: '1', name: 'Central Park', address: '59th St, New York, NY', lat: 40.7829, lng: -73.9654, type: 'landmark' },
  { id: '2', name: 'Starbucks Coffee', address: '123 Main St, New York, NY', lat: 40.7580, lng: -73.9855, type: 'restaurant' },
  { id: '3', name: 'Shell Gas Station', address: '456 Broadway, New York, NY', lat: 40.7614, lng: -73.9776, type: 'gas_station' },
  { id: '4', name: 'Apple Store', address: '767 5th Ave, New York, NY', lat: 40.7648, lng: -73.9731, type: 'store' },
];

export function MapView({ onLocationSelect, selectedLocation, isDarkMode }: MapViewProps) {
  const [zoom, setZoom] = useState(14);
  const mapRef = useRef<HTMLDivElement>(null);

  const zoomIn = () => setZoom(Math.min(zoom + 1, 18));
  const zoomOut = () => setZoom(Math.max(zoom - 1, 1));

  const handleLocationClick = (location: Location) => {
    onLocationSelect(location);
  };

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'restaurant': return 'bg-red-500';
      case 'store': return 'bg-blue-500';
      case 'landmark': return 'bg-green-500';
      case 'gas_station': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={`relative w-full h-full overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
      {/* Mock Map Background */}
      <div 
        ref={mapRef}
        className={`absolute inset-0 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-gray-800 to-gray-900' 
            : 'bg-gradient-to-br from-green-50 to-blue-50'
        }`}
        style={{
          backgroundImage: `
            linear-gradient(90deg, ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px),
            linear-gradient(180deg, ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: `scale(${1 + (zoom - 14) * 0.1})`,
        }}
      >
        {/* Streets */}
        <div className="absolute inset-0">
          <div className={`absolute top-1/3 left-0 right-0 h-2 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
          <div className={`absolute top-2/3 left-0 right-0 h-1 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
          <div className={`absolute left-1/4 top-0 bottom-0 w-1 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
          <div className={`absolute left-3/4 top-0 bottom-0 w-2 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
        </div>

        {/* Water bodies */}
        <div className={`absolute bottom-0 left-0 w-full h-20 ${isDarkMode ? 'bg-blue-800' : 'bg-blue-200'} opacity-60`}></div>
        <div className={`absolute top-10 right-10 w-32 h-24 ${isDarkMode ? 'bg-blue-800' : 'bg-blue-200'} rounded-full opacity-60`}></div>

        {/* Parks */}
        <div className={`absolute top-20 left-20 w-40 h-32 ${isDarkMode ? 'bg-green-800' : 'bg-green-200'} rounded-lg opacity-60`}></div>
        <div className={`absolute bottom-32 right-16 w-24 h-24 ${isDarkMode ? 'bg-green-800' : 'bg-green-200'} rounded-full opacity-60`}></div>
      </div>

      {/* Location Markers */}
      {mockLocations.map((location) => (
        <div
          key={location.id}
          className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-full"
          style={{
            left: `${50 + (location.lng + 73.9855) * 1000}%`,
            top: `${50 - (location.lat - 40.7580) * 1000}%`,
          }}
          onClick={() => handleLocationClick(location)}
        >
          <div className={`w-8 h-8 rounded-full ${getMarkerColor(location.type)} flex items-center justify-center shadow-lg border-2 border-white`}>
            <MapPin className="w-4 h-4 text-white" />
          </div>
          {selectedLocation?.id === location.id && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mb-2">
              <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} px-3 py-2 rounded-lg shadow-lg whitespace-nowrap border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <p className="font-medium">{location.name}</p>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Navigation Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          onClick={zoomIn}
          className={`w-10 h-10 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} rounded-lg shadow-lg flex items-center justify-center transition-colors`}
        >
          <Plus className={`w-5 h-5 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
        </button>
        <button
          onClick={zoomOut}
          className={`w-10 h-10 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} rounded-lg shadow-lg flex items-center justify-center transition-colors`}
        >
          <Minus className={`w-5 h-5 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
        </button>
      </div>

      {/* My Location Button */}
      <div className="absolute bottom-32 right-4">
        <button className={`w-12 h-12 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} rounded-full shadow-lg flex items-center justify-center transition-colors`}>
          <Navigation className="w-6 h-6 text-blue-600" />
        </button>
      </div>

      {/* Zoom Level Indicator */}
      <div className={`absolute bottom-4 left-4 ${isDarkMode ? 'bg-gray-800' : 'bg-black'} bg-opacity-60 text-white px-2 py-1 rounded text-sm`}>
        Zoom: {zoom}
      </div>
    </div>
  );
}