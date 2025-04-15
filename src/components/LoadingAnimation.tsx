import React from 'react';
import { motion } from 'framer-motion';

interface LoadingAnimationProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  type?: 'spinner' | 'dots' | 'pulse';
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  size = 'md', 
  color = '#8B5CF6', 
  type = 'spinner'
}) => {
  const sizes = {
    sm: '24px',
    md: '40px',
    lg: '64px'
  };

  const containerSize = sizes[size];

  if (type === 'dots') {
    return (
      <div className="flex gap-2 items-center justify-center" style={{ height: containerSize }}>
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            style={{
              width: `${parseInt(containerSize) / 4}px`,
              height: `${parseInt(containerSize) / 4}px`,
              backgroundColor: color,
              borderRadius: '50%'
            }}
            animate={{
              y: ['0%', '-50%', '0%'],
              opacity: [1, 0.5, 1]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: index * 0.2,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>
    );
  }

  if (type === 'pulse') {
    return (
      <div style={{ width: containerSize, height: containerSize }}>
        <motion.div
          style={{
            width: '100%',
            height: '100%',
            border: `3px solid ${color}`,
            borderRadius: '50%'
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.5, 1]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </div>
    );
  }

  // Default spinner animation
  return (
    <div style={{ width: containerSize, height: containerSize }}>
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          border: '3px solid rgba(139, 92, 246, 0.2)',
          borderTop: `3px solid ${color}`,
          borderRadius: '50%'
        }}
        animate={{
          rotate: 360
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </div>
  );
};

// Loading Overlay component for full-screen loading states
export const LoadingOverlay: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-50"
    >
      <LoadingAnimation size="lg" type="dots" />
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-lg text-gray-300"
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  );
};

export default LoadingAnimation; 