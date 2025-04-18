import React from 'react';
import { motion } from 'framer-motion';

const MusicAnimation = () => {
  const bars = new Array(10).fill(0);

  const animationVariants = {
    initial: {
      y: 0,
    },
    animate: {
      y: [0, -40, 0], // simulate the wave (up, down, up)
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatDelay: 0.3,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className="w-full h-48 bg-gray-800 flex justify-center items-center">
      <div className="flex space-x-2">
        {bars.map((_, index) => (
          <motion.div
            key={index}
            className="w-2 h-16 bg-gradient-to-t from-yellow-400 to-yellow-600 rounded-md"
            variants={animationVariants}
            initial="initial"
            animate="animate"
            style={{ animationDelay: `${index * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default MusicAnimation;