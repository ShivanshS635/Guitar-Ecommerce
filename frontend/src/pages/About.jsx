import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import { FaGuitar, FaTools, FaSmile, FaAward, FaCogs, FaHandsHelping, FaLeaf, FaMusic } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const About = () => {
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="bg-neutral-900 text-neutral-300 px-4 sm:px-10 md:px-16 lg:px-24 py-14 space-y-24 overflow-hidden">

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="pt-4 border-t border-neutral-700"
      >
        <Title
          text1="About"
          text2="Us"
          icon={FaGuitar}
          subtitle="Crafting musical excellence since 2017"
        />
      </motion.div>

      {/* About Section */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-col lg:flex-row items-center gap-12"
      >
        <motion.div variants={itemVariants} className="w-full lg:w-1/2">
          <img
            src={assets.about}
            className="w-full rounded-xl shadow-xl object-cover hover:shadow-yellow-400/20 transition-shadow duration-500"
            alt="3xiz Guitars workshop"
            loading="lazy"
          />
        </motion.div>
        
        <motion.div variants={itemVariants} className="lg:w-1/2 flex flex-col gap-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-yellow-400">
              Precision Craftsmanship Meets Musical Passion
            </h2>
            <p className="text-neutral-400 leading-relaxed">
              At <span className="text-yellow-400 font-semibold">3xiz Guitars</span>, we don't just build guitar parts - we create the foundation for musical expression. Each neck and body is meticulously crafted using a blend of traditional luthiery techniques and cutting-edge CNC precision.
            </p>
            <p className="text-neutral-400 leading-relaxed">
              From selecting the perfect tonewoods to the final setup, our process ensures every component meets the highest standards of quality and playability.
            </p>
          </div>

          <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-6 shadow-inner">
            <h3 className="text-yellow-400 text-xl font-semibold mb-3">Our Philosophy</h3>
            <p className="text-neutral-400">
              We believe a great instrument starts with exceptional components. That's why we treat every piece as if it were destined for our own personal collection, combining engineering precision with an artist's attention to detail.
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Founder Story */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-neutral-800/30 border border-neutral-700 rounded-xl p-8 md:p-12 shadow-lg"
      >
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/3 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-2 bg-yellow-400/20 rounded-xl blur-md"></div>
              <img 
                src={assets.founder} 
                className="relative w-64 h-64 object-cover rounded-xl border-2 border-yellow-400/30"
                alt="Parag Prajapati, Founder"
                loading="lazy"
              />
            </div>
          </div>
          <div className="md:w-2/3 space-y-6">
            <h3 className="text-2xl font-bold text-yellow-400">The Visionary Behind 3xiz Guitars</h3>
            <p className="text-neutral-400 leading-relaxed">
              <strong>Parag Prajapati</strong>, a mechanical engineer from Haryana and passionate guitarist since 2011, founded 3xiz Guitars with a singular vision: to bridge the gap between engineering precision and musical artistry.
            </p>
            <p className="text-neutral-400 leading-relaxed">
              His unique combination of technical expertise (mastering <strong>Fusion 360</strong> and <strong>Solidworks</strong>) and hands-on luthiery experience allows him to oversee every aspect of production, ensuring each piece meets his exacting standards.
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              {['CNC Machining', 'CAD Design', 'Tonewood Selection', 'Precision Setup'].map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-yellow-400/10 text-yellow-400 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
      >
        {[
          { icon: <FaMusic className="mx-auto text-3xl mb-2" />, value: '500+', label: 'Instruments Crafted' },
          { icon: <FaCogs className="mx-auto text-3xl mb-2" />, value: '7+ Years', label: 'Experience' },
          { icon: <FaSmile className="mx-auto text-3xl mb-2" />, value: '99%', label: 'Satisfaction Rate' },
          { icon: <FaLeaf className="mx-auto text-3xl mb-2" />, value: '100%', label: 'Sustainable Sourcing' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-6 shadow-md hover:shadow-yellow-400/10 transition-all"
          >
            <div className="text-yellow-400">{stat.icon}</div>
            <h3 className="text-3xl font-bold text-yellow-300 mt-2">{stat.value}</h3>
            <p className="text-neutral-400 text-sm mt-2">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Why Choose Us */}
      <div className="space-y-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Title
            text1="WHY"
            text2="CHOOSE 3XIZ"
            subtitle="What sets our craftsmanship apart"
            center
          />
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            { 
              icon: <FaTools className="text-4xl" />, 
              title: 'Precision Engineering', 
              description: 'Our CNC machining ensures millimeter-perfect accuracy in every component, while maintaining the organic feel of handcrafted instruments.'
            },
            { 
              icon: <FaAward className="text-4xl" />, 
              title: 'Premium Materials', 
              description: 'We source only the finest tonewoods and hardware, carefully selected for their acoustic properties and visual beauty.'
            },
            { 
              icon: <FaGuitar className="text-4xl" />, 
              title: 'Player-Centric Design', 
              description: 'Every contour and dimension is optimized for comfort and playability, designed by guitarists for guitarists.'
            },
            { 
              icon: <FaHandsHelping className="text-4xl" />, 
              title: 'Custom Solutions', 
              description: 'From custom inlays to unique body shapes, we work closely with you to bring your dream instrument to life.'
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-neutral-800 border border-neutral-700 rounded-xl p-8 flex flex-col items-center text-center hover:border-yellow-400/30 transition-all group"
            >
              <div className="text-yellow-400 mb-4 group-hover:text-yellow-300 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-yellow-200 mb-3">{feature.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-xl"
      >
        <div className="absolute inset-0 bg-[url('/texture.png')] opacity-10"></div>
        <div className="relative bg-gradient-to-r from-yellow-500 to-yellow-600 py-12 px-8 text-center">
          <h2 className="text-3xl font-bold text-black mb-4">Ready to Build Your Dream Guitar?</h2>
          <p className="text-black/80 mb-6 max-w-2xl mx-auto">
            Whether you need a custom body, precision neck, or complete design consultation, our team is ready to bring your vision to life.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/contact')}
              className="px-8 py-3 bg-black text-yellow-300 rounded-full font-medium hover:bg-neutral-900 transition-colors shadow-lg"
            >
              Get a Custom Quote
            </button>
            <button
              onClick={() => navigate('/collection')}
              className="px-8 py-3 bg-white/90 text-black rounded-full font-medium hover:bg-white transition-colors shadow-lg"
            >
              Browse Our Products
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;