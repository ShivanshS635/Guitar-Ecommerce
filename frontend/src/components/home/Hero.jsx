// components/Hero.jsx
import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { assets } from '../../assets/assets';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative h-screen overflow-hidden text-white flex items-center justify-center px-4 md:px-12 bg-black">
      {/* Background Image or Video */}
      <img
        src={assets.hero}
        alt="Guitar Hero"
        className="absolute inset-0 w-full h-full object-cover opacity-25"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90 z-0" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center space-y-6"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold text-yellow-400 drop-shadow-lg">
          Handcrafted Guitar Parts
        </h1>
        <p className="text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto drop-shadow">
          Precision-built for tone, feel, and aesthetics.
        </p>
        <a
          href="#categories"
          className="mt-6 inline-flex items-center gap-3 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 active:scale-95 rounded-full text-black font-bold shadow-xl transition-all duration-300"
        >
          Explore Our Craft <FaArrowRight />
        </a>
      </motion.div>
    </section>
  );
};

export default Hero;
