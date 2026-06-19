import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { AiOutlineEye } from 'react-icons/ai'
import { AiOutlineSwap } from 'react-icons/ai'
import { BsCart3, BsCartCheckFill } from 'react-icons/bs'
import { motion } from 'framer-motion'
import { useWishlist, useCompare, useCart } from '../hooks'
import { formatPrice, calculateDiscount } from '../utils/helpers'

const ProductCard = ({ product, onQuickView }) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const { isInCompare, addToCompare, removeFromCompare } = useCompare()
  const { addToCart, isInCart } = useCart()
  const [imageLoaded, setImageLoaded] = React.useState(false)
  const navigate = useNavigate()

  const inWishlist = isInWishlist(product.id)
  const inCompare = isInCompare(product.id)
  const inCart = isInCart(product.id)

  const handleWishlistToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (inWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  const handleCompareToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (inCompare) {
      removeFromCompare(product.id)
    } else {
      addToCompare(product)
    }
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
    addToCompare(product, { silent: true })
  }

  const handleQuickView = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onQuickView(product)
  }

  const handleCardClick = () => {
    navigate(`/product/${product.id}`)
  }

  const discount = calculateDiscount(product.originalPrice || product.price, product.price)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <div
        onClick={handleCardClick}
        className="card h-full flex flex-col group cursor-pointer overflow-hidden"
      >
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gray-100 rounded-lg mb-3 aspect-square">
          {!imageLoaded && <div className="skeleton w-full h-full" />}
          <img
            src={product.image}
            alt={product.title}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover group-hover:scale-110 ${imageLoaded ? 'block' : 'hidden'}`}
          />
          
          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-3 right-3 bg-accent text-white px-2 py-1 rounded-full text-xs font-bold">
              {discount}% OFF
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              onClick={handleQuickView}
              className="p-3 bg-white rounded-full hover:scale-110 transition"
              title="Quick View"
            >
              <AiOutlineEye size={20} className="text-primary" />
            </button>
            <button
              onClick={handleWishlistToggle}
              className="p-3 bg-white rounded-full hover:scale-110 transition"
              title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              {inWishlist ? (
                <AiFillHeart size={20} className="text-accent" />
              ) : (
                <AiOutlineHeart size={20} className="text-primary" />
              )}
            </button>
            <button
              onClick={handleCompareToggle}
              className="p-3 bg-white rounded-full hover:scale-110 transition"
              title={inCompare ? 'Remove from Compare' : 'Add to Compare'}
            >
              <AiOutlineSwap size={20} className={inCompare ? 'text-accent' : 'text-primary'} />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col">
          <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 text-gray-900">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i}>{i < Math.round(product.rating) ? '★' : '☆'}</span>
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.ratingCount || 0})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mt-auto mb-3">
            <span className="font-bold text-lg text-primary">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs line-through text-gray-500">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className={`w-full flex items-center justify-center gap-2 text-sm font-semibold py-2 rounded-lg transition ${
              inCart
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg hover:scale-[1.02]'
            }`}
          >
            {inCart ? <><BsCartCheckFill size={16} /> In Cart</> : <><BsCart3 size={16} /> Add to Cart</>}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard
