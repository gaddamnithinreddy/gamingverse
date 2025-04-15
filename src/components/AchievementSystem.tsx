import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy,
  Medal,
  Star,
  Crown,
  Zap,
  Award,
  Target,
  Shield
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  progress: number;
  maxProgress: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  reward: string;
  isUnlocked: boolean;
}

const achievements: Achievement[] = [
  {
    id: '1',
    title: 'First Victory',
    description: 'Win your first game',
    icon: Trophy,
    progress: 1,
    maxProgress: 1,
    rarity: 'common',
    reward: '100 Points',
    isUnlocked: true
  },
  {
    id: '2',
    title: 'Speed Demon',
    description: 'Complete a race under 2 minutes',
    icon: Zap,
    progress: 75,
    maxProgress: 100,
    rarity: 'rare',
    reward: '250 Points',
    isUnlocked: false
  },
  {
    id: '3',
    title: 'Tournament Champion',
    description: 'Win a tournament',
    icon: Crown,
    progress: 0,
    maxProgress: 1,
    rarity: 'epic',
    reward: '500 Points',
    isUnlocked: false
  },
  {
    id: '4',
    title: 'Perfect Score',
    description: 'Achieve 100% in any game',
    icon: Star,
    progress: 95,
    maxProgress: 100,
    rarity: 'legendary',
    reward: '1000 Points',
    isUnlocked: false
  }
];

const rarityColors = {
  common: 'from-gray-400 to-gray-300',
  rare: 'from-blue-500 to-blue-400',
  epic: 'from-purple-600 to-purple-500',
  legendary: 'from-yellow-500 to-yellow-400'
};

const AchievementSystem: React.FC = () => {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);

  const handleAchievementClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    if (!achievement.isUnlocked && achievement.progress === achievement.maxProgress) {
      setShowUnlockAnimation(true);
      setTimeout(() => setShowUnlockAnimation(false), 3000);
    }
  };

  return (
    <section className="py-16 px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <motion.h2 
          className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          Achievements
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              layoutId={`achievement-${achievement.id}`}
              onClick={() => handleAchievementClick(achievement)}
              className={`relative bg-gray-800 rounded-xl p-6 cursor-pointer
                         ${achievement.isUnlocked ? 'ring-2 ring-opacity-50' : 'opacity-80'}
                         ring-${achievement.rarity === 'legendary' ? 'yellow' : 'purple'}-500`}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div 
                className="absolute inset-0 rounded-xl bg-gradient-to-br opacity-10"
                style={{
                  background: `linear-gradient(to bottom right, ${
                    achievement.isUnlocked ? `var(--${achievement.rarity}-gradient)` : 'transparent'
                  })`
                }}
              />

              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${rarityColors[achievement.rarity]}`}>
                  <achievement.icon size={24} className="text-white" />
                </div>
                <span className={`text-sm font-medium px-2 py-1 rounded-full 
                                ${achievement.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-300' :
                                  achievement.rarity === 'epic' ? 'bg-purple-500/20 text-purple-300' :
                                  achievement.rarity === 'rare' ? 'bg-blue-500/20 text-blue-300' :
                                  'bg-gray-500/20 text-gray-300'}`}>
                  {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">{achievement.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{achievement.description}</p>

              {/* Progress Bar */}
              <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden mb-2">
                <motion.div
                  className={`absolute left-0 top-0 h-full rounded-full
                             ${achievement.isUnlocked ? 'bg-gradient-to-r from-green-500 to-green-400' :
                               'bg-gradient-to-r from-purple-500 to-purple-400'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">
                  {achievement.progress}/{achievement.maxProgress}
                </span>
                <span className="text-purple-400 font-medium">{achievement.reward}</span>
              </div>

              {/* Unlock Animation */}
              <AnimatePresence>
                {showUnlockAnimation && selectedAchievement?.id === achievement.id && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.5 }}
                  >
                    <div className="bg-black/80 rounded-xl p-4 text-center">
                      <Trophy className="text-yellow-400 mx-auto mb-2" size={32} />
                      <p className="text-white font-bold">Achievement Unlocked!</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default AchievementSystem; 