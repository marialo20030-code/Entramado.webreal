import { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [isFocused, setIsFocused] = useState(false);

  // Sincronizar query con la URL cuando cambia (navegación del navegador)
  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';
    if (urlQuery !== query) {
      setQuery(urlQuery);
      onSearch(urlQuery);
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
    
    // Actualizar la URL
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set('q', value);
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams, { replace: false });
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('q');
    setSearchParams(newParams, { replace: false });
  };

  return (
    <div className="relative flex items-center gap-2 w-full">
      <div
        className={`flex items-center gap-2 px-4 py-2.5 bg-white rounded-full transition-all flex-1 ${
          isFocused ? 'shadow-lg ring-2 ring-blue-200' : 'shadow-sm hover:shadow-md'
        }`}
      >
        <Search size={18} className="text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Buscar..."
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400 min-w-0"
        />
        {query && (
          <button
            onClick={handleClear}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
          >
            <X size={16} className="text-gray-400" />
          </button>
        )}
      </div>
    </div>
  );
}
