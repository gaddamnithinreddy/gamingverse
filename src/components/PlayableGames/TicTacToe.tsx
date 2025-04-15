import React, { useState } from 'react';

const TicTacToe: React.FC = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);

  const calculateWinner = (squares: Array<string | null>) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const gameWinner = calculateWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  const renderSquare = (index: number) => (
    <button
      className="w-20 h-20 bg-gray-800 border border-gray-600 text-3xl font-bold text-white hover:bg-gray-700 transition-colors"
      onClick={() => handleClick(index)}
    >
      {board[index]}
    </button>
  );

  const status = winner
    ? `Winner: ${winner}`
    : board.every(square => square)
    ? "It's a draw!"
    : `Next player: ${isXNext ? 'X' : 'O'}`;

  return (
    <div className="flex flex-col items-center space-y-6">
      <h2 className="text-2xl font-bold">Tic Tac Toe</h2>
      <div className="grid grid-cols-3 gap-1">
        {Array(9).fill(null).map((_, i) => (
          <div key={i}>{renderSquare(i)}</div>
        ))}
      </div>
      <div className="text-xl font-semibold">{status}</div>
      <button
        onClick={resetGame}
        className="px-6 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
      >
        Reset Game
      </button>
    </div>
  );
};

export default TicTacToe;