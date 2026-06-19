import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { AiOutlineSwap } from 'react-icons/ai'
import { BsCart3, BsCartCheckFill } from 'react-icons/bs'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Breadcrumb from '../components/Breadcrumb'
import ProductCard from '../components/ProductCard'
import SkeletonLoader from '../components/SkeletonLoader'
import { useProducts, useWishlist, useCompare, useCart } from '../hooks'
import { formatPrice, calculateDiscount } from '../utils/helpers'

const ProductDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products, loading: productsLoading, addToBrowsingHistory } = useProducts()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const { isInCompare, addToCompare, removeFromCompare } = useCompare()
  const { addToCart, isInCart } = useCart()

  const [product, setProduct] = useState(null)
  const [activeTab, setActiveTab] = useState('description')
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (productsLoading) return // wait until products are loaded
    const found = products.find(p => p.id === parseInt(id))
    if (found) {
      setProduct(found)
      addToBrowsingHistory(found)
    }
    setLoading(false)
  }, [id, products, productsLoading])

  if (loading) return <SkeletonLoader type="list" count={1} />

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-lg mb-4">Product not found</p>
        <Link to="/products" className="btn-primary">
          Back to Products
        </Link>
      </div>
    )
  }

  const inWishlist = isInWishlist(product.id)
  const inCompare = isInCompare(product.id)
  const inCart = isInCart(product.id)
  const discount = calculateDiscount(product.originalPrice || product.price, product.price)
  const similarProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)

  const handleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  const handleCompare = () => {
    if (inCompare) {
      removeFromCompare(product.id)
    } else {
      addToCompare(product)
    }
  }

  const handleAddToCart = () => {
    addToCart(product, quantity)
    addToCompare(product, { silent: true })
  }

  return (
    <div>
      <Breadcrumb />

      {/* Product Details */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass p-8 rounded-2xl mb-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Image Gallery */}
          <div>
            <div className="relative mb-4 bg-gray-100 rounded-lg aspect-square overflow-hidden">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {discount > 0 && (
                <div className="absolute top-3 right-3 bg-accent text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                  {discount}% OFF
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <p className="text-sm text-gray-500 mb-2 uppercase">{product.brand}</p>
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex text-yellow-400 text-xl">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>{i < Math.round(product.rating) ? '★' : '☆'}</span>
                ))}
              </div>
              <span className="text-sm text-gray-600">({product.ratingCount || 0} reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg line-through text-gray-500">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              {discount > 0 && (
                <p className="text-sm text-green-600 font-semibold">
                  Save {discount}% on this product
                </p>
              )}
            </div>

            {/* Product Details */}
            <div className="mb-6 space-y-2 text-sm">
              <p><span className="font-semibold">Color:</span> {product.color}</p>
              <p><span className="font-semibold">Size:</span> {product.size || 'One Size'}</p>
              <p><span className="font-semibold">Stock:</span> {product.stock ? 'In Stock' : 'Out of Stock'}</p>
            </div>

            {/* Quantity & Actions */}
            <div className="flex gap-4 mb-6">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center border-0 outline-none"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 font-semibold px-4 py-2 rounded-lg transition ${
                  inCart
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'btn-primary'
                }`}
              >
                {inCart ? <><BsCartCheckFill /> In Cart — Add More</> : <><BsCart3 /> Add to Cart</>}
              </button>
            </div>

            {/* Secondary Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleWishlist}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 font-semibold transition ${
                  inWishlist
                    ? 'border-accent text-accent'
                    : 'border-gray-300 text-gray-600 hover:border-accent'
                }`}
              >
                {inWishlist ? <AiFillHeart /> : <AiOutlineHeart />}
                {inWishlist ? 'Wishlisted' : 'Wishlist'}
              </button>
              <button
                onClick={handleCompare}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 font-semibold transition ${
                  inCompare
                    ? 'border-accent text-accent'
                    : 'border-gray-300 text-gray-600 hover:border-accent'
                }`}
              >
                <AiOutlineSwap />
                Compare
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t pt-8">
          <div className="flex gap-4 mb-6">
            {['description', 'specifications', 'reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-semibold transition ${
                  activeTab === tab
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p>{product.description || 'No description available'}</p>
            </div>
          )}

          {activeTab === 'specifications' && (
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b">
                  <td className="py-3 font-semibold">Brand</td>
                  <td className="py-3">{product.brand}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 font-semibold">Color</td>
                  <td className="py-3">{product.color}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 font-semibold">Size</td>
                  <td className="py-3">{product.size || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold">Warranty</td>
                  <td className="py-3">{product.warranty || '1 Year'}</td>
                </tr>
              </tbody>
            </table>
          )}

          {activeTab === 'reviews' && (
            <div className="text-center py-8">
              <p className="text-gray-600">No reviews yet. Be the first to review!</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold mb-6">Similar Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {similarProducts.map(p => (
              <ProductCard key={p.id} product={p} onQuickView={() => {}} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default ProductDetailPage
