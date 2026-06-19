import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiX } from 'react-icons/fi'
import Breadcrumb from '../components/Breadcrumb'
import ProductCard from '../components/ProductCard'
import { useWishlist, useCart } from '../hooks'
import { formatPrice } from '../utils/helpers'

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart } = useCart()

  const handleAddAllToCart = () => {
    wishlist.forEach(product => addToCart(product, 1))
  }

  if (wishlist.length === 0) {
    return (
      <div>
        <Breadcrumb />
        <div className="text-center py-16">
          <p className="text-2xl font-semibold mb-4">Your wishlist is empty</p>
          <p className="text-gray-600 mb-8">Save your favorite items for later</p>
          <Link to="/products" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  const totalPrice = wishlist.reduce((sum, p) => sum + p.price, 0)

  return (
    <div>
      <Breadcrumb />

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Wishlist ({wishlist.length})</h1>
        <button
          onClick={clearWishlist}
          className="text-sm px-4 py-2 text-accent border border-accent rounded-lg hover:bg-accent/10 transition"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Wishlist Items */}
        <div className="lg:col-span-3">
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            {wishlist.map(product => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative"
              >
                <ProductCard product={product} onQuickView={() => {}} />
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute -top-2 -right-2 p-2 bg-accent text-white rounded-full hover:scale-110 transition"
                >
                  <FiX />
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Wishlist Summary */}
        <div className="glass p-6 rounded-xl h-fit">
          <h2 className="font-bold text-lg mb-6">Wishlist Summary</h2>
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-sm">
              <span>Total Items</span>
              <span className="font-semibold">{wishlist.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total Value</span>
              <span className="font-semibold">{formatPrice(totalPrice)}</span>
            </div>
          </div>
          <button onClick={handleAddAllToCart} className="btn-primary w-full">
            Add All to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default WishlistPage
