import { useState } from 'react';
import { Search, X, Clock, MapPin } from 'lucide-react';

interface SearchResult {
  id: string;
  name: string;
  address: string;
  type: 'recent' | 'suggestion';
}

interface SearchBarProps {
  onSearch: (query: string) => void;
  onResultSelect: (result: SearchResult) => void;
}

const mockSearchResults: SearchResult[] = [
  { id: '1', name: 'Central Park', address: '59th St, New York, NY', type: 'recent' },
  { id: '2', name: 'Times Square', address: 'Times Square, New York, NY', type: 'recent' },
  { id: '3', name: 'Starbucks Coffee', address: '123 Main St, New York, NY', type: 'suggestion' },
  { id: '4', name: 'McDonald\'s', address: '456 Broadway, New York, NY', type: 'suggestion' },
];

export function SearchBar({ onSearch, onResultSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (value.length > 0) {
      const filteredResults = mockSearchResults.filter(result =>
        result.name.toLowerCase().includes(value.toLowerCase()) ||
        result.address.toLowerCase().includes(value.toLowerCase())
      );
      setResults(filteredResults);
    } else {
      setResults(mockSearchResults.filter(r => r.type === 'recent'));
    }
  };

  const handleFocus = () => {
    setIsActive(true);
    setResults(mockSearchResults.filter(r => r.type === 'recent'));
  };

  const handleBlur = () => {
    // Delay to allow for result selection
    setTimeout(() => setIsActive(false), 150);
  };

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
      setIsActive(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setQuery(result.name);
    onResultSelect(result);
    setIsActive(false);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
  };

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 ml-4" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search for places..."
          className="flex-1 px-3 py-4 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="p-2 mr-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          </button>
        )}
      </div>

      {/* Search Results */}
      {isActive && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-h-80 overflow-y-auto z-50 border dark:border-gray-700">
          {results.length > 0 ? (
            <div className="py-2">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-left transition-colors"
                >
                  {result.type === 'recent' ? (
                    <Clock className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  ) : (
                    <MapPin className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-gray-900 dark:text-gray-100">{result.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{result.address}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              <p>No results found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}