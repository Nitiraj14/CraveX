import React from 'react'
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';


const Footer = () => {
  return (

    <footer className="bg-gray-800 text-gray-300 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Column 1 - Brand */}
        <div className="mb-6 md:mb-0 flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="text-2xl font-bold text-white">CraveX</h2>
          <p className="mt-2 text-gray-400 max-w-xs">Delicious food delivered at your doorstep. Fast, fresh & hot!</p>
        </div>
        {/* Column 2 - Links */}
        <div className="mb-6 md:mb-0 flex flex-col items-center md:items-start">
          <h3 className="text-lg font-semibold text-white">Quick Links</h3>
          <ul className="mt-2 space-y-2">
            <li><a href="#" className="hover:text-white">Home</a></li>
            <li><a href="#" className="hover:text-white">Menu</a></li>
            <li><a href="#" className="hover:text-white">About Us</a></li>
            <li><a href="#" className="hover:text-white">Contact</a></li>
          </ul>
        </div>
        {/* Column 3 - Social */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-lg font-semibold text-white">Follow Us</h3>
          <div className="flex space-x-6 mt-3 text-2xl">
            <a href="#" className="hover:text-blue-500"><FaFacebook /></a>
            <a href="#" className="hover:text-pink-500"><FaInstagram /></a>
            <a href="#" className="hover:text-sky-400"><FaTwitter /></a>
          </div>
        </div>
      </div>
      <div className="text-center text-sm text-gray-400 border-t border-gray-700 py-4">
        © {new Date().getFullYear()} CraveX. All rights reserved.
      </div>
    </footer>

  )
}

export default Footer
