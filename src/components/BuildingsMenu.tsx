import { useState } from 'react';
import { Search, X, ChevronRight } from 'lucide-react';

interface Building {
  id: string;
  name: string;
  description: string;
  image: string;
}

interface BuildingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockBuildings: Building[] = [
  { id: '1', name: 'Building 1', description: 'Main Academic Building', image: '/api/placeholder/60/60' },
  { id: '2', name: 'Building 2', description: 'Science Laboratory Complex', image: '/api/placeholder/60/60' },
  { id: '3', name: 'Building 3', description: 'Student Center', image: '/api/placeholder/60/60' },
  { id: '4', name: 'Building 4', description: 'Library and Research Center', image: '/api/placeholder/60/60' },
  { id: '5', name: 'Building 5', description: 'Engineering Hall', image: '/api/placeholder/60/60' },
  { id: '6', name: 'Building 6', description: 'Arts and Humanities', image: '/api/placeholder/60/60' },
  { id: '7', name: 'Building 7', description: 'Sports Complex', image: '/api/placeholder/60/60' },
  { id: '8', name: 'Building 8', description: 'Dormitory A', image: '/api/placeholder/60/60' },
];

export function BuildingsMenu({ isOpen, onClose }: BuildingsMenuProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredBuildings = mockBuildings.filter(building =>
    building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    building.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBuildingSelect = (building: Building) => {
    console.log('Selected building:', building);
    // Here we would navigate to the building location on the map
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-200"
          onClick={onClose}
        />
      )}
      
      {/* Sliding Menu */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 z-50 transform transition-transform duration-200 ease-out ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Campus Buildings</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors duration-150 hover-purple-close"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Enter keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Buildings List */}
          <div className="flex-1 overflow-y-auto pb-20">
            {filteredBuildings.map((building) => (
              <button
                key={building.id}
                onClick={() => handleBuildingSelect(building)}
                className="w-full flex items-center p-4 transition-colors duration-150 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover-purple-transparent"
              >
                {/* Building Image */}
                <div className="w-16 h-16 mr-4 flex-shrink-0">
                  <img
                    src={building.image}
                    alt={building.name}
                    className="w-full h-full object-cover rounded-lg bg-gray-200 dark:bg-gray-600"
                    onError={(e) => {
                      // Fallback to a placeholder div if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector('.placeholder-div')) {
                        const placeholderDiv = document.createElement('div');
                        placeholderDiv.className = 'placeholder-div w-full h-full bg-gray-300 dark:bg-gray-600 rounded-lg flex items-center justify-center';
                        placeholderDiv.innerHTML = '<span class="text-gray-500 dark:text-gray-400 text-xs">IMG</span>';
                        parent.appendChild(placeholderDiv);
                      }
                    }}
                  />
                </div>

                {/* Building Info */}
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                    {building.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {building.description}
                  </p>
                </div>

                {/* Arrow Icon */}
                <ChevronRight className="w-5 h-5 text-gray-400 ml-2" />
              </button>
            ))}
            
            {filteredBuildings.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">No buildings found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
