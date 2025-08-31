import { useState, useEffect } from 'react';
import { MapView } from './components/MapView';
import { BottomSheet } from './components/BottomSheet';
import { BuildingsMenu } from './components/BuildingsMenu';
import { ContactsMenu } from './components/ContactsMenu';
import { BottomNav } from './components/BottomNav';
import { TopNav } from './components/TopNav';
import { PWAUpdateNotification } from './components/PWAUpdateNotification';

interface Location {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: 'restaurant' | 'store' | 'landmark' | 'gas_station';
}

export default function App() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [showBuildingsMenu, setShowBuildingsMenu] = useState(false);
  const [showContactsMenu, setShowContactsMenu] = useState(false);

  // Apply dark mode class to document element with smooth transition
  useEffect(() => {
    const htmlElement = document.documentElement;
    
    if (isDarkMode) {
      htmlElement.classList.add('dark');
      htmlElement.style.colorScheme = 'dark';
    } else {
      htmlElement.classList.remove('dark');
      htmlElement.style.colorScheme = 'light';
    }
    
    // Force a repaint to prevent flashing
    void htmlElement.offsetHeight;
  }, [isDarkMode]);

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleCloseBottomSheet = () => {
    setSelectedLocation(null);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleBuildingsClick = () => {
    setActiveTab('buildings');
    setShowContactsMenu(false); // Close contacts menu
    setShowBuildingsMenu(true);
  };

  const handleCloseBuildingsMenu = () => {
    setShowBuildingsMenu(false);
    setActiveTab('home'); // Reset to home when closing
  };

  const handleContactsClick = () => {
    setActiveTab('contact');
    setShowBuildingsMenu(false); // Close buildings menu
    setShowContactsMenu(true);
  };

  const handleCloseContactsMenu = () => {
    setShowContactsMenu(false);
    setActiveTab('home'); // Reset to home when closing
  };

  const handleHomeClick = () => {
    setActiveTab('home');
    setShowBuildingsMenu(false); // Close buildings menu
    setShowContactsMenu(false); // Close contacts menu
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* Top Bar */}
      <TopNav 
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Map View */}
      <div className="flex-1 relative">
        <MapView
          onLocationSelect={handleLocationSelect}
          selectedLocation={selectedLocation}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Bottom Sheet */}
      <BottomSheet
        location={selectedLocation}
        onClose={handleCloseBottomSheet}
        isDarkMode={isDarkMode}
      />

      {/* Buildings Menu */}
      <BuildingsMenu
        isOpen={showBuildingsMenu}
        onClose={handleCloseBuildingsMenu}
      />

      {/* Contacts Menu */}
      <ContactsMenu
        isOpen={showContactsMenu}
        onClose={handleCloseContactsMenu}
      />

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onHomeClick={handleHomeClick}
        onBuildingsClick={handleBuildingsClick}
        onContactsClick={handleContactsClick}
      />

      {/* PWA Update Notification */}
      <PWAUpdateNotification />
    </div>
  );
}