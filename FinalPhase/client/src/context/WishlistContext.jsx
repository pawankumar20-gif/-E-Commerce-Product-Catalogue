import React, { createContext, useState, useCallback, useEffect } from 'react'
import { toast } from 'react-toastify'

export const WishlistContext = createContext()

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('wishlist')
    return saved ? JSON.parse(saved) : []
  })

  const addToWishlist = useCallback((product) => {
    setWishlist(prev => {
      const exists = prev.find(p => p.id === product.id)
      if (exists) {
        toast.info('Already in wishlist')
        return prev
      }
      const updated = [...prev, product]
      localStorage.setItem('wishlist', JSON.stringify(updated))
      toast.success('Added to wishlist!')
      return updated
    })
  }, [])

  const removeFromWishlist = useCallback((productId) => {
    setWishlist(prev => {
      const updated = prev.filter(p => p.id !== productId)
      localStorage.setItem('wishlist', JSON.stringify(updated))
      toast.success('Removed from wishlist')
      return updated
    })
  }, [])

  const isInWishlist = useCallback((productId) => {
    return wishlist.some(p => p.id === productId)
  }, [wishlist])

  const clearWishlist = useCallback(() => {
    setWishlist([])
    localStorage.setItem('wishlist', JSON.stringify([]))
    toast.success('Wishlist cleared')
  }, [])

  const value = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    wishlistCount: wishlist.length
  }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}
