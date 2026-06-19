import React, { createContext, useState, useCallback } from 'react'
import { toast } from 'react-toastify'

export const CompareContext = createContext()

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState(() => {
    const saved = localStorage.getItem('compareList')
    return saved ? JSON.parse(saved) : []
  })

  const addToCompare = useCallback((product, options = { silent: false }) => {
    setCompareList(prev => {
      if (prev.length >= 4) {
        if (!options.silent) toast.warning('Can compare maximum 4 products')
        return prev
      }
      const exists = prev.find(p => p.id === product.id)
      if (exists) {
        if (!options.silent) toast.info('Already in compare list')
        return prev
      }
      const updated = [...prev, product]
      localStorage.setItem('compareList', JSON.stringify(updated))
      if (!options.silent) toast.success('Added to compare!')
      return updated
    })
  }, [])

  const removeFromCompare = useCallback((productId) => {
    setCompareList(prev => {
      const updated = prev.filter(p => p.id !== productId)
      localStorage.setItem('compareList', JSON.stringify(updated))
      toast.success('Removed from compare')
      return updated
    })
  }, [])

  const clearCompare = useCallback(() => {
    setCompareList([])
    localStorage.setItem('compareList', JSON.stringify([]))
  }, [])

  const isInCompare = useCallback((productId) => {
    return compareList.some(p => p.id === productId)
  }, [compareList])

  const addMultipleToCompare = useCallback((products) => {
    setCompareList(prev => {
      let updated = [...prev]
      let addedCount = 0
      
      for (const product of products) {
        if (updated.length >= 4) break
        if (!updated.find(p => p.id === product.id)) {
          updated.push(product)
          addedCount++
        }
      }
      
      if (addedCount > 0) {
        localStorage.setItem('compareList', JSON.stringify(updated))
        toast.success(`Added ${addedCount} products to compare!`)
      } else if (products.length > 0 && updated.length >= 4) {
        toast.warning('Compare list is full (max 4)')
      }
      return updated
    })
  }, [])

  const value = {
    compareList,
    addToCompare,
    addMultipleToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare,
    compareCount: compareList.length
  }

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
}
