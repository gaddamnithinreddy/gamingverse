import React from 'react';
import { Search, Gamepad } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onFocus }) => {
  const { selectedCategory } = useGameStore();

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {selectedCategory === 'all' ? (
          <Search className="h-5 w-5 text-gray-400" />
        ) : (
          <Gamepad className="h-5 w-5 text-purple-400" />
        )}
      </div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        placeholder={`Search ${selectedCategory === 'all' ? 'games' : selectedCategory + ' games'}...`}
      />
    </div>
  );
};

export default SearchBar;