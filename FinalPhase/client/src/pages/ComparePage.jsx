import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCheck, FiX, FiAlertTriangle, FiAward, FiTrendingUp, FiTrendingDown } from 'react-icons/fi'
import { BsCart3 } from 'react-icons/bs'
import Breadcrumb from '../components/Breadcrumb'
import ErrorBoundary from '../components/ErrorBoundary'
import { useCompare, useCart } from '../hooks'
import { formatPrice, calculateDiscount } from '../utils/helpers'

// Generate pros/cons for each product relative to all products in the comparison
const generateProsAndCons = (product, allProducts) => {
  const pros = []
  const cons = []

  if (allProducts.length < 2) return { pros: ['Add more products to compare'], cons: [] }

  const otherProducts = allProducts.filter(p => p.id !== product.id)

  // ─── Price Analysis ───
  const avgPrice = allProducts.reduce((s, p) => s + p.price, 0) / allProducts.length
  const cheapest = allProducts.reduce((a, b) => a.price < b.price ? a : b)
  const mostExpensive = allProducts.reduce((a, b) => a.price > b.price ? a : b)

  if (product.id === cheapest.id && allProducts.length > 1) {
    const savings = mostExpensive.price - product.price
    pros.push(`Cheapest option — saves ${formatPrice(savings)} vs most expensive`)
  } else if (product.id === mostExpensive.id && allProducts.length > 1) {
    const extra = product.price - cheapest.price
    cons.push(`Most expensive — costs ${formatPrice(extra)} more than cheapest`)
  } else if (product.price < avgPrice) {
    pros.push(`Below average price (${formatPrice(avgPrice - product.price)} less)`)
  } else if (product.price > avgPrice) {
    cons.push(`Above average price (${formatPrice(product.price - avgPrice)} more)`)
  }

  // ─── Discount Analysis ───
  const discount = calculateDiscount(product.originalPrice || product.price, product.price)
  const maxDiscount = Math.max(...allProducts.map(p => calculateDiscount(p.originalPrice || p.price, p.price)))
  const minDiscount = Math.min(...allProducts.map(p => calculateDiscount(p.originalPrice || p.price, p.price)))

  if (discount > 0 && discount === maxDiscount && discount > minDiscount) {
    pros.push(`Best discount at ${discount}% off`)
  } else if (discount === 0 && maxDiscount > 0) {
    cons.push('No discount currently available')
  } else if (discount > 0 && discount === minDiscount && maxDiscount > discount) {
    cons.push(`Lowest discount at only ${discount}% off`)
  }

  // ─── Rating Analysis ───
  const bestRating = Math.max(...allProducts.map(p => p.rating))
  const worstRating = Math.min(...allProducts.map(p => p.rating))

  if (product.rating === bestRating && product.rating > worstRating) {
    pros.push(`Highest rated at ${product.rating}★`)
  } else if (product.rating === worstRating && product.rating < bestRating) {
    cons.push(`Lowest rated at ${product.rating}★`)
  }

  // ─── Review Count Analysis ───
  const maxReviews = Math.max(...allProducts.map(p => p.ratingCount || 0))
  const minReviews = Math.min(...allProducts.map(p => p.ratingCount || 0))

  if ((product.ratingCount || 0) === maxReviews && maxReviews > minReviews) {
    pros.push(`Most reviewed — ${product.ratingCount.toLocaleString()} reviews (more trusted)`)
  } else if ((product.ratingCount || 0) === minReviews && minReviews < maxReviews) {
    cons.push(`Fewest reviews — ${(product.ratingCount || 0).toLocaleString()} reviews`)
  }

  // ─── Stock Analysis ───
  const maxStock = Math.max(...allProducts.map(p => p.stock || 0))
  const minStock = Math.min(...allProducts.map(p => p.stock || 0))

  if ((product.stock || 0) === maxStock && maxStock > minStock) {
    pros.push(`Best availability — ${product.stock} units in stock`)
  } else if ((product.stock || 0) <= 10 && product.stock > 0) {
    cons.push(`Low stock — only ${product.stock} units left`)
  } else if (product.stock === 0) {
    cons.push('Out of stock')
  }

  // ─── Value Score (rating per ₹1000) ───
  const valueScore = (product.rating / (product.price / 1000))
  const allValueScores = allProducts.map(p => p.rating / (p.price / 1000))
  const bestValue = Math.max(...allValueScores)
  const worstValue = Math.min(...allValueScores)

  if (valueScore === bestValue && bestValue > worstValue) {
    pros.push('Best value for money')
  } else if (valueScore === worstValue && worstValue < bestValue) {
    cons.push('Lowest value for money ratio')
  }

  // ─── Brand ───
  const premiumBrands = ['Apple', 'Samsung', 'Sony', 'Dyson', 'LG']
  if (premiumBrands.includes(product.brand)) {
    pros.push(`Premium brand — ${product.brand}`)
  }

  // Ensure at least one pro and one con
  if (pros.length === 0) pros.push('Solid all-around option')
  if (cons.length === 0) cons.push('No significant downsides')

  return { pros: pros.slice(0, 5), cons: cons.slice(0, 5) }
}

// Determine the "winner" for each feature row
const getWinner = (compareList, feature) => {
  if (compareList.length < 2) return -1
  switch (feature) {
    case 'price': {
      const min = Math.min(...compareList.map(p => p.price))
      return compareList.findIndex(p => p.price === min)
    }
    case 'rating': {
      const max = Math.max(...compareList.map(p => p.rating))
      return compareList.findIndex(p => p.rating === max)
    }
    case 'ratingCount': {
      const max = Math.max(...compareList.map(p => p.ratingCount || 0))
      return compareList.findIndex(p => (p.ratingCount || 0) === max)
    }
    case 'discount': {
      const max = Math.max(...compareList.map(p => calculateDiscount(p.originalPrice || p.price, p.price)))
      return compareList.findIndex(p => calculateDiscount(p.originalPrice || p.price, p.price) === max)
    }
    case 'stock': {
      const max = Math.max(...compareList.map(p => p.stock || 0))
      return compareList.findIndex(p => (p.stock || 0) === max)
    }
    case 'score': {
      const max = Math.max(...compareList.map(p => p.score || 0))
      return compareList.findIndex(p => (p.score || 0) === max)
    }
    default:
      return -1
  }
}

const ComparePage = () => {
  const { compareList, removeFromCompare, clearCompare } = useCompare()
  const { addToCart } = useCart()

  const prosConsData = useMemo(() => {
    return compareList.map(product => {
      const dynamic = generateProsAndCons(product, compareList)
      return {
        product,
        pros: [...(product.pros || []), ...dynamic.pros].slice(0, 5),
        cons: [...(product.cons || []), ...dynamic.cons].slice(0, 5)
      }
    })
  }, [compareList])

  // Determine overall recommendation
  const recommendation = useMemo(() => {
    if (compareList.length < 2) return null
    let bestIdx = 0
    let bestScore = 0
    compareList.forEach((p, idx) => {
      let score = 0
      // Rating weight
      if (p.rating === Math.max(...compareList.map(x => x.rating))) score += 3
      // Price weight (lower is better)
      if (p.price === Math.min(...compareList.map(x => x.price))) score += 3
      // Value weight
      const valueScore = p.rating / (p.price / 1000)
      if (valueScore === Math.max(...compareList.map(x => x.rating / (x.price / 1000)))) score += 2
      // Reviews weight
      if ((p.ratingCount || 0) === Math.max(...compareList.map(x => x.ratingCount || 0))) score += 1
      // Discount weight
      const disc = calculateDiscount(p.originalPrice || p.price, p.price)
      if (disc === Math.max(...compareList.map(x => calculateDiscount(x.originalPrice || x.price, x.price)))) score += 1

      if (score > bestScore) {
        bestScore = score
        bestIdx = idx
      }
    })
    return bestIdx
  }, [compareList])

  if (compareList.length === 0) {
    return (
      <div>
        <Breadcrumb />
        <div className="text-center py-16">
          <div className="text-8xl mb-6">⚖️</div>
          <p className="text-2xl font-semibold mb-4">No products to compare</p>
          <p className="text-gray-600 mb-8">Add up to 4 products to see a detailed comparison with pros & cons</p>
          <Link to="/products" className="btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  const comparisonFeatures = [
    { key: 'score', label: 'Final Score', format: (p) => p.score ? `${p.score} / 100` : 'N/A' },
    { key: 'price', label: 'Price', format: (p) => formatPrice(p.price) },
    { key: 'discount', label: 'Discount', format: (p) => { const d = calculateDiscount(p.originalPrice || p.price, p.price); return d > 0 ? `${d}% OFF` : 'None' } },
    { key: 'brand', label: 'Brand', format: (p) => p.brand },
    { key: 'rating', label: 'Rating', format: (p) => `${p.rating} ★` },
    { key: 'ratingCount', label: 'Reviews', format: (p) => `${(p.ratingCount || 0).toLocaleString()} reviews` },
    { key: 'color', label: 'Color', format: (p) => p.color || 'N/A' },
    { key: 'size', label: 'Size', format: (p) => p.size || 'N/A' },
    { key: 'stock', label: 'Availability', format: (p) => p.stock > 0 ? `${p.stock} in stock` : 'Out of stock' },
    { key: 'warranty', label: 'Warranty', format: (p) => p.warranty || '1 Year' },
  ]

  return (
    <div>
      <Breadcrumb />

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Compare Products ({compareList.length}/4)</h1>
        <button
          onClick={clearCompare}
          className="text-sm px-4 py-2 text-accent border border-accent rounded-lg hover:bg-accent/10"
        >
          Clear All
        </button>
      </div>

      {/* Recommendation Banner */}
      {recommendation !== null && compareList.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center gap-4"
        >
          <FiAward size={28} className="flex-shrink-0" />
          <div>
            <p className="font-bold text-lg">Our Recommendation</p>
            <p className="text-sm opacity-90">
              Based on price, rating, value, and reviews — <span className="font-bold">{compareList[recommendation].title}</span> offers the best overall package.
            </p>
          </div>
        </motion.div>
      )}

      {/* Comparison Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass rounded-xl overflow-x-auto mb-10"
      >
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-6 py-4 text-left font-semibold text-gray-500 uppercase text-xs tracking-wider w-40">Feature</th>
              {compareList.map((product, idx) => (
                <th key={idx} className="px-6 py-4 text-center">
                  <div className="relative">
                    {recommendation === idx && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs px-3 py-0.5 rounded-full font-bold whitespace-nowrap">
                        ⭐ Best Pick
                      </div>
                    )}
                    <img
                      src={product.image}
                      alt={product.title}
                      className={`w-24 h-24 object-cover rounded-lg mb-2 mx-auto mt-4 ${recommendation === idx ? 'ring-2 ring-purple-500 ring-offset-2' : ''}`}
                    />
                    <p className="font-semibold text-sm mt-1 line-clamp-2">{product.title}</p>
                    <button
                      onClick={() => removeFromCompare(product.id)}
                      className="mt-2 text-xs text-accent hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonFeatures.map((feature, rowIdx) => {
              const winnerIdx = getWinner(compareList, feature.key)
              return (
                <tr key={feature.key} className={`border-b border-gray-100 ${rowIdx % 2 === 0 ? 'bg-white/30' : ''}`}>
                  <td className="px-6 py-4 font-semibold text-sm text-gray-700">{feature.label}</td>
                  {compareList.map((product, idx) => (
                    <td
                      key={idx}
                      className={`px-6 py-4 text-center text-sm ${
                        winnerIdx === idx && compareList.length > 1
                          ? 'font-bold text-green-600'
                          : ''
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        {winnerIdx === idx && compareList.length > 1 && (
                          <FiTrendingUp className="text-green-500" size={14} />
                        )}
                        {feature.format(product)}
                      </div>
                    </td>
                  ))}
                </tr>
              )
            })}
            {/* Add to Cart Row */}
            <tr>
              <td className="px-6 py-4"></td>
              {compareList.map((product, idx) => (
                <td key={idx} className="px-6 py-4 text-center">
                  <button
                    onClick={() => addToCart(product)}
                    className="btn-primary text-sm inline-flex items-center gap-2"
                  >
                    <BsCart3 /> Add to Cart
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </motion.div>

      {/* Pros & Cons Section */}
      <ErrorBoundary>
        <h2 className="text-2xl font-bold mb-6">Pros & Cons Analysis</h2>
        <div className={`grid grid-cols-1 ${compareList.length === 2 ? 'md:grid-cols-2' : compareList.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4'} gap-6 mb-10`}>
          {prosConsData.map(({ product, pros, cons }, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`glass p-6 rounded-xl relative ${recommendation === idx ? 'ring-2 ring-purple-500' : ''}`}
            >
              {recommendation === idx && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs px-4 py-1 rounded-full font-bold whitespace-nowrap flex items-center gap-1">
                  <FiAward size={12} /> Recommended
                </div>
              )}

              {/* Product Header */}
              <div className="flex items-center gap-3 mb-5 pt-1">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-14 h-14 object-cover rounded-lg"
                />
                <div className="min-w-0 w-full">
                  <h3 className="font-bold text-sm line-clamp-1">{product.title}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-primary font-bold">{formatPrice(product.price)}</p>
                    {product.score && (
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold ml-2">
                        Score: {product.score}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Pros */}
              <div className="mb-5">
                <h4 className="flex items-center gap-2 font-bold text-green-600 mb-3 text-sm uppercase tracking-wider">
                  <FiTrendingUp /> Pros
                </h4>
                <ul className="space-y-2">
                  {pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <div className="mt-0.5 flex-shrink-0 w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                        <FiCheck size={12} />
                      </div>
                      <span className="text-gray-700">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div>
                <h4 className="flex items-center gap-2 font-bold text-red-500 mb-3 text-sm uppercase tracking-wider">
                  <FiTrendingDown /> Cons
                </h4>
                <ul className="space-y-2">
                  {cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <div className="mt-0.5 flex-shrink-0 w-5 h-5 bg-red-100 text-red-500 rounded-full flex items-center justify-center">
                        <FiX size={12} />
                      </div>
                      <span className="text-gray-700">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Add to Cart */}
              <button
                onClick={() => addToCart(product)}
                className="w-full btn-primary text-sm mt-5 flex items-center justify-center gap-2"
              >
                <BsCart3 /> Add to Cart
              </button>
            </motion.div>
          ))}
        </div>
      </ErrorBoundary>

      {/* Need More Products Prompt */}
      {compareList.length < 4 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 glass rounded-xl"
        >
          <p className="text-gray-600 mb-4">
            You can compare up to {4 - compareList.length} more product{4 - compareList.length > 1 ? 's' : ''}
          </p>
          <Link to="/products" className="btn-secondary inline-flex items-center gap-2">
            + Add More Products
          </Link>
        </motion.div>
      )}
    </div>
  )
}

export default ComparePage
