import { useState, useEffect } from 'react';
import { LandingPage } from '../pages/LandingPage';
import App from '../App';
import { registerSW } from '../utils/pwa';

export function AppRouter() {
  const [currentRoute, setCurrentRoute] = useState('/');

  useEffect(() => {
    // Simple client-side routing
    const path = window.location.pathname;
    setCurrentRoute(path);

    // Update body class based on route
    if (path.startsWith('/app')) {
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
