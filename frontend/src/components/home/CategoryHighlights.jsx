// components/CategoryHighlights.jsx
import React from 'react';
import { assets } from '../../assets/assets';
import Title from '../../components/Title.jsx'

const categories = [
  { title: 'Custom Bodies', img: assets.body1 },
  { title: 'Custom Necks', img: assets.neck1 },
  { title: 'Custom Inlays', img: assets.inlay1 },
  { title: '3D Design Services', img: assets.print },
];

const CategoryHighlights = () => (
  <section id="categories" className="py-16 bg-black text-white text-center">
    <Title text1={'Custom '} text2={'Services'}/>
    <div className="grid grid-cols-1 mt-5 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 md:px-20">
      {categories.map((cat, i) => (
        <div
          key={i}
          className="bg-neutral-800 rounded-lg overflow-hidden shadow-lg hover:shadow-yellow-500/30 transition"
        >
          <img src={cat.img} className="w-full h-48 object-cover" alt={cat.title} />
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-2">{cat.title}</h3>
            <button
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-16 py-3 text-sm rounded-full hover:opacity-90 active:scale-95 transition-transform"
            >
              Inquiry
            </button>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default CategoryHighlights;
