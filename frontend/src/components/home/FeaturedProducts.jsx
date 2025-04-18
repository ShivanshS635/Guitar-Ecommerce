// components/FeaturedProducts.jsx
import React from 'react';

const products = [
  { name: 'Flame Maple Body', img: '/images/product1.jpg' },
  { name: 'Rosewood Neck', img: '/images/product2.jpg' },
  { name: 'Custom Inlay Set', img: '/images/product3.jpg' },
  { name: '3D Design Service', img: '/images/product4.jpg' },
];

const FeaturedProducts = () => (
  <section className="bg-black py-16 px-6 text-white">
    <h2 className="text-3xl text-yellow-400 font-bold mb-8 text-center">Featured Products</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {products.map((product, i) => (
        <div key={i} className="bg-zinc-800 p-4 rounded-lg shadow hover:shadow-yellow-500/30 transition">
          <img src={product.img} alt={product.name} className="w-full h-48 object-cover rounded mb-4" />
          <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
          <button className="text-yellow-400 hover:underline">See More</button>
        </div>
      ))}
    </div>
  </section>
);

export default FeaturedProducts;
