// HeroSection.jsx
import React from 'react';
import { assets } from '../../assets/assets';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <div className="relative h-[90vh] flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${assets.hero})` }}>
      <div className="absolute inset-0 bg-black/50" />
      <motion.div
        className="z-10 text-center px-6 sm:px-12"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-4xl sm:text-6xl font-bold text-yellow-400">Custom Guitar Parts</h1>
        <p className="mt-4 text-white text-lg sm:text-xl max-w-2xl mx-auto">Precision-crafted bodies, necks, and inlays built for tone and style.</p>
        <button className="mt-6 px-8 py-3 rounded-full bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition">
          Explore Collection
        </button>
      </motion.div>
    </div>
  );
};

export default HeroSection;