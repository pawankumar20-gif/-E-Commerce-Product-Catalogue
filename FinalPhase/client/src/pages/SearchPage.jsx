import React, { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb'
import ProductCard from '../components/ProductCard'
import QuickViewModal from '../components/QuickViewModal'
import SkeletonLoader from '../components/SkeletonLoader'
import { useProducts } from '../hooks'

const SearchPage = () => {
  const [searchParams] = useSearchParams()
  const { products, loading, addToBrowsingHistory } = useProducts()
  const [selectedProduct, setSelectedProduct] = useState(null)

  const query = searchParams.get('q') || ''
  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.brand.toLowerCase().includes(query.toLowerCase()) ||
    p.description?.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div>
      <Breadcrumb />

      <h1 className="text-3xl font-bold mb-2">Search Results</h1>
      <p className="text-gray-600 mb-8">
        {loading ? 'Searching...' : `Found ${filtered.length} products for "${query}"`}
      </p>

      {loading ? (
        <SkeletonLoader count={12} />
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(product => (
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
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500 mb-4">No products found for "{query}"</p>
          <Link to="/products" className="btn-primary">
            Browse All Products
          </Link>
        </div>
      )}

      <QuickViewModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(product, qty) => {
          console.log(`Added ${qty} of ${product.title}`)
          setSelectedProduct(null)
        }}
      />
    </div>
  )
}

export default SearchPage
