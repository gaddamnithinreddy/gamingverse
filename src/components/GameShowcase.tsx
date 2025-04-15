import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  Users, 
  Trophy,
  Flame,
  Clock,
  Heart,
  Gamepad,
  Filter
} from 'lucide-react';
import GameDetails from './GameDetails';

interface Game {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  rating: number;
  playCount: number;
  category: string;
  isNew?: boolean;
  isTrending?: boolean;
  features: string[];
  screenshots: string[];
}

const games: Game[] = [
  {
    id: '1',
    title: 'Space Warriors',
    description: 'Join the epic space battle in this multiplayer shooter. Customize your ship, form alliances, and dominate the galaxy in intense PvP combat.',
    imageUrl: '/games/space-warriors.jpg',
    rating: 4.8,
    playCount: 125000,
    category: 'Action',
    isTrending: true,
    features: [
      'Multiplayer Battles',
      'Ship Customization',
      'Clan System',
      'Weekly Tournaments'
    ],
    screenshots: [
      '/games/space-warriors/screenshot1.jpg',
      '/games/space-warriors/screenshot2.jpg',
      '/games/space-warriors/screenshot3.jpg',
      '/games/space-warriors/screenshot4.jpg'
    ]
  },
  {
    id: '2',
    title: 'Pixel Racers',
    description: 'Race through neon-lit tracks in this retro-style racing game. Collect power-ups, unlock new cars, and compete with players worldwide.',
    imageUrl: '/games/pixel-racers.jpg',
    rating: 4.5,
    playCount: 98000,
    category: 'Racing',
    isNew: true,
    features: [
      'Online Racing',
      'Car Collection',
      'Power-ups',
      'Global Leaderboards'
    ],
    screenshots: [
      '/games/pixel-racers/screenshot1.jpg',
      '/games/pixel-racers/screenshot2.jpg',
      '/games/pixel-racers/screenshot3.jpg',
      '/games/pixel-racers/screenshot4.jpg'
    ]
  }
];

const categories = [
  { id: 'all', label: 'All Games', icon: Gamepad },
  { id: 'trending', label: 'Trending', icon: Flame },
  { id: 'new', label: 'New', icon: Clock },
  { id: 'action', label: 'Action', icon: Trophy },
  { id: 'racing', label: 'Racing', icon: Trophy }
];

const GameShowcase: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [hoveredGame, setHoveredGame] = useState<string | null>(null);
  const [likedGames, setLikedGames] = useState<string[]>([]);

  const handleLikeGame = (gameId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setLikedGames(prev => 
      prev.includes(gameId) 
        ? prev.filter(id => id !== gameId)
        : [...prev, gameId]
    );
  };

  const filteredGames = games.filter(game => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'trending' && game.isTrending) return true;
    if (selectedCategory === 'new' && game.isNew) return true;
    return game.category.toLowerCase() === selectedCategory;
  });

  return (
    <section className="py-16 px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
          <motion.h2 
            className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            Featured Games
          </motion.h2>

          {/* Category Filters */}
          <motion.div 
            className="flex flex-wrap gap-3"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                          ${selectedCategory === category.id
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          } transition-all duration-300`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <category.icon size={16} />
                {category.label}
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredGames.map((game) => (
              <motion.div
                key={game.id}
                layout
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                whileHover={{ y: -8 }}
                className="relative group cursor-pointer"
                onClick={() => setSelectedGame(game)}
                onHoverStart={() => setHoveredGame(game.id)}
                onHoverEnd={() => setHoveredGame(null)}
              >
                <div className="relative h-64 rounded-xl overflow-hidden bg-gray-800">
                  <motion.img
                    src={game.imageUrl}
                    alt={game.title}
                    className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent opacity-60" />

                  {/* Game Info Overlay */}
                  <motion.div 
                    className="absolute inset-0 p-6 flex flex-col justify-end"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: hoveredGame === game.id ? 1 : 0.8,
                      y: hoveredGame === game.id ? 0 : 20
                    }}
                  >
                    <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="text-yellow-400" size={16} />
                          <span className="text-white font-medium">{game.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="text-purple-400" size={16} />
                          <span className="text-white font-medium">{game.playCount.toLocaleString()}</span>
                        </div>
                      </div>
                      <motion.button
                        className={`p-2 rounded-full ${
                          likedGames.includes(game.id) ? 'bg-pink-600' : 'bg-gray-700'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => handleLikeGame(game.id, e)}
                      >
                        <Heart
                          size={16}
                          className={likedGames.includes(game.id) ? 'fill-current' : ''}
                        />
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Status Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {game.isNew && (
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="px-3 py-1 rounded-full bg-green-500 text-white text-sm font-medium"
                      >
                        New
                      </motion.div>
                    )}
                    {game.isTrending && (
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="px-3 py-1 rounded-full bg-red-500 text-white text-sm font-medium"
                      >
                        Trending
                      </motion.div>
                    )}
                  </div>

                  {/* Play Button Overlay */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={false}
                  >
                    <motion.button
                      className="bg-purple-600 text-white px-6 py-2 rounded-full font-medium flex items-center gap-2"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Gamepad size={20} />
                      Play Now
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Game Details Modal */}
        <GameDetails
          isOpen={!!selectedGame}
          onClose={() => setSelectedGame(null)}
          game={selectedGame!}
        />
      </motion.div>
    </section>
  );
};

export default GameShowcase; 