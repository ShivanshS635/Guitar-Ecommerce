import React, { useContext, useEffect, useRef, useState } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import CurrencyConverter from './CurrencyConverter';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const menuRef = useRef();
  const location = useLocation();
  
  const { 
    getCartCount, 
    setCartItems, 
    navigate, 
    token, 
    setToken, 
    user 
  } = useContext(ShopContext);

  const logout = () => {
    setCartItems({});
    localStorage.removeItem('token');
    setToken('');
    navigate('/login');
    setVisible(false);
  };

  const navLinks = [
    { path: '/', label: 'HOME' },
    { 
      path: '/collection', 
      label: 'IN STOCK',
      submenu: [
        { path: '/collection?category=Body', label: 'Bodies' },
        { path: '/collection?category=Neck', label: 'Necks' },
        { path: '/collection?category=GuitarKits', label: 'Kits' }
      ]
    },
    { path: '/reviews', label: 'REVIEWS' },
    { path: '/gallery', label: 'GALLERY' },
    { path: '/about', label: 'ABOUT' },
    { path: '/contact', label: 'CONTACT' },
  ];

  // Close mobile menu when route changes
  useEffect(() => {
    setVisible(false);
  }, [location]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 15 }}
      className={`w-full bg-black text-white px-[5vw] py-3 flex items-center justify-between fixed top-0 z-30 transition-all duration-300 ${
        scrolled ? 'shadow-xl bg-opacity-95 py-2 backdrop-blur-sm' : 'bg-opacity-100'
      }`}
    >
      {/* Logo with subtle shine effect */}
      <Link to="/" className="group relative">
        <motion.img
          src={assets.logo}
          alt="Website Logo"
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full transition-all duration-300 group-hover:rotate-[10deg]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        />
        <motion.div 
          className="absolute inset-0 rounded-full border-2 border-yellow-400 opacity-0 group-hover:opacity-30"
          initial={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        />
      </Link>

      {/* Desktop Navigation */}
      <ul className="hidden lg:flex gap-1 text-sm font-semibold tracking-wide relative">
        {navLinks.map(({ path, label, submenu }) => (
          <li 
            key={path}
            className="relative"
            onMouseEnter={() => setHoveredLink(path)}
            onMouseLeave={() => setHoveredLink(null)}
          >
            <NavLink
              to={path}
              className="relative group px-5 py-3 rounded-md overflow-hidden flex items-center"
            >
              {({ isActive }) => (
                <>
                  <motion.span
                    initial={{ y: 0 }}
                    whileHover={{ y: -2 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className={`z-10 relative transition-colors duration-300 ${
                      isActive 
                        ? 'text-black' 
                        : 'text-yellow-300 group-hover:text-yellow-100'
                    }`}
                  >
                    {label}
                  </motion.span>

                  {isActive && (
                    <motion.div
                      layoutId="navHighlight"
                      className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-md shadow-inner"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </>
              )}
            </NavLink>

            {/* Animated Submenu */}
            {submenu && hoveredLink === path && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 top-full pt-1 w-48"
              >
                <div className="bg-gray-800 rounded-md shadow-lg border border-gray-700 overflow-hidden">
                  {submenu.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className="block px-4 py-2.5 text-sm text-yellow-300 hover:bg-gray-700 hover:text-yellow-100 transition-colors"
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </motion.div>
            )}
          </li>
        ))}
      </ul>

      {/* Right Side Controls */}
      <div className="flex items-center gap-4 sm:gap-5">
        {/* Currency Converter */}
        <div className="hidden md:block">
          <CurrencyConverter />
        </div>

        {/* Profile / Login */}
        <div className="relative">
          {token ? (
            <div className="group">
              <button
                className="flex items-center gap-1.5 p-1.5 text-yellow-300 hover:text-yellow-100 transition-colors"
                aria-label="Account menu"
              >
                <motion.img
                  src={assets.profileLogo}
                  alt="Profile"
                  className="w-5 filter brightness-0 invert"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                />
                <span className="hidden md:inline text-sm font-medium">
                  {user?.name.split(' ')[0]}
                </span>
              </button>
              
              <div className="absolute right-0 top-full pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="bg-gray-800 rounded-md shadow-lg border border-gray-700 w-48 overflow-hidden">
                  <NavLink
                    to="/profile"
                    className="block px-4 py-2.5 text-sm text-yellow-300 hover:bg-gray-700 hover:text-yellow-100 transition-colors"
                  >
                    My Profile
                  </NavLink>
                  <NavLink
                    to="/orders"
                    className="block px-4 py-2.5 text-sm text-yellow-300 hover:bg-gray-700 hover:text-yellow-100 transition-colors"
                  >
                    My Orders
                  </NavLink>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2.5 text-sm text-yellow-300 hover:bg-gray-700 hover:text-yellow-100 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <motion.button
              onClick={() => navigate('/login')}
              className="px-3 py-1.5 text-yellow-300 hover:text-yellow-100 border border-yellow-300 hover:border-yellow-100 rounded-md transition-colors text-sm font-medium"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Login / Register
            </motion.button>
          )}
        </div>

        {/* Cart with spring animation */}
        <Link
          to="/cart"
          className="relative p-1.5 text-yellow-300 hover:text-yellow-100 transition-colors"
          aria-label={`Cart (${getCartCount()} items)`}
        >
          <motion.img
            src={assets.cartLogo}
            alt="Cart"
            className="w-5 filter brightness-0 invert"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          />
          {getCartCount() > 0 && (
            <motion.span 
              className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-yellow-400 text-black rounded-full text-xs font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 600, damping: 15 }}
            >
              {getCartCount()}
            </motion.span>
          )}
        </Link>

        {/* Mobile Menu Button */}
        <motion.button
          onClick={() => setVisible(true)}
          className="lg:hidden p-1.5 text-yellow-300 hover:text-yellow-100 transition-colors"
          aria-label="Open menu"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <img
            src={assets.menu}
            alt="Menu"
            className="w-6 filter brightness-0 invert"
          />
        </motion.button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            ref={menuRef}
            className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-black/95 backdrop-blur-sm text-yellow-300 shadow-2xl z-[1000] flex flex-col"
          >
            {/* Mobile Menu Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-700">
              <Link 
                to="/" 
                onClick={() => setVisible(false)}
                className="flex items-center gap-3"
              >
                <img
                  src={assets.logo}
                  alt="Website Logo"
                  className="h-12 rounded-full"
                />
                <span className="text-xl font-bold text-yellow-400">GUITAR SHOP</span>
              </Link>
              <motion.button
                onClick={() => setVisible(false)}
                className="p-1.5 text-yellow-300 hover:text-yellow-100 transition-colors"
                aria-label="Close menu"
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <img
                  src={assets.close}
                  alt="Close"
                  className="h-5 filter brightness-0 invert"
                />
              </motion.button>
            </div>

            {/* Mobile Menu Content */}
            <div className="flex-1 overflow-y-auto">
              {token && user?.name && (
                <div className="px-5 py-4 border-b border-gray-700">
                  <p className="text-lg font-medium text-yellow-400">
                    Welcome back, {user.name.split(' ')[0]}!
                  </p>
                </div>
              )}

              {/* Mobile Nav Links */}
              <div className="py-1">
                {navLinks.map(({ path, label, submenu }) => (
                  <div key={path}>
                    <NavLink
                      to={path}
                      onClick={() => setVisible(false)}
                      className={({ isActive }) =>
                        `block py-3.5 px-5 text-lg transition duration-200 ease-out ${
                          isActive
                            ? 'bg-yellow-400 text-black font-bold'
                            : 'hover:bg-gray-800 hover:text-yellow-100'
                        }`
                      }
                    >
                      {label}
                    </NavLink>
                    {submenu && (
                      <div className="pl-6">
                        {submenu.map((item) => (
                          <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setVisible(false)}
                            className={({ isActive }) =>
                              `block py-2.5 px-5 text-base transition duration-200 ease-out ${
                                isActive
                                  ? 'bg-yellow-400/90 text-black font-medium'
                                  : 'hover:bg-gray-800 hover:text-yellow-100'
                              }`
                            }
                          >
                            {item.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Mobile Currency Converter */}
              <div className="p-5 border-t border-gray-700">
                <h3 className="text-yellow-400 mb-3 font-medium">Currency</h3>
                <CurrencyConverter mobile />
              </div>

              {/* Mobile User Actions */}
              <div className="p-5 border-t border-gray-700">
                {token ? (
                  <div className="space-y-3">
                    <motion.button
                      onClick={() => {
                        navigate('/profile');
                        setVisible(false);
                      }}
                      className="w-full py-2.5 px-4 bg-gray-800 text-yellow-400 rounded-lg hover:bg-gray-700 transition text-left"
                      whileHover={{ x: 2 }}
                    >
                      My Profile
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        navigate('/orders');
                        setVisible(false);
                      }}
                      className="w-full py-2.5 px-4 bg-gray-800 text-yellow-400 rounded-lg hover:bg-gray-700 transition text-left"
                      whileHover={{ x: 2 }}
                    >
                      My Orders
                    </motion.button>
                    <motion.button
                      onClick={logout}
                      className="w-full py-2.5 px-4 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition"
                      whileHover={{ scale: 1.01 }}
                    >
                      Logout
                    </motion.button>
                  </div>
                ) : (
                  <motion.button
                    onClick={() => {
                      navigate('/login');
                      setVisible(false);
                    }}
                    className="w-full py-2.5 px-4 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition"
                    whileHover={{ scale: 1.02 }}
                  >
                    Login / Register
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Navbar;