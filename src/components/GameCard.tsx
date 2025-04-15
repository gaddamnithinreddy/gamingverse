import React, { useState } from 'react';
import { ExternalLink, Info, Star } from 'lucide-react';
import { Game } from '../types';

interface GameCardProps {
  game: Game;
  onLearnMore: () => void;
  variant?: 'default' | 'compact';
}

const GameCard: React.FC<GameCardProps> = ({ game, onLearnMore, variant = 'default' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlayLoading, setIsPlayLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLearnMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLearnMore();
    }, 500);
  };

  const handlePlay = () => {
    setIsPlayLoading(true);
    setTimeout(() => {
      setIsPlayLoading(false);
      window.open(game.playUrl, '_blank');
    }, 500);
  };

  if (variant === 'compact') {
    return (
      <div 
        className="game-card card-flip-container list-item"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-40 overflow-hidden rounded-xl">
          <img
            src={game.image}
            alt={game.title}
            className="w-full h-full object-cover transition-transform duration-300 hover-scale"
            style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-bold text-white mb-1 hover-lift">{game.title}</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={`${i < 4 ? "text-yellow-400" : "text-gray-600"} hover-rotate`}
                    fill={i < 4 ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleLearnMore}
                  className="button-press text-white hover:text-purple-400 transition-colors relative"
                >
                  {isLoading ? (
                    <div className="loading-spinner w-5 h-5" />
                  ) : (
                    <Info size={18} className="hover-rotate" />
                  )}
                </button>
                <button
                  onClick={handlePlay}
                  className="button-press text-white hover:text-purple-400 transition-colors"
                >
                  <ExternalLink size={18} className="hover-rotate" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="game-card gradient-border list-item"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-gray-800 p-1 rounded-lg">
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <img
            src={game.image}
            alt={game.title}
            className="w-full h-full object-cover transition-transform duration-300 hover-scale"
            style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent" />
        </div>
        <div className="p-4 bg-gray-800 rounded-b-lg">
          <h3 className="text-xl font-bold mb-2 text-shimmer hover-lift">{game.title}</h3>
          <p className="text-gray-400 text-sm mb-4">{game.shortDescription}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={`${i < 4 ? "text-yellow-400" : "text-gray-600"} hover-rotate`}
                  fill={i < 4 ? "currentColor" : "none"}
                />
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleLearnMore}
                className="button-press px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors pulse-glow"
              >
                {isLoading ? (
                  <div className="loading-spinner w-5 h-5" />
                ) : (
                  "Learn More"
                )}
              </button>
              <button
                onClick={handlePlay}
                className="button-press px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors hover-scale"
              >
                Play Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCard;