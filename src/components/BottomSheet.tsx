import { Navigation } from 'lucide-react';
import { Location } from '../types';

interface BottomSheetProps {
  location: Location | null;
  onClose: () => void;
  isDarkMode?: boolean;
  onNavigate?: (location: Location) => void;
}

export function BottomSheet({ location, onClose, isDarkMode, onNavigate }: BottomSheetProps) {
  if (!location) return null;

  const handleNavigateClick = () => {
    if (onNavigate) {
      onNavigate(location);
    }
  };

  return (
    <div className={`fixed inset-x-0 bottom-0 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-t-xl shadow-2xl z-[100] overflow-y-auto border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      {/* Handle */}
      <div className="flex justify-center py-3">
        <div className={`w-12 h-1 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
      </div>

      {/* Content */}
      <div className="px-4 pb-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{location.name}</h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <div className="w-6 h-6 relative">
              <div className={`absolute top-1/2 left-1/2 w-4 h-0.5 ${isDarkMode ? 'bg-gray-400' : 'bg-gray-400'} transform -translate-x-1/2 -translate-y-1/2 rotate-45`}></div>
              <div className={`absolute top-1/2 left-1/2 w-4 h-0.5 ${isDarkMode ? 'bg-gray-400' : 'bg-gray-400'} transform -translate-x-1/2 -translate-y-1/2 -rotate-45`}></div>
            </div>
          </button>
        </div>

        {/* Action Button */}
        <button 
          onClick={handleNavigateClick}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors">
          <Navigation className="w-5 h-5" />
          Go
        </button>
      </div>
    </div>
  );
}