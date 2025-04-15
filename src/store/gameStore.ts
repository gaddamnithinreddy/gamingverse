import { create } from 'zustand';
import { games, simpleGames } from '../data/games';

interface GameStore {
  selectedCategory: string;
  searchQuery: string;
  showAllTrending: boolean;
  showAllPopular: boolean;
  showAllRecent: boolean;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setShowAllTrending: (show: boolean) => void;
  setShowAllPopular: (show: boolean) => void;
  setShowAllRecent: (show: boolean) => void;
  getFilteredGames: () => typeof games;
  getCategoryGames: (category: string) => typeof games;
}

export const useGameStore = create<GameStore>((set, get) => ({
  selectedCategory: 'all',
  searchQuery: '',
  showAllTrending: false,
  showAllPopular: false,
  showAllRecent: false,
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setShowAllTrending: (show) => set({ showAllTrending: show }),
  setShowAllPopular: (show) => set({ showAllPopular: show }),
  setShowAllRecent: (show) => set({ showAllRecent: show }),
  getFilteredGames: () => {
    const { selectedCategory, searchQuery } = get();
    const allGames = [...games, ...simpleGames];
    
    return allGames.filter(game => {
      const matchesCategory = 
        selectedCategory === 'all' || 
        game.genre.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = 
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  },
  getCategoryGames: (category) => {
    if (category === 'all') return [...games, ...simpleGames];
    return [...games, ...simpleGames].filter(
      game => game.genre.toLowerCase() === category.toLowerCase()
    );
  }
}));