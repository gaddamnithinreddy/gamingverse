import React, { useState, useEffect, useRef } from 'react';

const PongGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState({ player: 0, computer: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isPlaying) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let paddleY = canvas.height / 2;
    let computerY = canvas.height / 2;
    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    let ballSpeedX = 5;
    let ballSpeedY = 5;

    const paddleHeight = 100;
    const paddleWidth = 10;
    const ballSize = 10;

    const draw = () => {
      if (isPaused) return;

      // Clear canvas
      ctx.fillStyle = '#1F2937';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw paddles
      ctx.fillStyle = 'white';
      ctx.fillRect(0, paddleY - paddleHeight / 2, paddleWidth, paddleHeight);
      ctx.fillRect(canvas.width - paddleWidth, computerY - paddleHeight / 2, paddleWidth, paddleHeight);

      // Draw ball
      ctx.beginPath();
      ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
      ctx.fill();

      // Move ball
      ballX += ballSpeedX;
      ballY += ballSpeedY;

      // Ball collision with top and bottom
      if (ballY <= ballSize || ballY >= canvas.height - ballSize) {
        ballSpeedY = -ballSpeedY;
      }

      // Ball collision with paddles
      if (
        (ballX <= paddleWidth + ballSize && ballY > paddleY - paddleHeight / 2 && ballY < paddleY + paddleHeight / 2) ||
        (ballX >= canvas.width - paddleWidth - ballSize && ballY > computerY - paddleHeight / 2 && ballY < computerY + paddleHeight / 2)
      ) {
        ballSpeedX = -ballSpeedX;
      }

      // Computer AI
      computerY += (ballY - computerY) * 0.1;

      // Score
      if (ballX <= 0) {
        setScore(prev => ({ ...prev, computer: prev.computer + 1 }));
        resetBall();
      } else if (ballX >= canvas.width) {
        setScore(prev => ({ ...prev, player: prev.player + 1 }));
        resetBall();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    const resetBall = () => {
      ballX = canvas.width / 2;
      ballY = canvas.height / 2;
      ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
      ballSpeedY = 5 * (Math.random() > 0.5 ? 1 : -1);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseY = e.clientY - rect.top;
      paddleY = Math.min(Math.max(mouseY, paddleHeight / 2), canvas.height - paddleHeight / 2);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    animationFrameId = requestAnimationFrame(draw);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, isPaused]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-2xl font-bold">Pong</h2>
      <div className="text-lg">
        Player {score.player} - {score.computer} Computer
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="bg-gray-800 rounded-lg"
      />
      <div className="space-x-4">
        <button
          onClick={() => {
            setIsPlaying(!isPlaying);
            setIsPaused(false);
          }}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
        >
          {isPlaying ? 'Stop' : 'Start'}
        </button>
        {isPlaying && (
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        )}
      </div>
      <p className="text-sm text-gray-400">Move your mouse up and down to control the left paddle</p>
    </div>
  );
};

export default PongGame;