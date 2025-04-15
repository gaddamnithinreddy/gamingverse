import React from 'react';
import { X } from 'lucide-react';
import { Game } from '../types';

interface GameModalProps {
  game: Game;
  onClose: () => void;
}

const GameModal: React.FC<GameModalProps> = ({ game, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/75" onClick={onClose} />
      <div className="relative bg-gray-800 rounded-xl max-w-2xl w-full mx-4 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>
        <img
          src={game.image}
          alt={game.title}
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">{game.title}</h2>
          <div className="space-y-4">
            <p className="text-gray-300">{game.description}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-1">Genre</h3>
                <p className="text-white">{game.genre}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-1">Platform</h3>
                <p className="text-white">{game.platform}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-2">Key Features</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                {game.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameModal;