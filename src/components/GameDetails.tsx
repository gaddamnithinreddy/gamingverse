import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Star, 
  Users, 
  Trophy,
  ThumbsUp,
  Share2,
  Gamepad,
  Clock,
  Heart
} from 'lucide-react';

interface GameDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  game: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    rating: number;
    playCount: number;
    category: string;
    features: string[];
    screenshots: string[];
  };
}

const GameDetails: React.FC<GameDetailsProps> = ({ isOpen, onClose, game }) => {
  const [isLiked, setIsLiked] = React.useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = React.useState(0);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            className="relative bg-gray-800 rounded-2xl w-full max-w-4xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
          >
            {/* Close Button */}
            <motion.button
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
            >
              <X size={20} />
            </motion.button>

            {/* Game Header */}
            <div className="relative h-64 overflow-hidden">
              <motion.img
                src={game.imageUrl}
                alt={game.title}
                className="w-full h-full object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent" />
              
              <motion.div
                className="absolute bottom-6 left-6 right-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold text-white mb-2">{game.title}</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="text-yellow-400" size={20} />
                    <span className="text-white font-medium">{game.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="text-purple-400" size={20} />
                    <span className="text-white font-medium">{game.playCount.toLocaleString()} plays</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-purple-600 text-sm font-medium text-white">
                    {game.category}
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Game Content */}
            <div className="p-6">
              {/* Action Buttons */}
              <div className="flex gap-4 mb-8">
                <motion.button
                  className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2
                           hover:bg-purple-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Gamepad size={20} />
                  Play Now
                </motion.button>
                <motion.button
                  className={`p-3 rounded-lg ${isLiked ? 'bg-pink-600' : 'bg-gray-700'} text-white`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart
                    size={20}
                    className={isLiked ? 'fill-current' : ''}
                  />
                </motion.button>
                <motion.button
                  className="p-3 rounded-lg bg-gray-700 text-white"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Share2 size={20} />
                </motion.button>
              </div>

              {/* Game Description */}
              <motion.p
                className="text-gray-300 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {game.description}
              </motion.p>

              {/* Features */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-xl font-bold text-white mb-4">Features</h3>
                <div className="grid grid-cols-2 gap-4">
                  {game.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-2 text-gray-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <Trophy className="text-purple-400" size={16} />
                      {feature}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Screenshots */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-xl font-bold text-white mb-4">Screenshots</h3>
                <div className="grid grid-cols-4 gap-4">
                  {game.screenshots.map((screenshot, index) => (
                    <motion.div
                      key={index}
                      className={`relative rounded-lg overflow-hidden cursor-pointer
                                ${selectedScreenshot === index ? 'ring-2 ring-purple-500' : ''}`}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setSelectedScreenshot(index)}
                    >
                      <img
                        src={screenshot}
                        alt={`Screenshot ${index + 1}`}
                        className="w-full h-24 object-cover"
                      />
                      {selectedScreenshot === index && (
                        <motion.div
                          className="absolute inset-0 bg-purple-500/20"
                          layoutId="screenshot-highlight"
                        />
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GameDetails; 