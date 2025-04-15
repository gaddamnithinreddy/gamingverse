import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy,
  Medal,
  Crown,
  Users,
  Clock,
  ChevronUp,
  ChevronDown,
  Search
} from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar: string;
  score: number;
  change: number;
  isOnline: boolean;
  lastPlayed: string;
  winStreak: number;
}

const leaderboardData: LeaderboardEntry[] = [
  {
    rank: 1,
    username: "ProGamer123",
    avatar: "/avatars/player1.jpg",
    score: 15000,
    change: 2,
    isOnline: true,
    lastPlayed: "2m ago",
    winStreak: 5
  },
  {
    rank: 2,
    username: "SpeedRunner",
    avatar: "/avatars/player2.jpg",
    score: 14500,
    change: 0,
    isOnline: true,
    lastPlayed: "5m ago",
    winStreak: 3
  },
  {
    rank: 3,
    username: "GameMaster",
    avatar: "/avatars/player3.jpg",
    score: 14000,
    change: -1,
    isOnline: false,
    lastPlayed: "1h ago",
    winStreak: 0
  }
];

const timeRanges = [
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'allTime', label: 'All Time' }
];

const Leaderboard: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('weekly');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredPlayer, setHoveredPlayer] = useState<number | null>(null);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="text-yellow-400" size={20} />;
      case 2:
        return <Medal className="text-gray-300" size={20} />;
      case 3:
        return <Medal className="text-yellow-700" size={20} />;
      default:
        return <span className="text-gray-400 font-medium">{rank}</span>;
    }
  };

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
            Leaderboard
          </motion.h2>

          {/* Time Range Filters */}
          <motion.div 
            className="flex gap-2"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {timeRanges.map((range) => (
              <motion.button
                key={range.id}
                onClick={() => setSelectedTimeRange(range.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium
                          ${selectedTimeRange === range.id
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          } transition-all duration-300`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {range.label}
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Leaderboard Table */}
        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 text-sm font-medium text-gray-400">
            <div className="col-span-1">Rank</div>
            <div className="col-span-4">Player</div>
            <div className="col-span-2 text-center">Score</div>
            <div className="col-span-2 text-center">Win Streak</div>
            <div className="col-span-2 text-center">Change</div>
            <div className="col-span-1 text-center">Status</div>
          </div>

          <AnimatePresence>
            {leaderboardData.map((player) => (
              <motion.div
                key={player.rank}
                className={`grid grid-cols-12 gap-4 p-4 items-center border-b border-gray-700/50
                           ${hoveredPlayer === player.rank ? 'bg-gray-700/30' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ backgroundColor: 'rgba(75, 85, 99, 0.3)' }}
                onHoverStart={() => setHoveredPlayer(player.rank)}
                onHoverEnd={() => setHoveredPlayer(null)}
              >
                <div className="col-span-1 flex items-center justify-center">
                  {getRankIcon(player.rank)}
                </div>

                <div className="col-span-4 flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={player.avatar}
                      alt={player.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {player.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-gray-800" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-white">{player.username}</div>
                    <div className="text-sm text-gray-400">Last played {player.lastPlayed}</div>
                  </div>
                </div>

                <div className="col-span-2 text-center font-medium text-white">
                  {player.score.toLocaleString()}
                </div>

                <div className="col-span-2 text-center">
                  <motion.div
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full
                              ${player.winStreak > 0 ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}
                    animate={{ scale: hoveredPlayer === player.rank ? 1.1 : 1 }}
                  >
                    <Trophy size={14} />
                    {player.winStreak}
                  </motion.div>
                </div>

                <div className="col-span-2 text-center">
                  <motion.div
                    className={`inline-flex items-center gap-1
                              ${player.change > 0 ? 'text-green-400' : 
                                player.change < 0 ? 'text-red-400' : 'text-gray-400'}`}
                    animate={{ y: hoveredPlayer === player.rank ? -2 : 0 }}
                  >
                    {player.change > 0 ? (
                      <ChevronUp size={16} />
                    ) : player.change < 0 ? (
                      <ChevronDown size={16} />
                    ) : (
                      <div className="w-4 h-0.5 bg-gray-400 rounded-full" />
                    )}
                    {Math.abs(player.change)}
                  </motion.div>
                </div>

                <div className="col-span-1 text-center">
                  <div className={`w-2 h-2 rounded-full mx-auto
                                ${player.isOnline ? 'bg-green-500' : 'bg-gray-500'}`} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
};

export default Leaderboard; 