import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Users, Clock, Star, ChevronRight } from 'lucide-react';

interface Tournament {
  id: string;
  title: string;
  game: string;
  players: number;
  maxPlayers: number;
  startTime: string;
  prizePool: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Pro';
  imageUrl: string;
}

const tournaments: Tournament[] = [
  {
    id: '1',
    title: 'Weekly Champions Cup',
    game: 'Space Warriors',
    players: 128,
    maxPlayers: 256,
    startTime: '2h 15m',
    prizePool: '5000',
    difficulty: 'Intermediate',
    imageUrl: '/tournaments/space-warriors.jpg'
  },
  {
    id: '2',
    title: 'Pro League Finals',
    game: 'Pixel Racers',
    players: 45,
    maxPlayers: 64,
    startTime: '45m',
    prizePool: '10000',
    difficulty: 'Pro',
    imageUrl: '/tournaments/pixel-racers.jpg'
  },
  {
    id: '3',
    title: 'Beginner Battle Royale',
    game: 'Forest Fighters',
    players: 25,
    maxPlayers: 100,
    startTime: '3h',
    prizePool: '2000',
    difficulty: 'Beginner',
    imageUrl: '/tournaments/forest-fighters.jpg'
  }
];

const TournamentsSection: React.FC = () => {
  const [selectedTournament, setSelectedTournament] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);

  const getDifficultyColor = (difficulty: Tournament['difficulty']) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-500';
      case 'Intermediate':
        return 'bg-yellow-500';
      case 'Pro':
        return 'bg-red-500';
    }
  };

  const handleJoinTournament = (tournamentId: string) => {
    setSelectedTournament(tournamentId);
    setIsJoining(true);
    // Simulate joining animation
    setTimeout(() => {
      setIsJoining(false);
      // You can add additional logic here
    }, 1500);
  };

  return (
    <section className="py-16 px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex items-center justify-between mb-12">
          <motion.h2 
            className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            Active Tournaments
          </motion.h2>
          <motion.button
            className="px-6 py-2 rounded-full bg-purple-600 text-white flex items-center gap-2 hover:bg-purple-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All
            <ChevronRight size={20} />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {tournaments.map((tournament) => (
              <motion.div
                key={tournament.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -8 }}
                className="bg-gray-800 rounded-xl overflow-hidden relative group"
              >
                {/* Tournament Image */}
                <div className="relative h-48 overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                  />
                  <motion.img
                    src={tournament.imageUrl}
                    alt={tournament.title}
                    className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4">
                    <motion.div
                      className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getDifficultyColor(tournament.difficulty)}`}
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                    >
                      {tournament.difficulty}
                    </motion.div>
                  </div>
                </div>

                {/* Tournament Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{tournament.title}</h3>
                  <p className="text-gray-400 mb-4">{tournament.game}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Users size={18} className="text-purple-400" />
                      <span className="text-gray-300">
                        {tournament.players}/{tournament.maxPlayers}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={18} className="text-purple-400" />
                      <span className="text-gray-300">Starts in {tournament.startTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy size={18} className="text-purple-400" />
                      <span className="text-gray-300">${tournament.prizePool}</span>
                    </div>
                  </div>

                  <motion.button
                    onClick={() => handleJoinTournament(tournament.id)}
                    className={`w-full py-3 rounded-lg font-medium text-white 
                              ${isJoining && selectedTournament === tournament.id
                                ? 'bg-green-500'
                                : 'bg-purple-600 hover:bg-purple-700'
                              } transition-colors`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isJoining && selectedTournament === tournament.id ? (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center gap-2"
                      >
                        <Star className="animate-spin" size={20} />
                        Joining...
                      </motion.span>
                    ) : (
                      'Join Tournament'
                    )}
                  </motion.button>
                </div>

                {/* Hover Effect Overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                  animate={{ opacity: selectedTournament === tournament.id ? 0.2 : 0 }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
};

export default TournamentsSection; 