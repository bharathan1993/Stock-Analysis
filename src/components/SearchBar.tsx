import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { StockSuggestion, searchStocks } from '../services/stockApi';
import { useDebounce } from '../hooks/useDebounce';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

export function SearchBar({ value, onChange, onSearch }: SearchBarProps) {
  const [suggestions, setSuggestions] = useState<StockSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debouncedValue = useDebounce(value, 300);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedValue) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const results = await searchStocks(debouncedValue);
        setSuggestions(results);
        setIsOpen(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedValue]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionClick = (suggestion: StockSuggestion) => {
    onChange(suggestion.symbol);
    setIsOpen(false);
    onSearch();
  };

  return (
    <div className="flex w-full max-w-md gap-2" ref={wrapperRef}>
      <div className="relative flex-1">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          onFocus={() => value && setIsOpen(true)}
          placeholder="Enter stock symbol (e.g., WIPRO, TCS)"
          className="w-full px-4 py-2 pl-10 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

        {/* Suggestions Dropdown */}
        {isOpen && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion.symbol}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`w-full px-4 py-2 text-left hover:bg-indigo-50 flex flex-col ${
                  index !== suggestions.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <span className="font-medium text-gray-800">{suggestion.symbol}</span>
                <span className="text-sm text-gray-500">{suggestion.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="absolute right-3 top-2.5">
            <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      <button
        onClick={onSearch}
        className="px-6 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Search
      </button>
    </div>
  );
}