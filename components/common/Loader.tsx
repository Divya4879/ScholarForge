import React from 'react';

const Loader: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 my-8">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-vibrant"></div>
      <p className="text-pink-soft text-lg font-display">{text}</p>
    </div>
  );
};

export default Loader;
