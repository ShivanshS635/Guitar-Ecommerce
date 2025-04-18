import React, { useState, useEffect } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { assets } from '../../assets/assets';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const phrases = [
    "Handcrafted Guitar Parts",
    "Premium Tonewoods",
    "Custom Inlays",
    "Luthier-Grade Components"
  ];

  useEffect(() => {
    const handleType = () => {
      const currentPhrase = phrases[loopNum % phrases.length];
      const updatedText = isDeleting 
        ? currentPhrase.substring(0, text.length - 1)
        : currentPhrase.substring(0, text.length + 1);

      setText(updatedText);

      if (!isDeleting && updatedText === currentPhrase) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && updatedText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(150);
      } else {
        setTypingSpeed(isDeleting ? 75 : 150);
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed]);

  return (
    <section className="relative min-h-screen overflow-hidden text-white flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-black">
      <img
        src={assets.hero}
        alt="Guitar Hero"
        className="absolute inset-0 w-full h-full object-cover opacity-35"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90 z-0" />
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center w-full px-4 py-16 sm:py-24 lg:py-32"
      >
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-yellow-400 drop-shadow-lg min-h-[4rem] sm:min-h-[5rem] md:min-h-[6rem] flex items-center justify-center">
            {text}
            <span className="ml-1 inline-block w-1 h-8 sm:h-10 md:h-12 bg-yellow-400 animate-pulse"></span>
          </h1>

          <div className="mt-6 sm:mt-8 space-y-4">
            <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed drop-shadow">
              Every guitar tells a story — yours begins with the perfect part.
            </p>
            
            <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed drop-shadow">
              At <strong className="text-yellow-400">3XIZ Guitars</strong>, we don't just build guitar components — we craft the foundation for musical expression. Our guitar bodies, necks, and custom inlays are carved with obsessive precision, deep-rooted passion, and an ear for excellence.
            </p>
            
            <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed drop-shadow">
              From seasoned luthiers shaping professional instruments, to passionate DIY builders assembling their first masterpiece, we serve every creator with parts that don't just fit — they <span className="italic text-yellow-300">inspire</span>.
            </p>
            
            <p className="font-medium text-white mt-4 sm:mt-6 text-sm sm:text-base md:text-lg">
              Designed for tone. Built for feel. Delivered with soul.
            </p>
          </div>

          <Link 
            to='/collection'
            className="mt-6 sm:mt-8 inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-6 py-2 sm:py-3 bg-yellow-500 hover:bg-yellow-600 active:scale-95 rounded-full text-black font-bold shadow-xl transition-all duration-300 text-sm sm:text-base"
          >
            Explore Our Craft <FaArrowRight className="text-xs sm:text-sm" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;