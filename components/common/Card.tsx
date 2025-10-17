
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm shadow-2xl rounded-xl p-6 border border-gray-700/50 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
