import React, { useContext, useEffect, useRef, useState } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import CurrencyConverter from './CurrencyConverter';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef();
  const { getCartCount, setCartItems, navigate, token, setToken, user } = useContext(ShopContext);

  const logout = () => {
    setCartItems({});
    localStorage.removeItem('token');
    setToken('');
    navigate('/login');
    setVisible(false);
  };

  const navLinks = [
    { path: '/', label: 'HOME' },
    { path: '/collection', label: 'COLLECTIONS' },
    { path: '/reviews', label: 'REVIEWS' },
    { path: '/gallery', label: 'GALLERY' },
    { path: '/about', label: 'ABOUT' },
    { path: '/contact', label: 'CONTACT' },
  ];

  // Handle outside click for mobile menu
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (visible && menuRef.current && !menuRef.current.contains(e.target)) {
        setVisible(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [visible]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <div 
      className={`w-full bg-black text-white px-[7vw] py-3 flex items-center justify-between fixed top-0 z-30 transition-all duration-300 ${
        scrolled ? 'shadow-lg bg-opacity-95 py-2' : 'bg-opacity-100'
      }`}
    >
      {/* Logo */}
      <Link to="/">
        <img 
          src={assets.logo} 
          alt="Website Logo" 
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full transition-all duration-300 hover:scale-105" 
        />
      </Link>

      {/* Nav Links - Desktop */}
      <ul className="hidden sm:flex gap-3 text-sm">
        {navLinks.map(({ path, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-2 rounded-full transition duration-300 ease-in-out ${
                isActive 
                  ? 'bg-yellow-400 text-black font-bold shadow-md' 
                  : 'text-yellow-400 hover:bg-yellow-400 hover:text-black hover:shadow-md'
              }`
            }
          >
            <p>{label}</p>
          </NavLink>
        ))}
      </ul>

      {/* Right Side */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Currency Converter */}
        <div className="hidden sm:block">
          <CurrencyConverter />
        </div>

        {/* Profile */}
        <div className="group relative z-[100]">
          <div 
            onClick={() => (token ? null : navigate('/login'))} 
            className="flex items-center gap-1 cursor-pointer"
          >
            <img
              src={assets.profileLogo}
              alt="Profile"
              className="w-5 filter brightness-0 invert transition-transform duration-300 hover:scale-110"
            />
            {token && user?.name && (
              <span className="hidden md:inline text-yellow-400 text-sm">
                Hi, {user.name.split(' ')[0]}
              </span>
            )}
          </div>
          
          {token && (
            <div className="group-hover:block hidden absolute right-0 pt-4 animate-fadeIn">
              <div className="flex flex-col gap-2 w-48 py-3 px-4 bg-gray-800 text-yellow-300 rounded-lg shadow-xl border border-gray-700">
                <p 
                  onClick={() => {
                    navigate('/profile');
                    setVisible(false);
                  }} 
                  className="cursor-pointer hover:text-yellow-100 hover:bg-gray-700 px-2 py-1 rounded transition"
                >
                  My Profile
                </p>
                <p 
                  onClick={() => {
                    navigate('/orders');
                    setVisible(false);
                  }} 
                  className="cursor-pointer hover:text-yellow-100 hover:bg-gray-700 px-2 py-1 rounded transition"
                >
                  My Orders
                </p>
                <p 
                  onClick={logout} 
                  className="cursor-pointer hover:text-yellow-100 hover:bg-gray-700 px-2 py-1 rounded transition"
                >
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Cart */}
        <Link 
          to="/cart" 
          className="relative group"
          aria-label={`Shopping Cart with ${getCartCount()} items`}
        >
          <img
            src={assets.cartLogo}
            alt="Cart"
            className="w-5 filter brightness-0 invert transition-transform duration-300 group-hover:scale-110"
          />
          {getCartCount() > 0 && (
            <p className="absolute right-[-5px] bottom-[-5px] w-5 h-5 flex items-center justify-center bg-yellow-400 text-black rounded-full text-xs font-bold transition-all duration-300 group-hover:scale-125">
              {getCartCount()}
            </p>
          )}
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setVisible(true)}
          className="sm:hidden p-1 focus:outline-none"
          aria-label="Open menu"
        >
          <img
            src={assets.menu}
            alt="Menu"
            className="w-6 filter brightness-0 invert transition-transform duration-300 hover:scale-110"
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 bottom-0 bg-black/95 backdrop-blur-md text-yellow-300 transform transition-all duration-300 ease-in-out ${
          visible ? 'translate-x-0 w-full sm:w-96' : 'translate-x-full w-0'
        } overflow-hidden z-[1000] flex flex-col`}
      >
        {/* Mobile Menu Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <Link to="/" onClick={() => setVisible(false)}>
            <img 
              src={assets.logo} 
              alt="Website Logo" 
              className="h-12 rounded-full" 
            />
          </Link>
          <button
            onClick={() => setVisible(false)}
            className="p-2 focus:outline-none"
            aria-label="Close menu"
          >
            <img 
              src={assets.close} 
              alt="Close" 
              className="h-5 filter brightness-0 invert" 
            />
          </button>
        </div>

        {/* Mobile Menu Content */}
        <div className="flex-1 overflow-y-auto">
          {token && user?.name && (
            <div className="px-6 py-4 border-b border-gray-700">
              <p className="text-lg font-medium text-yellow-400">
                Welcome back, {user.name.split(' ')[0]}!
              </p>
            </div>
          )}

          {/* Mobile Nav Links */}
          <div className="py-2">
            {navLinks.map(({ path, label }) => (
              <NavLink
                key={path}
                onClick={() => setVisible(false)}
                to={path}
                className={({ isActive }) =>
                  `block py-4 px-6 text-lg transition duration-300 ease-in-out ${
                    isActive 
                      ? 'bg-yellow-400 text-black font-bold' 
                      : 'hover:bg-gray-800 hover:text-yellow-100'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Mobile Currency Converter */}
          <div className="p-6 border-t border-gray-700">
            <h3 className="text-yellow-400 mb-3">Currency</h3>
            <CurrencyConverter />
          </div>

          {/* Mobile User Actions */}
          <div className="p-6 border-t border-gray-700">
            {token ? (
              <>
                <button
                  onClick={() => {
                    navigate('/profile');
                    setVisible(false);
                  }}
                  className="w-full py-3 px-4 mb-3 bg-gray-800 text-yellow-400 rounded-lg hover:bg-gray-700 transition text-left"
                >
                  My Profile
                </button>
                <button
                  onClick={() => {
                    navigate('/orders');
                    setVisible(false);
                  }}
                  className="w-full py-3 px-4 mb-3 bg-gray-800 text-yellow-400 rounded-lg hover:bg-gray-700 transition text-left"
                >
                  My Orders
                </button>
                <button
                  onClick={logout}
                  className="w-full py-3 px-4 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  navigate('/login');
                  setVisible(false);
                }}
                className="w-full py-3 px-4 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition"
              >
                Login / Register
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;