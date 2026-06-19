import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import ProductCard from '../components/ProductCard'
import SkeletonLoader from '../components/SkeletonLoader'
import QuickViewModal from '../components/QuickViewModal'
import { useProducts, useWishlist } from '../hooks'

const HomePage = () => {
  const { products, loading, addToBrowsingHistory } = useProducts()
  const [selectedProduct, setSelectedProduct] = React.useState(null)

  const featuredProducts = products.slice(0, 8)
  const topRatedProducts = products.filter(p => p.rating >= 4.5).slice(0, 4)

  return (
    <div>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-12 rounded-2xl mb-12 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Welcome to Belmont & Oak
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Discover the perfect products from thousands of brands with advanced filtering, instant comparisons, and personalized recommendations.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/products" className="btn-primary">
            Shop Now
          </Link>
          <Link to="/products" className="px-6 py-2 border-2 border-primary text-primary rounded-lg hover:bg-primary/10 font-semibold transition">
            Explore
          </Link>
        </div>
      </motion.div>

      {/* Categories Showcase */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Electronics', icon: '💻', path: '/category/electronics' },
            { name: 'Fashion', icon: '👗', path: '/category/fashion' },
            { name: 'Home', icon: '🏠', path: '/category/home' }
          ].map((cat, i) => (
            <Link
              key={i}
              to={cat.path}
              className="glass p-8 rounded-2xl text-center hover:shadow-2xl hover:scale-105 cursor-pointer transition"
            >
              <div className="text-6xl mb-4">{cat.icon}</div>
              <h3 className="font-bold text-xl">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Link to="/products" className="flex items-center gap-2 text-primary hover:gap-4 transition">
            View All <FiArrowRight />
          </Link>
        </div>
        {loading ? (
          <SkeletonLoader count={8} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.map(product => (
              <div
                key={product.id}
                onClick={() => addToBrowsingHistory(product)}
              >
                <ProductCard
                  product={product}
                  onQuickView={setSelectedProduct}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Top Rated Products */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Top Rated</h2>
        {loading ? (
          <SkeletonLoader count={4} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {topRatedProducts.map(product => (
              <div
                key={product.id}
                onClick={() => addToBrowsingHistory(product)}
              >
                <ProductCard
                  product={product}
                  onQuickView={setSelectedProduct}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Benefits Section */}
      <section className="glass p-8 rounded-2xl mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '🚚', title: 'Free Shipping', desc: 'On orders over ₹500' },
            { icon: '💳', title: 'Easy Payment', desc: 'Multiple payment options' },
            { icon: '🔄', title: 'Easy Returns', desc: '30-day return policy' }
          ].map((benefit, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl mb-3">{benefit.icon}</div>
              <h3 className="font-semibold mb-2">{benefit.title}</h3>
              <p className="text-sm text-gray-600">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <QuickViewModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  )
}

export default HomePage
