import { useState, useEffect, useCallback } from 'react';
import { MapView } from './components/MapView';
import { BottomSheet } from './components/BottomSheet';
import { BuildingsMenu } from './components/BuildingsMenu';
import { ContactsMenu } from './components/ContactsMenu';
import { BottomNav } from './components/BottomNav';
import { TopNav } from './components/TopNav';
import { PWAUpdateNotification } from './components/PWAUpdateNotification';
import { DirectionsPanel } from './components/DirectionsPanel';
import { Location } from './types';
import { Route } from './services/routingService';

export default function App() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [showBuildingsMenu, setShowBuildingsMenu] = useState(false);
  const [showContactsMenu, setShowContactsMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null);
  const [routeDestination, setRouteDestination] = useState<Location | null>(null);
  const [shouldCalculateRoute, setShouldCalculateRoute] = useState(false);

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

  const handleLocationSelect = useCallback((location: Location) => {
    setSelectedLocation(location);
  }, []);

  const handleCloseBottomSheet = useCallback(() => {
    setSelectedLocation(null);
    setShouldCalculateRoute(false);
    setCurrentRoute(null);
    setRouteDestination(null);
  }, []);

  const handleNavigate = useCallback((location: Location) => {
    setShouldCalculateRoute(true);
    setRouteDestination(location);
  }, []);

  const handleRouteCalculated = useCallback((route: Route, destination: Location) => {
    console.log('📍 App: Route calculated callback triggered', route, destination);
    setCurrentRoute(route);
    setRouteDestination(destination);
    setShouldCalculateRoute(false);
    console.log('📍 App: Current route state updated');
    // Close the bottom sheet when route is shown
    setSelectedLocation(null);
  }, []);

  const handleCloseDirections = useCallback(() => {
    setCurrentRoute(null);
    setRouteDestination(null);
    setShouldCalculateRoute(false);
  }, []);

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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // If user is searching, automatically open buildings menu
    if (query.trim() && !showBuildingsMenu) {
      setShowBuildingsMenu(true);
      setActiveTab('buildings');
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* Top Bar */}
      <TopNav 
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onSearch={handleSearch}
      />

      {/* Map View */}
      <div className="flex-1 relative">
        <MapView
          onLocationSelect={handleLocationSelect}
          selectedLocation={selectedLocation}
          isDarkMode={isDarkMode}
          onRouteCalculated={handleRouteCalculated}
          shouldCalculateRoute={shouldCalculateRoute}
          onRouteClear={handleCloseDirections}
          currentRoute={currentRoute}
        />
      </div>

      {/* Bottom Sheet */}
      <BottomSheet
        location={selectedLocation}
        onClose={handleCloseBottomSheet}
        isDarkMode={isDarkMode}
        onNavigate={handleNavigate}
      />

      {/* Buildings Menu */}
      <BuildingsMenu
        isOpen={showBuildingsMenu}
        onClose={handleCloseBuildingsMenu}
        searchQuery={searchQuery}
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

      {/* Directions Panel */}
      <DirectionsPanel
        route={currentRoute}
        onClose={handleCloseDirections}
        isDarkMode={isDarkMode}
        destinationName={routeDestination?.name}
      />
    </div>
  );
}