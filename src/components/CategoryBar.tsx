import React from 'react';
import { Gamepad, Sword, Brain, Crosshair, Dice5, Car } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { FaGamepad } from 'react-icons/fa';

interface CategoryBarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: 'all', name: 'All Games', icon: Gamepad },
  { id: 'action', name: 'Action', icon: Sword },
  { id: 'puzzle', name: 'Puzzle', icon: Brain },
  { id: 'shooting', name: 'Shooting', icon: Crosshair },
  { id: 'casual', name: 'Casual', icon: Dice5 },
  { id: 'racing', name: 'Racing', icon: Car },
];

export default function CategoryBar({ selectedCategory, onCategoryChange }: CategoryBarProps) {
  return (
    <div className="category-bar list-container bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl mb-8">
      <div className="flex flex-wrap gap-4 justify-center">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => onCategoryChange(category.name)}
            className={`
              button-press category-button flex items-center space-x-2 px-4 py-2 rounded-lg 
              transition-all duration-300 hover-lift
              ${selectedCategory === category.name 
                ? 'bg-purple-600 text-white pulse-glow' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }
            `}
          >
            <category.icon className="w-5 h-5 hover-rotate" />
            <span className="text-shimmer">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};