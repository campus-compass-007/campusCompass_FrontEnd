import { useState, useEffect } from 'react';
import { Download, MapPin, Smartphone, Globe, CheckCircle } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function LandingPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsInstalled(isStandalone);

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const handleWebAppClick = () => {
    // Navigate to the main app using the router
    const navigate = (window as Window & { navigate?: (path: string) => void }).navigate;
    if (navigate) {
      navigate('/app');
    } else {
      // Fallback for direct navigation
      window.location.href = '/app';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 overflow-x-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen px-4 py-8 md:justify-center">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-2xl">
            <MapPin className="w-8 h-8 md:w-10 md:h-10 text-purple-600" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-3 md:mb-4">
            CampusCompass
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-purple-100 max-w-2xl mx-auto leading-relaxed px-2">
            Navigate North West University Potchefstroom Campus with ease
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto mb-8 md:mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 md:p-6 text-center">
            <MapPin className="w-6 h-6 md:w-8 md:h-8 text-white mx-auto mb-3 md:mb-4" />
            <h3 className="text-white font-semibold mb-2 text-sm md:text-base">Interactive Maps</h3>
            <p className="text-purple-100 text-xs md:text-sm">Explore campus with detailed interactive maps</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 md:p-6 text-center">
            <Smartphone className="w-6 h-6 md:w-8 md:h-8 text-white mx-auto mb-3 md:mb-4" />
            <h3 className="text-white font-semibold mb-2 text-sm md:text-base">Mobile Optimized</h3>
            <p className="text-purple-100 text-xs md:text-sm">Designed for mobile-first navigation</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 md:p-6 text-center">
            <Globe className="w-6 h-6 md:w-8 md:h-8 text-white mx-auto mb-3 md:mb-4" />
            <h3 className="text-white font-semibold mb-2 text-sm md:text-base">Offline Ready</h3>
            <p className="text-purple-100 text-xs md:text-sm">Works even when you're offline</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 md:flex-row md:gap-4 max-w-md mx-auto w-full">
          {/* PWA Install Button */}
          {isInstalled ? (
            <div className="w-full md:flex-1 bg-green-600 text-white py-3 md:py-4 px-4 md:px-6 rounded-lg flex items-center justify-center gap-3 font-semibold shadow-lg text-sm md:text-base">
              <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
              App Installed
            </div>
          ) : isInstallable ? (
            <button
              onClick={handleInstallClick}
              className="w-full md:flex-1 bg-white text-purple-800 py-3 md:py-4 px-4 md:px-6 rounded-lg flex items-center justify-center gap-3 font-semibold hover:bg-purple-50 transition-colors shadow-lg text-sm md:text-base"
            >
              <Download className="w-4 h-4 md:w-5 md:h-5" />
              Install App
            </button>
          ) : (
            <div className="w-full md:flex-1 bg-white/20 text-white py-3 md:py-4 px-4 md:px-6 rounded-lg flex items-center justify-center gap-3 font-semibold opacity-50 cursor-not-allowed text-sm md:text-base">
              <Download className="w-4 h-4 md:w-5 md:h-5" />
              Install Not Available
            </div>
          )}

          {/* Web App Button */}
          <button
            onClick={handleWebAppClick}
            className="w-full md:flex-1 bg-purple-600 text-white py-3 md:py-4 px-4 md:px-6 rounded-lg flex items-center justify-center gap-3 font-semibold hover:bg-purple-700 transition-colors shadow-lg border-2 border-purple-400 text-sm md:text-base"
          >
            <Globe className="w-4 h-4 md:w-5 md:h-5" />
            Open Web App
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 md:mt-12 text-center max-w-2xl mx-auto">
          <p className="text-purple-200 text-xs md:text-sm mb-3 md:mb-4 px-2">
            CampusCompass helps you navigate the NWU Potchefstroom campus with real-time directions, 
            building information, and contact details.
          </p>
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 text-purple-300 text-xs px-2">
            <span>• Buildings & Locations</span>
            <span>• Emergency Contacts</span>
            <span>• Offline Maps</span>
            <span>• Dark Mode</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 md:mt-16 text-center pb-4">
          <p className="text-purple-300 text-xs md:text-sm px-2">
            © 2025 CampusCompass. Made for NWU Potchefstroom students and staff.
          </p>
        </div>
      </div>
    </div>
  );
}
