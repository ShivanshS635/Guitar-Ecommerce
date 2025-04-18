// components/ContactCTA.jsx
import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const ContactCTA = () => (
  <section className="bg-black py-16 px-6 text-white text-center">
    <h2 className="text-3xl text-yellow-400 font-bold mb-4">Let’s Build Your Dream Guitar</h2>
    <p className="mb-8 text-gray-400">Reach out to us or drop a message on WhatsApp</p>
    <form className="max-w-xl mx-auto space-y-4">
      <input
        type="text"
        placeholder="Your Name"
        className="w-full p-3 rounded bg-zinc-800 text-white border border-zinc-700"
      />
      <input
        type="email"
        placeholder="Your Email"
        className="w-full p-3 rounded bg-zinc-800 text-white border border-zinc-700"
      />
      <textarea
        rows="4"
        placeholder="Your Message"
        className="w-full p-3 rounded bg-zinc-800 text-white border border-zinc-700"
      />
      <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded shadow-lg">
        Send Message
      </button>
    </form>
    <div className="mt-6">
      <a
        href="https://wa.me/919000000000"
        className="inline-flex items-center gap-2 text-yellow-400 hover:underline"
        target="_blank"
        rel="noreferrer"
      >
        <FaWhatsapp /> Chat on WhatsApp
      </a>
    </div>
  </section>
);

export default ContactCTA;
