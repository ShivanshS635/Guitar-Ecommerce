// HeroSection.jsx
import React from 'react';
import { FaChevronDown } from 'react-icons/fa';

const HeroSection = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      >
        <source src="/videos/guitar-craft.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay content */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center text-yellow-100 px-4">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-wide drop-shadow-md">
          Handcrafted Guitar Parts
        </h1>
        <p className="mt-4 text-lg sm:text-2xl text-yellow-200">
          Precision-built for tone, feel, and aesthetics.
        </p>

        <a
          href="#category"
          className="mt-10 inline-flex items-center px-6 py-3 bg-yellow-500 text-black font-semibold rounded-full hover:bg-yellow-400 transition-all"
        >
          Explore Our Craft <FaChevronDown className="ml-2 animate-bounce" />
        </a>
      </div>

      {/* Optional overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/10" />
    </div>
  );
};

export default HeroSection;
