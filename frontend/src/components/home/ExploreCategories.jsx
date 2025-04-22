import React from 'react';
import { useNavigate } from 'react-router-dom';
import Title from '../../components/Title.jsx';
import { assets } from '../../assets/assets.js';

const exploreCategories = [
  {
    title: 'Guitar Bodies',
    image: assets.body1,
    category: 'Body',
  },
  {
    title: 'Guitar Necks',
    image: assets.neck1,
    category: 'Neck',
  },
  {
    title: 'Guitar Inlays',
    image: assets.inlay1,
    category: 'Inlay',
  },
];

const ExploreCategories = () => {
  const navigate = useNavigate();

  const handleExplore = (category) => {
    navigate(`/collection?category=${category}`);
  };

  return (
    <section className="py-20 bg-[#111] text-white text-center">
      <Title text1="Explore " text2="Category" />
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 px-6 lg:px-20">
        {exploreCategories.map((cat, i) => (
          <div
            key={i}
            onClick={() => handleExplore(cat.category)}
            className="cursor-pointer group overflow-hidden bg-neutral-900 rounded-lg shadow-lg hover:shadow-yellow-400/30 transition"
          >
            <img
              src={cat.image}
              alt={cat.title}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold text-yellow-400 mb-2">{cat.title}</h3>
              <p className="text-sm text-gray-300">Explore all our {cat.category}s</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExploreCategories;
