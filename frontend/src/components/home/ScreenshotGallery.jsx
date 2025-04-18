import React, { useRef, useEffect } from 'react';
import { assets } from '../../assets/assets';
import Title from '../Title.jsx';

const screenshots = [
    assets.product1,
    assets.product10,
    assets.product11,
    assets.product13,
    assets.body12,
    assets.product12,
    assets.product2,
    assets.body19,
    assets.neck9,
];

const ScreenshotGallery = () => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;

    if (!container || !content) return;

    content.innerHTML += content.innerHTML;

    const duration = 100;
    content.style.animation = `scroll ${duration}s linear infinite`;

    const handleAnimationIteration = () => {
      if (content.getBoundingClientRect().left >= 0) {
        content.style.animation = 'none';
        void content.offsetWidth;
        content.style.animation = `scroll ${duration}s linear infinite`;
      }
    };

    content.addEventListener('animationiteration', handleAnimationIteration);

    const pauseAnimation = () => {
      content.style.animationPlayState = 'paused';
    };

    const resumeAnimation = () => {
      content.style.animationPlayState = 'running';
    };

    container.addEventListener('mouseenter', pauseAnimation);
    container.addEventListener('mouseleave', resumeAnimation);

    return () => {
      content.removeEventListener('animationiteration', handleAnimationIteration);
      container.removeEventListener('mouseenter', pauseAnimation);
      container.removeEventListener('mouseleave', resumeAnimation);
    };
  }, []);

  return (
    <section className="bg-black py-16 px-6 text-white">
      <Title text1={'Customer '} text2={'Builds'}/>
      <div 
        ref={containerRef}
        className="relative overflow-hidden mt-10"
      >
        <style>{`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
        <div 
          ref={contentRef}
          className="flex gap-4 w-max"
        >
          {[...screenshots, ...screenshots].map((src, idx) => (
            <img
              key={idx}
              src={src}
              className="h-64 w-auto rounded-lg shadow-md hover:scale-105 transition flex-shrink-0"
              alt={`Screenshot ${idx % screenshots.length + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScreenshotGallery;