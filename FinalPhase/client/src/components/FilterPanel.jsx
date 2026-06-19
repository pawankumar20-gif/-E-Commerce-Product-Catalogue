import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useProducts } from '../hooks'
import { FiChevronDown, FiChevronUp, FiX } from 'react-icons/fi'

const FilterPanel = ({ onClose }) => {
  const { filters, setFilters } = useProducts()
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    brand: false,
    rating: false,
    color: false,
    size: false,
    availability: false
  })

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const brands = ['Apple', 'Samsung', 'Sony', 'Dell', 'HP', 'Lenovo', 'Nike', 'Adidas', 'Puma']
  const colors = ['Black', 'White', 'Gray', 'Blue', 'Red', 'Green', 'Yellow', 'Pink']
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '32', '34', '36', '38', '40', '42']

  const handlePriceChange = (index, value) => {
    const newRange = [...filters.priceRange]
    newRange[index] = parseInt(value)
    setFilters({ ...filters, priceRange: newRange })
  }

  const handleBrandChange = (brand) => {
    setFilters({
      ...filters,
      brands: filters.brands.includes(brand)
        ? filters.brands.filter(b => b !== brand)
        : [...filters.brands, brand]
    })
  }

  const handleRatingChange = (rating) => {
    setFilters({
      ...filters,
      ratings: filters.ratings.includes(rating)
        ? filters.ratings.filter(r => r !== rating)
        : [...filters.ratings, rating]
    })
  }

  const handleColorChange = (color) => {
    setFilters({
      ...filters,
      colors: filters.colors.includes(color)
        ? filters.colors.filter(c => c !== color)
        : [...filters.colors, color]
    })
  }

  const handleSizeChange = (size) => {
    setFilters({
      ...filters,
      sizes: filters.sizes.includes(size)
        ? filters.sizes.filter(s => s !== size)
        : [...filters.sizes, size]
    })
  }

  const handleClearAll = () => {
    setFilters({
      priceRange: [0, 300000],
      brands: [],
      ratings: [],
      colors: [],
      sizes: [],
      availability: true,
      discounts: []
    })
  }

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      className="glass p-4 rounded-xl max-w-sm w-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-lg">Filters</h2>
        <button onClick={handleClearAll} className="text-xs text-primary hover:underline">
          Clear All
        </button>
        {onClose && (
          <button onClick={onClose} className="md:hidden">
            <FiX />
          </button>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between font-semibold text-sm mb-2"
        >
          Price Range
          {expandedSections.price ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        {expandedSections.price && (
          <div className="space-y-3">
            <div>
              <label className="text-xs mb-1 block">Min: ₹{filters.priceRange[0]}</label>
              <input
                type="range"
                min="0"
                max="300000"
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceChange(0, e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs mb-1 block">Max: ₹{filters.priceRange[1]}</label>
              <input
                type="range"
                min="0"
                max="300000"
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceChange(1, e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Brands */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('brand')}
          className="w-full flex items-center justify-between font-semibold text-sm mb-2"
        >
          Brand
          {expandedSections.brand ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        {expandedSections.brand && (
          <div className="space-y-2">
            {brands.map(brand => (
              <label key={brand} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                  className="rounded"
                />
                {brand}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('rating')}
          className="w-full flex items-center justify-between font-semibold text-sm mb-2"
        >
          Rating
          {expandedSections.rating ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        {expandedSections.rating && (
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => (
              <label key={rating} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.ratings.includes(rating)}
                  onChange={() => handleRatingChange(rating)}
                  className="rounded"
                />
                {'★'.repeat(rating)}{'☆'.repeat(5-rating)}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Color */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('color')}
          className="w-full flex items-center justify-between font-semibold text-sm mb-2"
        >
          Color
          {expandedSections.color ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        {expandedSections.color && (
          <div className="grid grid-cols-4 gap-2">
            {colors.map(color => (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                className={`p-2 rounded text-xs font-semibold transition ${
                  filters.colors.includes(color)
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Size */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('size')}
          className="w-full flex items-center justify-between font-semibold text-sm mb-2"
        >
          Size
          {expandedSections.size ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        {expandedSections.size && (
          <div className="grid grid-cols-4 gap-2">
            {sizes.map(size => (
              <button
                key={size}
                onClick={() => handleSizeChange(size)}
                className={`p-2 rounded text-xs font-semibold transition ${
                  filters.sizes.includes(size)
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Availability */}
      <div>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={filters.availability}
            onChange={(e) => setFilters({ ...filters, availability: e.target.checked })}
            className="rounded"
          />
          In Stock Only
        </label>
      </div>
    </motion.div>
  )
}

export default FilterPanel
