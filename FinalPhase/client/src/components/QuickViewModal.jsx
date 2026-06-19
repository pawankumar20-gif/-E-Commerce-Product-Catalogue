import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX } from 'react-icons/fi'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { BsCart3, BsCartCheckFill } from 'react-icons/bs'
import { useWishlist, useCart } from '../hooks'
import { formatPrice, calculateDiscount } from '../utils/helpers'

const QuickViewModal = ({ product, onClose }) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const { addToCart, isInCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const inWishlist = isInWishlist(product?.id)

  if (!product) return null

  const discount = calculateDiscount(product.originalPrice || product.price, product.price)
  const inCart = isInCart(product.id)

  const handleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  const handleAddToCart = () => {
    addToCart(product, quantity)
    onClose()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="glass rounded-2xl p-6 max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-200 rounded-lg"
          >
            <FiX size={20} />
          </button>

          <div className="mb-4">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            {discount > 0 && (
              <div className="absolute top-20 right-8 bg-accent text-white px-3 py-1 rounded-full text-sm font-bold">
                {discount}% OFF
              </div>
            )}
          </div>

          <h2 className="font-bold text-lg mb-2">{product.title}</h2>
          <p className="text-sm text-gray-600 mb-2">{product.brand}</p>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i}>{i < Math.round(product.rating) ? '★' : '☆'}</span>
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.ratingCount || 0})</span>
          </div>

          <p className="text-sm text-gray-700 mb-4">{product.description}</p>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm line-through text-gray-500">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mb-4">
            <label className="text-sm">Quantity:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
              className="w-16 px-2 py-1 border border-gray-300 rounded"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center gap-2 font-semibold px-4 py-2 rounded-lg transition ${
                inCart
                  ? 'bg-green-500 text-white hover:bg-green-600 hover:shadow-lg hover:scale-105'
                  : 'btn-primary'
              }`}
            >
              {inCart ? <><BsCartCheckFill /> Add More</> : <><BsCart3 /> Add to Cart</>}
            </button>
            <button
              onClick={handleWishlist}
              className={`flex-1 px-4 py-2 rounded-lg border-2 font-semibold flex items-center justify-center gap-2 ${
                inWishlist
                  ? 'border-accent text-accent'
                  : 'border-gray-300 text-gray-600 hover:border-accent'
              }`}
            >
              {inWishlist ? <AiFillHeart /> : <AiOutlineHeart />}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default QuickViewModal
