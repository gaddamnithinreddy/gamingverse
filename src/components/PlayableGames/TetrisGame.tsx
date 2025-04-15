import React, { useState, useEffect, useCallback } from 'react';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_SIZE = 30;

const TETROMINOS = {
  I: { shape: [[1, 1, 1, 1]], color: '#00f0f0' },
  O: { shape: [[1, 1], [1, 1]], color: '#f0f000' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: '#a000f0' },
  L: { shape: [[1, 0], [1, 0], [1, 1]], color: '#f0a000' },
};

const TetrisGame: React.FC = () => {
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState(getRandomPiece());
  const [position, setPosition] = useState({ x: 4, y: 0 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  function createEmptyBoard() {
    return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0));
  }

  function getRandomPiece() {
    const pieces = Object.keys(TETROMINOS);
    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
    return {
      shape: TETROMINOS[randomPiece as keyof typeof TETROMINOS].shape,
      color: TETROMINOS[randomPiece as keyof typeof TETROMINOS].color,
    };
  }

  const moveDown = useCallback(() => {
    if (isPaused || gameOver) return;
    
    const newY = position.y + 1;
    if (isValidMove(currentPiece.shape, position.x, newY)) {
      setPosition(prev => ({ ...prev, y: newY }));
    } else {
      // Lock the piece
      const newBoard = [...board];
      currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value) {
            newBoard[y + position.y][x + position.x] = 1;
          }
        });
      });
      setBoard(newBoard);

      // Check for completed lines
      const completedLines = board.reduce((acc, row, index) => {
        if (row.every(cell => cell === 1)) acc.push(index);
        return acc;
      }, [] as number[]);

      if (completedLines.length > 0) {
        const newBoard = board.filter((_, index) => !completedLines.includes(index));
        const emptyLines = Array(completedLines.length).fill(null).map(() => Array(BOARD_WIDTH).fill(0));
        setBoard([...emptyLines, ...newBoard]);
        setScore(prev => prev + completedLines.length * 100);
      }

      // Spawn new piece
      setCurrentPiece(getRandomPiece());
      setPosition({ x: 4, y: 0 });

      // Check game over
      if (!isValidMove(currentPiece.shape, 4, 0)) {
        setGameOver(true);
      }
    }
  }, [board, currentPiece, position, isPaused, gameOver]);

  function isValidMove(shape: number[][], x: number, y: number) {
    return shape.every((row, dy) =>
      row.every((value, dx) =>
        !value || // Empty space in piece
        (x + dx >= 0 && // Left boundary
          x + dx < BOARD_WIDTH && // Right boundary
          y + dy < BOARD_HEIGHT && // Bottom boundary
          (!board[y + dy] || board[y + dy][x + dx] === 0)) // No collision
      )
    );
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver || isPaused) return;

      switch (e.key) {
        case 'ArrowLeft':
          if (isValidMove(currentPiece.shape, position.x - 1, position.y)) {
            setPosition(prev => ({ ...prev, x: prev.x - 1 }));
          }
          break;
        case 'ArrowRight':
          if (isValidMove(currentPiece.shape, position.x + 1, position.y)) {
            setPosition(prev => ({ ...prev, x: prev.x + 1 }));
          }
          break;
        case 'ArrowDown':
          moveDown();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    const gameInterval = setInterval(moveDown, 1000);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      clearInterval(gameInterval);
    };
  }, [currentPiece, position, board, moveDown, gameOver, isPaused]);

  const resetGame = () => {
    setBoard(createEmptyBoard());
    setCurrentPiece(getRandomPiece());
    setPosition({ x: 4, y: 0 });
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-2xl font-bold">Tetris</h2>
      <div className="text-lg">Score: {score}</div>
      <div
        className="grid gap-px bg-gray-800 p-2 rounded-lg"
        style={{
          gridTemplateColumns: `repeat(${BOARD_WIDTH}, ${BLOCK_SIZE}px)`,
        }}
      >
        {board.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className={`${cell ? 'bg-purple-500' : 'bg-gray-700'}`}
              style={{ width: BLOCK_SIZE, height: BLOCK_SIZE }}
            />
          ))
        )}
        {!gameOver &&
          currentPiece.shape.map((row, y) =>
            row.map((cell, x) =>
              cell ? (
                <div
                  key={`piece-${x}-${y}`}
                  className="absolute bg-blue-500"
                  style={{
                    width: BLOCK_SIZE,
                    height: BLOCK_SIZE,
                    left: (position.x + x) * BLOCK_SIZE,
                    top: (position.y + y) * BLOCK_SIZE,
                  }}
                />
              ) : null
            )
          )}
      </div>
      {gameOver && <div className="text-xl text-red-500 font-bold">Game Over!</div>}
      <div className="space-x-4">
        <button
          onClick={resetGame}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
        >
          {gameOver ? 'Play Again' : 'Reset'}
        </button>
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="px-6 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      </div>
      <p className="text-sm text-gray-400">
        Use arrow keys to move. Left/Right to move, Down to drop faster.
      </p>
    </div>
  );
};

export default TetrisGame;