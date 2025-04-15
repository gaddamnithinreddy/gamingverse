import React, { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const GAME_SPEED = 150;

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    setFood(newFood);
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
    generateFood();
    setIsPaused(false);
  };

  const checkCollision = (head: { x: number; y: number }) => {
    if (
      head.x < 0 || head.x >= GRID_SIZE ||
      head.y < 0 || head.y >= GRID_SIZE
    ) {
      return true;
    }

    for (let segment of snake.slice(1)) {
      if (head.x === segment.x && head.y === segment.y) {
        return true;
      }
    }
    return false;
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    const newSnake = [...snake];
    const head = {
      x: newSnake[0].x + direction.x,
      y: newSnake[0].y + direction.y
    };

    if (checkCollision(head)) {
      setGameOver(true);
      return;
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      setScore(score + 1);
      generateFood();
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food, gameOver, isPaused]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        setIsPaused(!isPaused);
        return;
      }

      const newDirection = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 }
      }[e.key];

      if (newDirection) {
        const isOpposite = (
          newDirection.x === -direction.x && newDirection.y === -direction.y
        );
        if (!isOpposite) {
          setDirection(newDirection);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    const gameInterval = setInterval(moveSnake, GAME_SPEED);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      clearInterval(gameInterval);
    };
  }, [direction, moveSnake, isPaused]);

  return (
    <div className="flex flex-col items-center space-y-6">
      <h2 className="text-2xl font-bold">Snake Game</h2>
      <div className="text-lg">Score: {score}</div>
      <div
        className="relative bg-gray-800 border border-gray-700"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE
        }}
      >
        {snake.map((segment, i) => (
          <div
            key={i}
            className="absolute bg-green-500"
            style={{
              width: CELL_SIZE - 1,
              height: CELL_SIZE - 1,
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE
            }}
          />
        ))}
        <div
          className="absolute bg-red-500"
          style={{
            width: CELL_SIZE - 1,
            height: CELL_SIZE - 1,
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE
          }}
        />
      </div>
      {gameOver && (
        <div className="text-xl text-red-500 font-bold">Game Over!</div>
      )}
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
      <div className="text-sm text-gray-400">
        Use arrow keys to move. Space to pause/resume.
      </div>
    </div>
  );
};

export default SnakeGame;