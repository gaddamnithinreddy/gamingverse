import React from 'react';

interface NavButtonProps {
  icon: React.ReactNode;
  text: string;
  isActive: boolean;
  onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ icon, text, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`group relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
        ${isActive ? 'text-purple-400' : 'text-gray-300 hover:text-white'}`}
    >
      <span className="bullet absolute -left-2 opacity-0 group-hover:opacity-100 transition-opacity">
        •
      </span>
      {icon}
      <span>{text}</span>
    </button>
  );
};

export default NavButton;