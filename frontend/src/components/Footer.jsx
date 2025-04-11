import React from 'react';
import { assets } from '../assets/assets';
import { FaInstagram, FaFacebook, FaYoutube, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <div className='bg-[#121212] text-white px-[7vw] mt-30 pt-20 pb-10'>
      <div className='grid gap-14 sm:grid-cols-[3fr_1fr_1fr]'>
        {/* About */}
        <div>
          <img src={assets.logo} className='mb-5 w-32 h-32 rounded-full' alt='3xiz Guitars logo'/>
          <p className='md:w-2/3 text-sm text-gray-500'>
            At 3xizGuitars, we specialize in crafting high-quality guitar bodies, necks, and inlays. From custom designs to 3D modeling services, we help musicians and luthiers bring their visions to life. Crafted with passion, built for perfection!
          </p>
          <div className='flex gap-4 mt-6 text-xl text-yellow-400'>
            <a href="https://instagram.com" target="_blank"><FaInstagram className='hover:text-white' /></a>
            <a href="https://facebook.com" target="_blank"><FaFacebook className='hover:text-white' /></a>
            <a href="https://youtube.com" target="_blank"><FaYoutube className='hover:text-white' /></a>
            <a href="https://wa.me/919518035716" target="_blank"><FaWhatsapp className='hover:text-white' /></a>
          </div>
        </div>

        {/* Links */}
        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-2 text-sm text-gray-500'>
            <li>Home</li>
            <li>About Us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-2 text-sm text-gray-500'>
            <li>+91 95180 35716</li>
            <li>3xizguitars@gmail.com</li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <hr className='mt-14 border-neutral-800'/>
      <p className='py-5 text-sm text-center text-neutral-500'>© 2025 3xizGuitars.com – All Rights Reserved.</p>
    </div>
  );
};

export default Footer;
