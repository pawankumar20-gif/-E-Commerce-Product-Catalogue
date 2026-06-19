import React from 'react'
import { Link } from 'react-router-dom'
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className="glass mt-16 border-t border-white/20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-bold text-xl mb-4 bg-gradient-primary bg-clip-text text-transparent">
              👑 Belmont & Oak
            </h3>
            <p className="text-sm text-gray-600">
              Modern E-Commerce Product Catalogue with advanced features for seamless shopping.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-primary transition">Home</Link></li>
              <li><Link to="/products" className="hover:text-primary transition">All Products</Link></li>
              <li><Link to="/wishlist" className="hover:text-primary transition">Wishlist</Link></li>
              <li><Link to="/compare" className="hover:text-primary transition">Compare</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/category/electronics" className="hover:text-primary transition">Electronics</Link></li>
              <li><Link to="/category/fashion" className="hover:text-primary transition">Fashion</Link></li>
              <li><Link to="/category/home" className="hover:text-primary transition">Home</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4 text-xl">
              <FiFacebook className="hover:text-primary cursor-pointer" />
              <FiTwitter className="hover:text-primary cursor-pointer" />
              <FiInstagram className="hover:text-primary cursor-pointer" />
              <FiLinkedin className="hover:text-primary cursor-pointer" />
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center text-sm text-gray-600">
          <p>&copy; 2024 Belmont & Oak. All rights reserved. | Built for FEDF Project</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
