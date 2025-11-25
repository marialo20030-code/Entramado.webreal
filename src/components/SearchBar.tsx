import { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="relative">
      <div
        className={`flex items-center gap-2 px-4 py-2 bg-white rounded-full transition-all ${
          isFocused ? 'shadow-lg ring-2 ring-blue-200' : 'shadow-sm'
        }`}
      >
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Buscar..."
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
        />
        {query && (
          <button
            onClick={handleClear}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={16} className="text-gray-400" />
          </button>
        )}
      </div>
    </div>
  );
}
