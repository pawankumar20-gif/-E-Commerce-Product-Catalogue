import React from 'react'
import { useParams, Link } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb'
import ProductCard from '../components/ProductCard'
import QuickViewModal from '../components/QuickViewModal'
import { useProducts } from '../hooks'

const CategoryPage = () => {
  const { category, subcategory } = useParams()
  const { products, addToBrowsingHistory } = useProducts()
  const [selectedProduct, setSelectedProduct] = React.useState(null)

  const filtered = products.filter(p => {
    if (!subcategory) return p.category?.toLowerCase() === category?.toLowerCase()
    return p.category?.toLowerCase() === category?.toLowerCase() &&
           p.subcategory?.toLowerCase() === subcategory?.toLowerCase()
  })

  return (
    <div>
      <Breadcrumb />

      <h1 className="text-3xl font-bold mb-8 capitalize">
        {subcategory ? `${subcategory}` : category}
      </h1>

      {filtered.length > 0 ? (
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
          <p className="text-lg text-gray-500 mb-4">No products in this category</p>
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

export default CategoryPage
