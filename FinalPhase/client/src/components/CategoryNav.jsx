import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiChevronDown, FiChevronRight } from 'react-icons/fi'
import { motion } from 'framer-motion'

const CategoryNav = () => {
  const navigate = useNavigate()
  const [expandedCategory, setExpandedCategory] = useState(null)

  const categories = {
    Electronics: [
      { name: 'Mobiles', path: 'mobiles' },
      { name: 'Laptops', path: 'laptops' },
      { name: 'Smart Watches', path: 'smartwatches' }
    ],
    Fashion: [
      { name: 'Men', path: 'men' },
      { name: 'Women', path: 'women' },
      { name: 'Kids', path: 'kids' }
    ],
    Home: [
      { name: 'Furniture', path: 'furniture' },
      { name: 'Kitchen', path: 'kitchen' },
      { name: 'Decor', path: 'decor' }
    ]
  }

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category)
  }

  return (
    <div className="glass p-4 rounded-xl max-w-sm w-full">
      <h2 className="font-bold text-lg mb-4">Categories</h2>
      <div className="space-y-2">
        {Object.entries(categories).map(([categoryName, subcategories]) => (
          <div key={categoryName}>
            <button
              onClick={() => toggleCategory(categoryName)}
              className="w-full flex items-center justify-between font-semibold text-sm p-2 hover:bg-primary/10 rounded transition"
            >
              <span>{categoryName}</span>
              {expandedCategory === categoryName ? (
                <FiChevronDown size={18} />
              ) : (
                <FiChevronRight size={18} />
              )}
            </button>

            {expandedCategory === categoryName && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gray-50 rounded ml-2 overflow-hidden"
              >
                {subcategories.map(sub => (
                  <button
                    key={sub.path}
                    onClick={() => navigate(`/category/electronics/${sub.path}`)}
                    className="w-full text-left text-sm px-4 py-2 hover:text-primary transition flex items-center gap-2"
                  >
                    <FiChevronRight size={14} />
                    {sub.name}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryNav
