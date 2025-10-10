import { useState, useEffect } from 'react';
import { LandingPage } from '../pages/LandingPage';
import App from '../App';
import { registerSW } from '../utils/pwa';

// Check if app is running as PWA (standalone mode)
const isPWA = (): boolean => {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true || // iOS
    document.referrer.includes('android-app://') // Android TWA
  );
};

export function AppRouter() {
  // Initialize route based on PWA mode to prevent flash
  const getInitialRoute = () => {
    const path = window.location.pathname;
    if (isPWA() && (path === '/' || path === '/landing')) {
      return '/app';
    }
    return path;
  };

  const [currentRoute, setCurrentRoute] = useState(getInitialRoute);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Simple client-side routing
    const path = window.location.pathname;
    
    // If running as PWA and on root path, redirect to /app
    if (isPWA() && (path === '/' || path === '/landing')) {
      window.history.replaceState({}, '', '/app');
      setCurrentRoute('/app');
    } else {
      setCurrentRoute(path);
    }
    
    // Mark as initialized to prevent flash
    setIsInitialized(true);

    // Update body class based on route
    if (path.startsWith('/app') || (isPWA() && (path === '/' || path === '/landing'))) {
      document.body.classList.add('app-route');
      registerSW();
    } else {
      document.body.classList.remove('app-route');
    }

    // Listen for popstate events (back/forward navigation)
    const handlePopState = () => {
      const newPath = window.location.pathname;
      setCurrentRoute(newPath);
      
      // Update body class and register SW when navigating to app
      if (newPath.startsWith('/app')) {
        document.body.classList.add('app-route');
        registerSW();
      } else {
        document.body.classList.remove('app-route');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Route navigation function
  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentRoute(path);
  };

  // Provide navigation context to child components
  useEffect(() => {
    (window as Window & { navigate?: (path: string) => void }).navigate = navigate;
  }, []);

  // Show loading screen while initializing to prevent flash
  if (!isInitialized) {
    return (
      <div style={{ 
        width: '100%', 
        height: '100vh', 
        backgroundColor: '#6c3d91', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        gap: '20px'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '4px solid rgba(255, 255, 255, 0.3)',
          borderTop: '4px solid white',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Route rendering
  if (currentRoute === '/' || currentRoute === '/landing') {
    return <LandingPage />;
  }

  if (currentRoute === '/app' || currentRoute.startsWith('/app/')) {
    return <App />;
  }

  // Default fallback to landing page
  return <LandingPage />;
}
