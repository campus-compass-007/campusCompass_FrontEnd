import { useEffect, useState } from 'react';

/**
 * Hook to detect if the app is running as a PWA (standalone mode)
 */
export function useIsPWA(): boolean {
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    const checkPWA = () => {
      const standalone = 
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as Navigator & { standalone?: boolean }).standalone === true ||
        document.referrer.includes('android-app://');
      
      setIsPWA(standalone);
      
      // Add class to body for PWA-specific styling
      if (standalone) {
        document.body.classList.add('pwa-mode');
      } else {
        document.body.classList.remove('pwa-mode');
      }
    };

    checkPWA();

    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', checkPWA);

    return () => {
      mediaQuery.removeEventListener('change', checkPWA);
    };
  }, []);

  return isPWA;
}

/**
 * Utility function to check PWA mode synchronously
 */
export function checkIfPWA(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true ||
    document.referrer.includes('android-app://')
  );
}
