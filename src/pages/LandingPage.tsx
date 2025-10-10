import { useState, useEffect } from 'react';
import { Download, Globe, X, Share, PlusSquare, MoreVertical } from 'lucide-react';

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
  const [showInstructions, setShowInstructions] = useState(false);
  const [userDevice, setUserDevice] = useState<'ios' | 'android' | 'desktop'>('desktop');

  useEffect(() => {
    // Detect user's device
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setUserDevice('ios');
    } else if (/android/.test(userAgent)) {
      setUserDevice('android');
    } else {
      setUserDevice('desktop');
    }

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
    if (!deferredPrompt) {
      // No native install prompt available, show instructions
      setShowInstructions(true);
      return;
    }

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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-8">
        {/* Header with Logo */}
        <div className="flex items-center gap-4 mb-12">
          <img 
            src="/assets/NWULogo.png" 
            alt="NWU Logo" 
            className="w-12 h-12 md:w-16 md:h-16 object-contain"
          />
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            CampusCompass
          </h1>
        </div>

        {/* Main Hero Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Navigate Your<br />Campus with Ease
            </h2>
            <p className="text-purple-100 text-lg leading-relaxed">
              Find your way around NWU Potchefstroom campus effortlessly. Locate lecture halls, libraries, dining areas, and more with CampusCompass.
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-md">
              {isInstalled ? (
                <div className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 font-medium">
                  ✓ App Installed
                </div>
              ) : (
                <button
                  onClick={handleInstallClick}
                  className="flex-1 bg-white text-purple-800 py-3 px-6 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-gray-100 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download for Free
                </button>
              )}
              
              <button
                onClick={handleWebAppClick}
                className="flex-1 bg-transparent border-2 border-white text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-white hover:text-purple-800 transition-colors"
              >
                <Globe className="w-4 h-4" />
                Try Web Version
              </button>
            </div>
          </div>
          
          <div className="flex justify-center lg:justify-end">
            <img 
              src="/assets/Map.png" 
              alt="Campus Map" 
              className="w-full max-w-md lg:max-w-lg h-64 md:h-80 lg:h-96 object-cover rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Campus Gate Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <img 
                src="/assets/vaalhek.jpg" 
                alt="NWU Campus Gate" 
                className="w-full h-64 md:h-80 object-cover rounded-lg shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="w-full h-64 md:h-80 bg-gray-200 rounded-lg shadow-lg flex items-center justify-center"><span class="text-gray-600 text-lg font-medium">NWU Campus Gate</span></div>';
                  }
                }}
              />
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-3xl md:text-4xl font-bold text-purple-800 mb-6">
                Never Get Lost on Campus Again
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                Find your classes, discover hidden study spots, and locate all campus amenities in seconds. CampusCompass is designed to make campus navigation effortless for students, faculty, and visitors - making NWU Potchefstroom feel like home from day one.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Campus Building Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="/assets/campusBuilding.png" 
                alt="Campus Building" 
                className="w-full h-64 md:h-80 object-cover rounded-lg shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="w-full h-64 md:h-80 bg-gray-300 rounded-lg shadow-lg flex items-center justify-center"><span class="text-gray-700 text-lg font-medium">Campus Building</span></div>';
                  }
                }}
              />
            </div>
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-purple-800 mb-6">
                Seamless Mobile Experience
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Designed for mobile-first navigation with intuitive gestures, clear visuals, and lightning-fast performance. Navigate your campus even while you're walking or biking.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  Dark mode for night-time travel
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  GPS-enabled navigation
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  Offline & backup data support
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <img 
                src="/assets/Phone.jpg" 
                alt="Mobile App Interface" 
                className="w-full h-64 md:h-80 object-cover rounded-lg shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="w-full h-64 md:h-80 bg-gray-200 rounded-lg shadow-lg flex items-center justify-center"><span class="text-gray-600 text-lg font-medium">Mobile App Interface</span></div>';
                  }
                }}
              />
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-3xl md:text-4xl font-bold text-purple-800 mb-6">
                Ready To Navigate Smarter?
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                Join millions of users who trust our app for their daily navigation. Download now and experience the difference.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {isInstalled ? (
                  <div className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 font-medium">
                    ✓ App Installed
                  </div>
                ) : (
                  <button
                    onClick={handleInstallClick}
                    className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-purple-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download for Free
                  </button>
                )}
                
                <button
                  onClick={handleWebAppClick}
                  className="flex-1 bg-transparent border-2 border-purple-600 text-purple-600 py-3 px-6 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-purple-600 hover:text-white transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  Try Web Version
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-purple-900 text-center py-8">
        <p className="text-purple-300 text-sm">
          © 2025 CampusCompass. Made for NWU Potchefstroom students and staff.
        </p>
      </div>

      {/* Installation Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 bg-purple-600 text-white p-4 flex items-center justify-between rounded-t-lg">
              <h3 className="text-xl font-bold">Install CampusCompass</h3>
              <button
                onClick={() => setShowInstructions(false)}
                className="p-1 hover:bg-purple-700 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {userDevice === 'ios' && (
                <>
                  <div className="text-center">
                    <div className="inline-block p-3 bg-purple-100 rounded-full mb-3">
                      <Share className="w-8 h-8 text-purple-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      Install on iPhone/iPad
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Follow these steps to add CampusCompass to your home screen:
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                        1
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">Open in Safari</p>
                        <p className="text-gray-600 text-sm">Make sure you're viewing this page in Safari browser (not Chrome or others)</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                        2
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium flex items-center gap-2">
                          Tap the Share button <Share className="w-4 h-4" />
                        </p>
                        <p className="text-gray-600 text-sm">Located at the bottom of your screen (square with arrow pointing up)</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                        3
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium flex items-center gap-2">
                          Tap "Add to Home Screen" <PlusSquare className="w-4 h-4" />
                        </p>
                        <p className="text-gray-600 text-sm">Scroll down in the share menu to find this option</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                        4
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">Tap "Add"</p>
                        <p className="text-gray-600 text-sm">The app icon will appear on your home screen</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm">
                      <strong>Tip:</strong> Once installed, the app will open like a native app without browser UI!
                    </p>
                  </div>
                </>
              )}

              {userDevice === 'android' && (
                <>
                  <div className="text-center">
                    <div className="inline-block p-3 bg-purple-100 rounded-full mb-3">
                      <Download className="w-8 h-8 text-purple-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      Install on Android
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Follow these steps to install CampusCompass:
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                        1
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium flex items-center gap-2">
                          Tap the menu button <MoreVertical className="w-4 h-4" />
                        </p>
                        <p className="text-gray-600 text-sm">Located at the top right of your browser (three dots)</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                        2
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">Tap "Add to Home screen" or "Install app"</p>
                        <p className="text-gray-600 text-sm">You might also see an install banner at the bottom</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                        3
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">Tap "Install"</p>
                        <p className="text-gray-600 text-sm">The app will be added to your home screen</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm">
                      <strong>Tip:</strong> The app works offline and feels just like a native Android app!
                    </p>
                  </div>
                </>
              )}

              {userDevice === 'desktop' && (
                <>
                  <div className="text-center">
                    <div className="inline-block p-3 bg-purple-100 rounded-full mb-3">
                      <Download className="w-8 h-8 text-purple-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      Install on Desktop
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Install CampusCompass as a desktop app:
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                        1
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">Look for the install icon</p>
                        <p className="text-gray-600 text-sm">In Chrome/Edge: Click the install icon in the address bar (computer with arrow)</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                        2
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">Click "Install"</p>
                        <p className="text-gray-600 text-sm">The app will open in its own window</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm">
                      <strong>Note:</strong> For the best mobile experience, we recommend installing on your phone!
                    </p>
                  </div>
                </>
              )}

              {/* Close Button */}
              <button
                onClick={() => setShowInstructions(false)}
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
