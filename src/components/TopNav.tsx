import { Moon, Sun, Search } from 'lucide-react';
import { useState } from 'react';

interface TopNavProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onSearch?: (query: string) => void;
}

export function TopNav({ isDarkMode, onToggleDarkMode, onSearch }: TopNavProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <div className="relative z-40 p-4" style={{ backgroundColor: '#6c3d91' }}>
      <div className="flex items-center justify-between gap-4">
        {/* App Logo */}
        <div className="flex items-center flex-shrink-0">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <img 
              src="/assets/campus-compass-logo.png" 
              alt="CampusCompass Logo" 
              className="w-6 h-6 object-contain"
            />
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search buildings, locations..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 bg-white/90 backdrop-blur-sm border border-white/20 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Dark Mode Toggle */}
        <button 
          onClick={onToggleDarkMode}
          className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
        >
          {isDarkMode ? (
            <Sun className="w-6 h-6 text-yellow-500" />
          ) : (
            <Moon className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>
    </div>
  );
}
