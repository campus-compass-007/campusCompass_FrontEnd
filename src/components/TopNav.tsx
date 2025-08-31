import { Moon, Sun } from 'lucide-react';

interface TopNavProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export function TopNav({ isDarkMode, onToggleDarkMode }: TopNavProps) {
  return (
    <div className="relative z-40 p-4" style={{ backgroundColor: '#6c3d91' }}>
      <div className="flex items-center justify-between">
        {/* App Logo */}
        <div className="flex items-center">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
            <img 
              src="/assets/campus-compass-logo.png" 
              alt="CampusCompass Logo" 
              className="w-6 h-6 object-contain"
            />
          </div>
          <h1 className="text-white text-xl font-semibold">CampusCompass</h1>
        </div>

        {/* Dark Mode Toggle */}
        <button 
          onClick={onToggleDarkMode}
          className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
