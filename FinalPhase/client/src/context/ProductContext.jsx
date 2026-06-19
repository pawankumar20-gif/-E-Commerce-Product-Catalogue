import React, { createContext, useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'

export const ProductContext = createContext()

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    priceRange: [0, 300000],
    brands: [],
    ratings: [],
    colors: [],
    sizes: [],
    availability: true,
    discounts: []
  })
  const [sortBy, setSortBy] = useState('newest')
  const [searchQuery, setSearchQuery] = useState('')
  const [browsingHistory, setBrowsingHistory] = useState(() => {
    const saved = localStorage.getItem('browsingHistory')
    return saved ? JSON.parse(saved) : []
  })

  // Fetch products
  const fetchProducts = useCallback(async (queryParams = {}) => {
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams(queryParams)
      const url = `/api/products${params.toString() ? '?' + params.toString() : ''}`
      const response = await fetch(url)
      const data = await response.json()
      if (data.success) {
        setProducts(data.products)
      } else {
        setError(data.message || 'Failed to load products')
      }
    } catch (err) {
      console.error('Error fetching products:', err)
      setError(err.message)
      toast.error('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      if (data.success) {
        setCategories(data.categories)
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }, [])

  // Add to browsing history
  const addToBrowsingHistory = useCallback((product) => {
    setBrowsingHistory(prev => {
      const filtered = prev.filter(p => p.id !== product.id)
      const updated = [product, ...filtered].slice(0, 20)
      localStorage.setItem('browsingHistory', JSON.stringify(updated))
      return updated
    })
  }, [])

  // Apply filters
  const applyFilters = useCallback(async () => {
    const queryParams = {
      search: searchQuery,
      sort: sortBy,
      ...(filters.priceRange && {
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1]
      }),
      ...(filters.brands?.length && { brand: filters.brands.join(',') }),
    }
    await fetchProducts(queryParams)
  }, [filters, sortBy, searchQuery, fetchProducts])

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [fetchProducts, fetchCategories])

  const value = {
    products,
    categories,
    loading,
    error,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    browsingHistory,
    addToBrowsingHistory,
    fetchProducts,
    fetchCategories,
    applyFilters
  }

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
}
