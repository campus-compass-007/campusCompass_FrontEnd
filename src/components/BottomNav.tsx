import { Home, Building, Phone } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onHomeClick: () => void;
  onBuildingsClick: () => void;
  onContactsClick: () => void;
}

export function BottomNav({ 
  activeTab, 
  onHomeClick, 
  onBuildingsClick, 
  onContactsClick 
}: BottomNavProps) {
  return (
    <>
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
        <div className="flex justify-around items-center py-2 px-4">
          <button 
            onClick={onHomeClick}
            className={`flex flex-col items-center justify-center p-3 rounded-full transition-colors ${
              activeTab === 'home' 
                ? 'bg-gray-100 dark:bg-gray-700' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Home className={`w-6 h-6 ${
              activeTab === 'home' 
                ? 'text-purple-600 dark:text-purple-400' 
                : 'text-gray-600 dark:text-gray-400'
            }`} />
          </button>
          
          <button 
            onClick={onBuildingsClick}
            className={`flex flex-col items-center justify-center p-3 rounded-full transition-colors ${
              activeTab === 'buildings' 
                ? 'bg-gray-100 dark:bg-gray-700' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Building className={`w-6 h-6 ${
              activeTab === 'buildings' 
                ? 'text-purple-600 dark:text-purple-400' 
                : 'text-gray-600 dark:text-gray-400'
            }`} />
          </button>
          
          <button 
            onClick={onContactsClick}
            className={`flex flex-col items-center justify-center p-3 rounded-full transition-colors ${
              activeTab === 'contact' 
                ? 'bg-gray-100 dark:bg-gray-700' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Phone className={`w-6 h-6 ${
              activeTab === 'contact' 
                ? 'text-purple-600 dark:text-purple-400' 
                : 'text-gray-600 dark:text-gray-400'
            }`} />
          </button>
        </div>
      </div>

      {/* Bottom padding to account for fixed navbar */}
      <div className="h-16"></div>
    </>
  );
}
