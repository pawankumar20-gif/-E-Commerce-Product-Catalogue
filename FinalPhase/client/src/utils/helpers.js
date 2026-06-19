export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(price)
}

export const calculateDiscount = (originalPrice, discountPrice) => {
  return Math.round(((originalPrice - discountPrice) / originalPrice) * 100)
}

export const debounce = (func, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

export const truncateText = (text, limit) => {
  return text.length > limit ? text.substring(0, limit) + '...' : text
}

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9)
}

export const getInitials = (name) => {
  return name
    .split(' ')
    .map(n => n.charAt(0))
    .join('')
    .toUpperCase()
}

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
