import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiFilter, FiX } from 'react-icons/fi'
import Breadcrumb from '../components/Breadcrumb'
import ProductCard from '../components/ProductCard'
import FilterPanel from '../components/FilterPanel'
import SortingPanel from '../components/SortingPanel'
import QuickViewModal from '../components/QuickViewModal'
import CategoryNav from '../components/CategoryNav'
import SkeletonLoader from '../components/SkeletonLoader'
import { useProducts } from '../hooks'

const ProductGridPage = () => {
  const [searchParams] = useSearchParams()
  const { products, loading, categories, applyFilters, addToBrowsingHistory } = useProducts()
  const [showMobileFilter, setShowMobileFilter] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  React.useEffect(() => {
    applyFilters()
  }, [])

  const categoryParam = searchParams.get('category')

  return (
    <div>
      <Breadcrumb />

      <div className="flex gap-6 mb-8">
        {/* Desktop Filter Sidebar */}
        <div className="hidden md:block flex-shrink-0">
          <CategoryNav />
          <div className="mt-6">
            <FilterPanel />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Products</h1>
            <div className="flex gap-4">
              <button
                onClick={() => setShowMobileFilter(true)}
                className="md:hidden flex items-center gap-2 btn-secondary"
              >
                <FiFilter /> Filters
              </button>
              <SortingPanel />
            </div>
          </div>

          {/* Mobile Filter Modal */}
          {showMobileFilter && (
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setShowMobileFilter(false)}
            >
              <div onClick={(e) => e.stopPropagation()} className="h-screen overflow-y-auto p-4">
                <FilterPanel onClose={() => setShowMobileFilter(false)} />
              </div>
            </motion.div>
          )}

          {/* Product Grid */}
          {loading ? (
            <SkeletonLoader count={12} />
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map(product => (
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
              <p className="text-lg text-gray-500">No products found</p>
            </div>
          )}
        </div>
      </div>

      <QuickViewModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  )
}

export default ProductGridPage
