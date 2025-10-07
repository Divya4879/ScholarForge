import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const Card: React.FC<CardProps> = ({ children, className, title }) => {
  return (
    <div className={`relative bg-primary-light/40 backdrop-blur-2xl rounded-2xl shadow-2xl shadow-black/40 group transition-all duration-300 ${className}`}>
      {/* Subtle border gradient */}
      <div className="absolute -inset-px bg-gradient-to-r from-accent-pink/20 via-accent-cyan/20 to-accent-pink/20 rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative bg-primary-dark/80 rounded-[15px] p-6 sm:p-8 h-full">
          {title && <h2 className="text-2xl font-bold font-display text-content-light border-b border-content-dark/50 pb-4 mb-6">{title}</h2>}
          {children}
      </div>
    </div>
  );
};

export default Card;