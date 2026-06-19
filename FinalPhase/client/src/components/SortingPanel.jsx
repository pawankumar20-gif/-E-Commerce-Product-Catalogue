import React from 'react'
import { useProducts } from '../hooks'

const SortingPanel = () => {
  const { sortBy, setSortBy } = useProducts()

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'discount', label: 'Highest Discount' }
  ]

  return (
    <div className="glass p-4 rounded-lg inline-block">
      <label className="text-sm font-semibold mr-3">Sort By:</label>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="px-3 py-2 rounded-lg border border-primary/30 focus:border-primary outline-none bg-white"
      >
        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SortingPanel
