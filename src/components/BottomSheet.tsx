import { MapPin, Phone, Clock, Star, Navigation, Share, Heart } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: 'restaurant' | 'store' | 'landmark' | 'gas_station';
}

interface BottomSheetProps {
  location: Location | null;
  onClose: () => void;
  isDarkMode?: boolean;
}

const getLocationDetails = (location: Location) => {
  const details = {
    restaurant: {
      rating: 4.5,
      reviews: 1234,
      hours: 'Open until 10:00 PM',
      phone: '+1 (555) 123-4567',
      description: 'Popular coffee shop with great atmosphere',
    },
    store: {
      rating: 4.8,
      reviews: 5678,
      hours: 'Open until 9:00 PM',
      phone: '+1 (555) 987-6543',
      description: 'Electronics and technology store',
    },
    landmark: {
      rating: 4.9,
      reviews: 9876,
      hours: 'Open 24 hours',
      phone: '+1 (555) 456-7890',
      description: 'Famous urban park and recreational area',
    },
    gas_station: {
      rating: 4.2,
      reviews: 567,
      hours: 'Open 24 hours',
      phone: '+1 (555) 321-0987',
      description: 'Full service gas station with convenience store',
    },
  };

  return details[location.type] || details.restaurant;
};

export function BottomSheet({ location, onClose, isDarkMode }: BottomSheetProps) {
  if (!location) return null;

  const details = getLocationDetails(location);

  return (
    <div className={`fixed inset-x-0 bottom-0 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-t-xl shadow-2xl z-50 max-h-96 overflow-y-auto border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      {/* Handle */}
      <div className="flex justify-center py-3">
        <div className={`w-12 h-1 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
      </div>

      {/* Content */}
      <div className="px-4 pb-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className={`text-xl font-semibold mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{location.name}</h2>
            <div className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
              <MapPin className="w-4 h-4" />
              <p className="text-sm">{location.address}</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{details.rating}</span>
                <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>({details.reviews.toLocaleString()})</span>
              </div>
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <Clock className="w-4 h-4" />
                <span>{details.hours}</span>
              </div>
            </div>
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

        {/* Description */}
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-4`}>{details.description}</p>

        {/* Contact Info */}
        <div className="flex items-center gap-2 mb-6">
          <Phone className={`w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          <span className="text-sm text-blue-600 dark:text-blue-400">{details.phone}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors">
            <Navigation className="w-5 h-5" />
            Directions
          </button>
          <button className={`p-3 border ${isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'} rounded-lg transition-colors`}>
            <Phone className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
          <button className={`p-3 border ${isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'} rounded-lg transition-colors`}>
            <Share className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
          <button className={`p-3 border ${isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'} rounded-lg transition-colors`}>
            <Heart className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}