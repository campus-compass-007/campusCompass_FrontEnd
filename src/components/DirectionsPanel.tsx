import { X, Navigation2, ArrowRight, ArrowLeft, ArrowUp, ChevronDown, ChevronUp, XCircle } from 'lucide-react';
import { Route, formatDistance, formatDuration } from '../services/routingService';
import { useState } from 'react';

interface DirectionsPanelProps {
  route: Route | null;
  onClose: () => void;
  isDarkMode?: boolean;
  destinationName?: string;
}

const getManeuverIcon = (type: string, modifier?: string) => {
  if (type === 'turn') {
    if (modifier?.includes('left')) return <ArrowLeft className="w-5 h-5" />;
    if (modifier?.includes('right')) return <ArrowRight className="w-5 h-5" />;
  }
  if (type === 'arrive') return <Navigation2 className="w-5 h-5" />;
  return <ArrowUp className="w-5 h-5" />;
};

export function DirectionsPanel({ route, onClose, isDarkMode, destinationName }: DirectionsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  console.log('🧭 DirectionsPanel render - route:', route, 'destination:', destinationName);
  
  if (!route) return null;

  return (
    <>
      {/* Desktop/Tablet View - Full Panel */}
      <div className={`hidden md:block fixed top-0 right-0 h-full w-96 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl z-50 overflow-y-auto`}>
        {/* Header */}
        <div className={`sticky top-0 ${isDarkMode ? 'bg-gray-900' : 'bg-blue-600'} text-white p-4 shadow-md`}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold">Directions</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 transition-colors flex items-center gap-2 text-sm font-medium"
                title="Stop Navigation"
              >
                <XCircle className="w-4 h-4" />
                <span>Stop</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          {destinationName && (
            <p className="text-sm opacity-90">To: {destinationName}</p>
          )}
          <div className="flex items-center gap-4 mt-3 text-sm">
            <div className="flex items-center gap-1">
              <Navigation2 className="w-4 h-4" />
              <span className="font-medium">{formatDistance(route.distance)}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">{formatDuration(route.duration)}</span>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="p-4">
          <div className="space-y-3">
            {route.steps.map((step, index) => (
              <div
                key={index}
                className={`flex gap-3 p-3 rounded-lg ${
                  isDarkMode ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
                } transition-colors`}
              >
                <div className={`flex-shrink-0 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {getManeuverIcon(step.maneuver.type, step.maneuver.modifier)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-1`}>
                    {step.instruction}
                  </p>
                  <div className={`flex items-center gap-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {step.distance > 0 && (
                      <span>{formatDistance(step.distance)}</span>
                    )}
                    {step.distance > 0 && step.duration > 0 && <span>•</span>}
                    {step.duration > 0 && (
                      <span>{formatDuration(step.duration)}</span>
                    )}
                  </div>
                </div>
                <div className={`flex-shrink-0 text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {index + 1}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className={`mt-6 p-4 rounded-lg ${isDarkMode ? 'bg-green-900/20 border border-green-700' : 'bg-green-50 border border-green-200'}`}>
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <Navigation2 className="w-5 h-5" />
              <div>
                <p className="font-semibold">You'll arrive at your destination</p>
                <p className="text-sm mt-1">
                  Total: {formatDistance(route.distance)} • {formatDuration(route.duration)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View - Collapsible Bottom Sheet */}
      <div className="md:hidden">
        {/* Collapsed Header - Always Visible */}
        <div
          className={`fixed bottom-16 left-0 right-0 ${isDarkMode ? 'bg-gray-900' : 'bg-blue-600'} text-white shadow-lg z-[90] transition-all duration-300`}
        >
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Navigation2 className="w-5 h-5" />
                <div className="text-left">
                  <p className="font-semibold text-sm">
                    {formatDistance(route.distance)} • {formatDuration(route.duration)}
                  </p>
                  {destinationName && (
                    <p className="text-xs opacity-90">To: {destinationName}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-red-500 hover:bg-red-600 transition-colors flex items-center gap-1.5 text-xs font-medium"
                  title="Stop Navigation"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Stop</span>
                </button>
                {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
              </div>
            </div>
          </button>
        </div>

        {/* Expandable Content */}
        {isExpanded && (
          <div
            className={`fixed bottom-32 left-0 right-0 max-h-[60vh] ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl z-[85] overflow-y-auto`}
          >
            <div className="p-4">
              <div className="space-y-2">
                {route.steps.map((step, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 p-3 rounded-lg ${
                      isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                    }`}
                  >
                    <div className={`flex-shrink-0 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      {getManeuverIcon(step.maneuver.type, step.maneuver.modifier)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        {step.instruction}
                      </p>
                      <div className={`flex items-center gap-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                        {step.distance > 0 && <span>{formatDistance(step.distance)}</span>}
                        {step.distance > 0 && step.duration > 0 && <span>•</span>}
                        {step.duration > 0 && <span>{formatDuration(step.duration)}</span>}
                      </div>
                    </div>
                    <div className={`flex-shrink-0 text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
