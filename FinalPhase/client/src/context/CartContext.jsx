import React, { createContext, useState, useCallback, useMemo } from 'react'
import { toast } from 'react-toastify'

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  })

  const saveCart = (updatedCart) => {
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const addToCart = useCallback((product, quantity = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id)
      let updated
      if (existingIndex >= 0) {
        updated = prev.map((item, i) =>
          i === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
        toast.success(`Updated quantity in cart!`)
      } else {
        updated = [...prev, { ...product, quantity }]
        toast.success(`${product.title} added to cart!`)
      }
      saveCart(updated)
      return updated
    })
  }, [])

  const removeFromCart = useCallback((productId) => {
    setCart(prev => {
      const item = prev.find(i => i.id === productId)
      const updated = prev.filter(i => i.id !== productId)
      saveCart(updated)
      if (item) toast.success(`${item.title} removed from cart`)
      return updated
    })
  }, [])

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity < 1) return
    setCart(prev => {
      const updated = prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
      saveCart(updated)
      return updated
    })
  }, [])

  const clearCart = useCallback(() => {
    setCart([])
    saveCart([])
    toast.success('Cart cleared')
  }, [])

  const isInCart = useCallback((productId) => {
    return cart.some(item => item.id === productId)
  }, [cart])

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [cart])

  const cartOriginalTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.originalPrice || item.price) * item.quantity, 0)
  }, [cart])

  const cartCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }, [cart])

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    cartTotal,
    cartOriginalTotal,
    cartCount
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
