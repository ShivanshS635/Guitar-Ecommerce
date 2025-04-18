import React from 'react';

const Title = ({ text1 = '', text2 = '', icon: Icon, subtitle = '' }) => {
  return (
    <div data-aos="fade-up" className="text-center space-y-2">
      <div className="flex justify-center items-center gap-2 text-yellow-400 text-3xl font-bold tracking-wide">
        {Icon && <Icon className="text-yellow-300 text-4xl" />}
        <span>{text1}</span>
        {text2 && <span className="text-white">{text2}</span>}
      </div>

      <div className="flex justify-center">
        <div className="w-16 h-[2px] bg-yellow-400 mt-1 rounded" />
      </div>

      {subtitle && (
        <p className="text-sm text-neutral-400 mt-1">{subtitle}</p>
      )}
    </div>
  );
};

export default Title;
