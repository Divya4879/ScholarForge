import React from 'react';

const AnimatedLoader: React.FC<{ text?: string }> = ({ text = 'Analyzing...' }) => {
  const starCount = 40;

  return (
    <div className="flex flex-col items-center justify-center space-y-6 my-8 p-4 bg-transparent rounded-lg overflow-hidden w-full">
      <div className="relative w-56 h-56 flex items-center justify-center">
        <style>
          {`
            .galaxy-image {
              position: absolute;
              width: 90%;
              height: 90%;
              border-radius: 50%;
              animation: spin 45s linear infinite;
              object-fit: cover;
              opacity: 0.85;
              filter: saturate(1.1);
              box-shadow: 0 0 25px 5px rgba(255, 128, 213, 0.1);
            }

            .sparkle-star {
              position: absolute;
              background-color: #fef08a;
              animation: twinkle-move 4s infinite ease-in-out;
              box-shadow: 0 0 8px #fef08a, 0 0 16px #fde047;
              clip-path: polygon(50% 0%, 65% 35%, 100% 50%, 65% 65%, 50% 100%, 35% 65%, 0% 50%, 35% 35%);
            }

            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }

            @keyframes twinkle-move {
              0%, 100% { 
                transform: translate(0, 0) scale(0.5); 
                opacity: 0.5; 
              }
              50% { 
                transform: translate(var(--tx, 0px), var(--ty, 0px)) scale(1.1); 
                opacity: 1; 
              }
            }
          `}
        </style>
        
        {/* Galaxy Image */}
        <img
          src="https://cdn.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616_1280.jpg"
          alt="Spinning Galaxy"
          className="galaxy-image"
        />
        
        {/* Starfield */}
        {Array.from({ length: starCount }).map((_, i) => {
          const size = Math.random() * 15 + 8;
          const duration = Math.random() * 3 + 3;
          const delay = Math.random() * 3;
          
          // Position stars in a ring outside the galaxy
          const angle = Math.random() * 2 * Math.PI;
          const radius = Math.random() * 120 + 90; // Increased radius to ensure they are around the galaxy
          
          const centerX = 50;
          const centerY = 50;
          const sizePercent = (size / 224) * 100;

          const left = centerX + (radius / 2.2) * Math.cos(angle) - (sizePercent / 2);
          const top = centerY + (radius / 2.2) * Math.sin(angle) - (sizePercent / 2);

          const tx = (Math.random() - 0.5) * 30;
          const ty = (Math.random() - 0.5) * 30;

          return (
            <div
              key={i}
              className="sparkle-star"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                top: `${top}%`,
                left: `${left}%`,
                animationDuration: `${duration}s`,
                animationDelay: `${delay}s`,
                 // @ts-ignore
                '--tx': `${tx}px`,
                '--ty': `${ty}px`,
              }}
            ></div>
          );
        })}
      </div>
      <p className="text-pink-soft text-xl font-display tracking-wider z-10">{text}</p>
    </div>
  );
};

export default AnimatedLoader;