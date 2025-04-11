import React from 'react';
import { assets } from '../assets/assets';
import { motion, useScroll, useTransform } from 'framer-motion';

const Hero = () => {
  const { scrollY } = useScroll();

  // Subtle parallax motion
  const backgroundY = useTransform(scrollY, [0, 400], [0, -40]);
  const overlayY = useTransform(scrollY, [0, 400], [0, -30]);
  const contentY = useTransform(scrollY, [0, 300], [0, 15]);

  return (
    <section className="relative min-h-[120vh] flex items-center justify-center bg-black text-white overflow-hidden">

      {/* Background Image */}
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 z-0 min-h-[130vh]">
        <img src={assets.hero} alt="Hero" className="w-full h-full object-cover object-center" />
      </motion.div>

      {/* Overlay */}
      <motion.div style={{ y: overlayY }} className="absolute inset-0 bg-black/60 z-0 min-h-[130vh]" />

      {/* Foreground Content */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 px-6 sm:px-10 lg:px-20 max-w-3xl text-center space-y-6"
        data-aos="fade-up"
      >
        <p className="text-yellow-400 uppercase tracking-wider text-sm sm:text-base">
          Custom Guitar Parts
        </p>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-yellow-400 via-orange-300 to-yellow-200 text-transparent bg-clip-text">
          Precision Meets Passion.
        </h1>

        <p className="text-neutral-300 text-sm sm:text-base max-w-xl mx-auto">
          We craft high-end guitar necks and bodies tailored to your vision — combining CNC accuracy with handmade soul.
        </p>

        <motion.div
          data-aos="zoom-in"
          data-aos-delay="300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <button className="mt-4 bg-yellow-400 text-black font-semibold px-6 py-3 rounded-full hover:bg-yellow-300 transition animate-pulse shadow-lg shadow-yellow-500/30">
            Explore Collection
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
