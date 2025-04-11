import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';

const Contact = () => {
  return (
    <div className="bg-neutral-900 text-neutral-300 px-4 sm:px-10 md:px-16 lg:px-24 py-10 space-y-24">
      
      {/* Title */}
      <div className="text-center pt-4 border-t border-neutral-700" data-aos="fade-down">
        <Title text1="Contact" text2="Us" />
        <p className="text-neutral-400 text-sm mt-2">Reach out for orders, collaborations, or questions</p>
      </div>

      {/* Contact Info + Image */}
      <div className="flex flex-col md:flex-row gap-12" data-aos="fade-up">
        <img
          src={assets.contact}
          alt="Contact Workshop"
          className="w-full md:max-w-[500px] rounded-xl shadow-xl object-cover"
        />
        <div className="flex flex-col justify-center gap-4 text-[15px] text-neutral-400">
          <h3 className="text-yellow-400 text-xl font-semibold">Our Store</h3>
          <p>
            411, Friends Colony<br />
            Yamuna Nagar, Haryana - 135001
          </p>
          <p>
            <strong>Phone:</strong> +91 95180 35716<br />
            <strong>Email:</strong> 3xizguitars@gmail.com
          </p>
        </div>
      </div>

      {/* Contact Form */}
      <div data-aos="zoom-in-up">
        <Title text1="Send" text2="Message" />
        <form className="grid gap-6 mt-10 md:grid-cols-2">
          <input
            type="text"
            placeholder="Your Name"
            className="col-span-2 md:col-span-1 p-3 rounded-lg bg-neutral-800 text-white border border-neutral-700"
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            className="col-span-2 md:col-span-1 p-3 rounded-lg bg-neutral-800 text-white border border-neutral-700"
            required
          />
          <textarea
            rows="5"
            placeholder="Your Message"
            className="col-span-2 p-3 rounded-lg bg-neutral-800 text-white border border-neutral-700"
            required
          ></textarea>
          <button
            type="submit"
            className="col-span-2 bg-yellow-400 text-black font-semibold py-3 rounded-full hover:bg-yellow-300 transition-colors duration-300"
          >
            Send Message
          </button>
        </form>
      </div>

      {/* Google Map */}
      <div data-aos="fade-up">
        <Title text1="Find" text2="Us" />
        <div className="mt-8 rounded-xl overflow-hidden shadow-lg">
          <iframe
            title="3xiz Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3445.524829750772!2d77.2921!3d30.1345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3910339ff60db7d9%3A0xabc123!2sFriends%20Colony%2C%20Yamuna%20Nagar%2C%20Haryana%20135001!5e0!3m2!1sen!2sin!4v1234567890"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
