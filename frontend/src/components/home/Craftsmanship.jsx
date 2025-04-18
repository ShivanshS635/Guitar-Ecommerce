// components/Craftsmanship.jsx
import React from 'react';
import { assets } from '../../assets/assets';

const Craftsmanship = () => (
  <section className="bg-zinc-900 py-16 px-6 rounded-lg text-white flex flex-col md:flex-row items-center">
    <div className="md:w-1/2 mb-8 md:mb-0">
      <img src={assets.workshop} alt="Workshop" className="rounded-lg shadow-lg grayscale-100" />
    </div>
    <div className="md:w-1/2 md:pl-12">
      <h2 className="text-3xl font-bold text-yellow-400 mb-4">Crafted with Expertise</h2>
      <p className="text-gray-300 text-lg">
        Over 10 years of experience in woodworking, precision engineering, and sound design come together to create parts that not only look stunning but also enhance your guitar's performance.
      </p>
    </div>
  </section>
);

export default Craftsmanship;
