import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const Navbar = () => {
  const [visible, setVisible] = useState(false)
  const { getCartCount } = useContext(ShopContext)

  const navLinks = [
    { path: '/', label: 'HOME' },
    { path: '/collection', label: 'CATEGORIES' },
    { path: '/reviews', label: 'REVIEWS' },
    { path: '/gallery', label: 'GALLERY' },
    { path: '/about', label: 'ABOUT' },
    { path: '/contact', label: 'CONTACT' },
  ]

  return (
    <div className="w-full bg-black text-white px-[7vw] py-5 flex items-center justify-between font-medium z-[999]">
      {/* Logo */}
      <Link to="/">
        <img src={assets.logo} className="w-24 h-24 rounded-full" />
      </Link>

      {/* Nav Links */}
      <ul className="hidden sm:flex gap-5 text-sm text-yellow-400">
        {navLinks.map(({ path, label }) => (
          <NavLink
            key={path}
            to={path}
            className="flex flex-col items-center gap-1 transition duration-300 ease-in-out hover:bg-white hover:text-black px-3 py-1 rounded"
          >
            <p>{label}</p>
          </NavLink>
        ))}
      </ul>

      {/* Right Side Icons */}
      <div className="flex items-center gap-6">
        {/* Profile */}
        <div className="group relative z-[100]">
          <Link to="/login">
            <img src={assets.profileLogo} className="w-5 cursor-pointer filter brightness-0 invert" />
          </Link>
          <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
            <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-gray-800 text-yellow-300 rounded">
              <p className="cursor-pointer hover:text-yellow-100">My Profile</p>
              <p className="cursor-pointer hover:text-yellow-100">Orders</p>
              <p className="cursor-pointer hover:text-yellow-100">Logout</p>
            </div>
          </div>
        </div>

        {/* Cart */}
        <Link to="/cart" className="relative">
          <img src={assets.cartLogo} className="w-5 cursor-pointer filter brightness-0 invert" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-yellow-400 text-black aspect-square rounded-full text-[10px]">
            {getCartCount()}
          </p>
        </Link>

        {/* Hamburger Menu */}
        <img onClick={() => setVisible(true)} src={assets.menu} className="w-5 cursor-pointer filter brightness-0 invert sm:hidden" />
      </div>

      {/* Mobile Menu */}
      <div
        className={`absolute z-[1000] top-0 right-0 bottom-0 bg-black text-yellow-300 transition-all duration-300 ${
          visible ? 'w-full' : 'w-0'
        } overflow-hidden`}
      >
        <div className="flex flex-col">
          <div onClick={() => setVisible(false)} className="flex items-center gap-4 p-3">
            <img className="h-4 rotate-90 filter brightness-0 invert" src={assets.dropdown} />
            <p>Back</p>
          </div>

          {navLinks.map(({ path, label }) => (
            <NavLink
              key={path}
              onClick={() => setVisible(false)}
              to={path}
              className="py-2 pl-6 border-b border-gray-700 transition duration-300 ease-in-out hover:bg-white hover:text-black"
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Navbar
