import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import { FaGuitar, FaTools, FaSmile, FaAward } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-neutral-900 text-neutral-300 px-4 sm:px-10 md:px-16 lg:px-24 py-10 space-y-24">
      
      {/* Title */}
      <div className="pt-4 border-t border-neutral-700" data-aos="fade-down">
        <Title
          text1="About"
          text2="Us"
          icon={FaGuitar}
          subtitle="Who we are & what drives us"
        />
      </div>

      {/* About Section */}
      <div className="flex flex-col md:flex-row gap-12" data-aos="fade-up">
        <img
          src={assets.about}
          className="w-full md:max-w-[500px] rounded-xl shadow-xl object-cover"
          alt="Workshop"
        />
        <div className="flex flex-col justify-center gap-6 md:w-3/5 text-neutral-400 text-[15px]">
          <p>
            At <span className="text-yellow-400 font-semibold">3xiz Guitars</span>, we create handcrafted guitar necks and bodies with precision, passion, and purpose.
            Every piece of wood is selected by hand to craft your dream instrument.
          </p>
          <p>
            With rigorous standards and modern CNC machinery, we deliver world-class quality right to your doorstep.
          </p>
          <div>
            <h3 className="text-yellow-400 text-xl font-semibold mt-4">Our Story</h3>
            <p>
              Founded in 2017 by <strong>Parag Prajapati</strong>, a mechanical engineer and guitarist,
              3xiz Guitars fuses deep musical passion with engineering brilliance.
              Beyond just crafting bodies and necks, we offer intricate CAD/CAM design services with
              Fusion 360 & Solidworks.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 text-center gap-6 text-yellow-300" data-aos="zoom-in">
        {[
          { label: 'Projects Delivered', value: '500+' },
          { label: 'Experience', value: '7+ Yrs' },
          { label: 'Client Satisfaction', value: '99%' },
          { label: 'Handcrafted', value: '100%' },
        ].map((stat, i) => (
          <div key={i}>
            <h2 className="text-3xl font-bold">{stat.value}</h2>
            <p className="text-xs mt-1 text-neutral-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Why Choose Us */}
      <div className="space-y-10">
        <div data-aos="fade-down">
          <Title
            text1="WHY"
            text2="CHOOSE US"
            subtitle="Discover what makes us stand out"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-8" data-aos="fade-up">
          {[
            { icon: <FaTools />, title: 'Precision Engineering', text: 'CNC machining meets artistry. Every cut matters.' },
            { icon: <FaAward />, title: 'Top-Notch Materials', text: 'Handpicked woods from trusted sources.' },
            { icon: <FaGuitar />, title: 'Musician’s Vision', text: 'We know guitars. Built by players, for players.' },
            { icon: <FaSmile />, title: 'Customer-First', text: 'Fast communication, customized builds, happy clients.' },
          ].map(({ icon, title, text }, i) => (
            <div
              key={i}
              className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 flex gap-4 items-start shadow-md hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="text-yellow-400 text-3xl">{icon}</div>
              <div>
                <h3 className="text-lg font-semibold text-yellow-200 mb-1">{title}</h3>
                <p className="text-sm text-neutral-400">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call To Action */}
      <div
        className="bg-yellow-400 text-black rounded-xl py-10 px-6 text-center shadow-lg"
        data-aos="zoom-in-up"
      >
        <h2 className="text-2xl font-bold">Ready to build your dream guitar?</h2>
        <p className="mt-2 text-sm">Let’s get started with a custom design or handcrafted body today.</p>
        <button
          aria-label="Contact Us"
          onClick={() => navigate('/contact')}
          className="mt-4 px-6 py-2 bg-black text-yellow-300 rounded-full hover:bg-neutral-800 transition-colors duration-300"
        >
          Contact Us
        </button>
      </div>
    </div>
  );
};

export default About;
