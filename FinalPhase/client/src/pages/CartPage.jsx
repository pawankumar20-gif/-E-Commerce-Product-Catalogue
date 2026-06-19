import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowLeft } from 'react-icons/fi'
import { AiOutlineSwap } from 'react-icons/ai'
import Breadcrumb from '../components/Breadcrumb'
import { useCart, useCompare } from '../hooks'
import { formatPrice, calculateDiscount } from '../utils/helpers'

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal, cartOriginalTotal, cartCount } = useCart()
  const { addMultipleToCompare, addToCompare, removeFromCompare, isInCompare } = useCompare()
  const navigate = useNavigate()

  const handleCompareCart = () => {
    addMultipleToCompare(cart)
    navigate('/compare')
  }

  if (cart.length === 0) {
    return (
      <div>
        <Breadcrumb />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div className="text-8xl mb-6">🛒</div>
          <p className="text-3xl font-bold mb-3">Your cart is empty</p>
          <p className="text-gray-500 mb-8 text-lg">Looks like you haven't added anything yet</p>
          <Link to="/products" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-3">
            <FiShoppingBag /> Start Shopping
          </Link>
        </motion.div>
      </div>
    )
  }

  const totalSavings = cartOriginalTotal - cartTotal

  return (
    <div>
      <Breadcrumb />

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Shopping Cart ({cartCount} items)</h1>
        <div className="flex gap-4">
          {cartCount > 1 && (
            <button
              onClick={handleCompareCart}
              className="text-sm px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary/90 font-semibold flex items-center gap-2"
            >
              <AiOutlineSwap /> Compare Cart Items
            </button>
          )}
          <button
            onClick={clearCart}
            className="text-sm px-4 py-2 text-accent border border-accent rounded-lg hover:bg-accent/10 font-semibold"
          >
            Clear Cart
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {cart.map((item, index) => {
              const discount = calculateDiscount(item.originalPrice || item.price, item.price)
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass p-4 rounded-xl flex gap-4 items-center"
                >
                  {/* Product Image */}
                  <Link to={`/product/${item.id}`} className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded-lg hover:scale-105 transition"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.id}`} className="hover:text-primary transition">
                      <h3 className="font-semibold text-sm md:text-base line-clamp-2">{item.title}</h3>
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">{item.brand}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-bold text-primary">{formatPrice(item.price)}</span>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <>
                          <span className="text-xs line-through text-gray-400">{formatPrice(item.originalPrice)}</span>
                          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                            {discount}% OFF
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="p-2 rounded-md hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition"
                    >
                      <FiMinus size={14} />
                    </button>
                    <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 rounded-md hover:bg-white transition"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-primary">{formatPrice(item.price * item.quantity)}</p>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    {/* Compare Button */}
                    <button
                      onClick={() => isInCompare(item.id) ? removeFromCompare(item.id) : addToCompare(item)}
                      className={`p-2 rounded-lg transition ${isInCompare(item.id) ? 'text-accent bg-accent/10' : 'text-gray-400 hover:text-accent hover:bg-accent/10'}`}
                      title={isInCompare(item.id) ? "Remove from Compare" : "Add to Compare"}
                    >
                      <AiOutlineSwap size={18} />
                    </button>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-gray-400 hover:text-accent hover:bg-accent/10 rounded-lg transition"
                      title="Remove item"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          <Link to="/products" className="inline-flex items-center gap-2 text-primary hover:gap-3 transition mt-4 font-semibold">
            <FiArrowLeft /> Continue Shopping
          </Link>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-6 rounded-xl sticky top-24"
          >
            <h2 className="text-xl font-bold mb-6 pb-4 border-b">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal ({cartCount} items)</span>
                <span>{formatPrice(cartOriginalTotal)}</span>
              </div>
              {totalSavings > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>− {formatPrice(totalSavings)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600 font-semibold">Free</span>
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">{formatPrice(cartTotal)}</span>
              </div>
              {totalSavings > 0 && (
                <p className="text-sm text-green-600 mt-2 font-semibold text-right">
                  🎉 You're saving {formatPrice(totalSavings)}!
                </p>
              )}
            </div>

            <button className="w-full btn-primary py-3 text-lg font-bold mb-3">
              Proceed to Checkout
            </button>
            <p className="text-xs text-gray-500 text-center">
              Free shipping on all orders • Easy 30-day returns
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
