// components/Testimonials.jsx
import React from 'react';// Example animation JSON

const testimonials = [
  {
    name: 'Alex Rivera',
    quote: 'Absolutely amazing neck — perfect profile and finish!',
  },
  {
    name: 'Luthier James',
    quote: 'The custom inlay job was flawless. Clients are loving it.',
  },
];

const Testimonials = () => (
  <section className="bg-zinc-900 py-16 px-6 text-white">
    <div className="flex flex-col md:flex-row items-center justify-center gap-12">
      <div className="md:w-1/2">
        <h2 className="text-3xl text-yellow-400 font-bold mb-6">Testimonials</h2>
        <div className="space-y-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-neutral-800 p-6 rounded-lg shadow hover:shadow-yellow-500/20 transition"
            >
              <p className="text-gray-300 mb-2">“{t.quote}”</p>
              <h4 className="text-yellow-400 font-semibold">– {t.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Testimonials;
