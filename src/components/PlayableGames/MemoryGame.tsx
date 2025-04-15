import React, { useState, useEffect } from 'react';

const emojis = ['🎮', '🎲', '🎯', '🎪', '🎨', '🎭', '🎪', '🎯', '🎲', '🎮', '🎨', '🎭'];

const MemoryGame: React.FC = () => {
  const [cards, setCards] = useState(emojis.sort(() => Math.random() - 0.5));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (flipped.length === 2) {
      setIsLocked(true);
      if (cards[flipped[0]] === cards[flipped[1]]) {
        setMatched([...matched, ...flipped]);
        setFlipped([]);
        setIsLocked(false);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setIsLocked(false);
        }, 1000);
      }
      setMoves(moves + 1);
    }
  }, [flipped]);

  const handleCardClick = (index: number) => {
    if (isLocked || flipped.includes(index) || matched.includes(index)) return;
    if (flipped.length < 2) {
      setFlipped([...flipped, index]);
    }
  };

  const resetGame = () => {
    setCards(emojis.sort(() => Math.random() - 0.5));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setIsLocked(false);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <h2 className="text-2xl font-bold">Memory Game</h2>
      <div className="text-lg">Moves: {moves}</div>
      <div className="grid grid-cols-4 gap-2">
        {cards.map((emoji, index) => (
          <button
            key={index}
            className={`w-16 h-16 text-2xl flex items-center justify-center rounded-lg transition-all duration-300 transform
              ${flipped.includes(index) || matched.includes(index)
                ? 'bg-purple-600 rotate-0'
                : 'bg-gray-800 rotate-180'}`}
            onClick={() => handleCardClick(index)}
          >
            {(flipped.includes(index) || matched.includes(index)) && emoji}
          </button>
        ))}
      </div>
      <button
        onClick={resetGame}
        className="px-6 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
      >
        Reset Game
      </button>
    </div>
  );
};

export default MemoryGame;