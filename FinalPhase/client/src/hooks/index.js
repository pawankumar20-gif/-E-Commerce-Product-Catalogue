import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ProductContext } from '../context/ProductContext'
import { WishlistContext } from '../context/WishlistContext'
import { CompareContext } from '../context/CompareContext'
import { ThemeContext } from '../context/ThemeContext'
import { CartContext } from '../context/CartContext'

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export const useProducts = () => {
  const context = useContext(ProductContext)
  if (!context) throw new Error('useProducts must be used within ProductProvider')
  return context
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) throw new Error('useWishlist must be used within WishlistProvider')
  return context
}

export const useCompare = () => {
  const context = useContext(CompareContext)
  if (!context) throw new Error('useCompare must be used within CompareProvider')
  return context
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}

// Debounce hook — fixed: use named imports instead of React.useState/React.useEffect
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}
