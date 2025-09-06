import { useState } from 'react';
import { X, ChevronRight } from 'lucide-react';

interface Building {
  id: string;
  name: string;
  description: string;
  image: string;
}

interface Office {
  id: string;
  officeNumber: string;
  lecturer: string;
  department: string;
}

interface BuildingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery?: string;
}

const mockBuildings: Building[] = [
  { id: '1', name: 'Building 1', description: 'Main Academic Building', image: '/api/placeholder/60/60' },
  { id: '2', name: 'Building 2', description: 'Science Laboratory Complex', image: '/api/placeholder/60/60' },
  { id: '3', name: 'Building 3', description: 'Student Center', image: '/api/placeholder/60/60' },
  { id: '4', name: 'Building 4', description: 'Library and Research Center', image: '/api/placeholder/60/60' },
  { id: '5', name: 'Building 5', description: 'Engineering Hall', image: '/api/placeholder/60/60' },
  { id: '6', name: 'Building 6', description: 'Arts and humanities', image: '/api/placeholder/60/60' },
  { id: '7', name: 'Building 7', description: 'Sports Complex', image: '/api/placeholder/60/60' },
  { id: '8', name: 'Building 8', description: 'Dormitory A', image: '/api/placeholder/60/60' },
];

const mockOffices: Office[] = [
  { id: '1', officeNumber: 'A101', lecturer: 'Prof. John Smith', department: 'Computer Science' },
  { id: '2', officeNumber: 'A102', lecturer: 'Dr. Sarah Johnson', department: 'Mathematics' },
  { id: '3', officeNumber: 'B201', lecturer: 'Prof. Michael Brown', department: 'Physics' },
  { id: '4', officeNumber: 'B202', lecturer: 'Dr. Emily Davis', department: 'Chemistry' },
  { id: '5', officeNumber: 'C301', lecturer: 'Prof. David Wilson', department: 'Engineering' },
  { id: '6', officeNumber: 'C302', lecturer: 'Dr. Lisa Anderson', department: 'Biology' },
  { id: '7', officeNumber: 'D401', lecturer: 'Prof. Robert Taylor', department: 'History' },
  { id: '8', officeNumber: 'D402', lecturer: 'Dr. Jennifer White', department: 'English Literature' },
];

export function BuildingsMenu({ isOpen, onClose, searchQuery = '' }: BuildingsMenuProps) {
  const [activeTab, setActiveTab] = useState<'buildings' | 'offices'>('buildings');

  const filteredBuildings = mockBuildings.filter(building =>
    building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    building.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOffices = mockOffices.filter(office =>
    office.officeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    office.lecturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    office.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBuildingSelect = (building: Building) => {
    console.log('Selected building:', building);
    // Here we would navigate to the building location on the map
    onClose();
  };

  const handleOfficeSelect = (office: Office) => {
    console.log('Selected office:', office);
    // Here we would navigate to the office location on the map
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed left-0 right-0 bottom-0 bg-black bg-opacity-50 z-40 transition-opacity duration-200"
          style={{ top: '4.6rem' }}
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
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Campus Directory</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors duration-150 hover-purple-close"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('buildings')}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors duration-150 ${
                activeTab === 'buildings'
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/20'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              Buildings
            </button>
            <button
              onClick={() => setActiveTab('offices')}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors duration-150 ${
                activeTab === 'offices'
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/20'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              Offices
            </button>
          </div>

          {/* Content */}
          {/* Content */}
          <div className="flex-1 overflow-y-auto pb-20">
            {activeTab === 'buildings' ? (
              // Buildings List
              <>
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
              </>
            ) : (
              // Offices List
              <>
                {filteredOffices.map((office) => (
                  <button
                    key={office.id}
                    onClick={() => handleOfficeSelect(office)}
                    className="w-full flex items-center p-4 transition-colors duration-150 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover-purple-transparent"
                  >
                    {/* Office Image */}
                    <div className="w-16 h-16 mr-4 flex-shrink-0">
                      <img
                        src="/api/placeholder/60/60"
                        alt={office.lecturer}
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

                    {/* Office Info */}
                    <div className="flex-1 text-left">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                        {office.lecturer}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Office: {office.officeNumber}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {office.department}
                      </p>
                    </div>

                    {/* Arrow Icon */}
                    <ChevronRight className="w-5 h-5 text-gray-400 ml-2" />
                  </button>
                ))}
                
                {filteredOffices.length === 0 && (
                  <div className="p-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">No offices found matching your search.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
