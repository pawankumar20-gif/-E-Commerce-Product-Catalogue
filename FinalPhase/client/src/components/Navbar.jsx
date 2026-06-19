import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiSearch, FiMenu, FiX, FiMoon, FiSun } from 'react-icons/fi'
import { AiOutlineHeart, AiOutlineSwap } from 'react-icons/ai'
import { BsCart3 } from 'react-icons/bs'
import { useAuth, useWishlist, useCompare, useTheme, useCart, useDebounce } from '../hooks'
import { productService } from '../services/api'

const Navbar = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout, isAdmin } = useAuth()
  const { wishlistCount } = useWishlist()
  const { compareCount } = useCompare()
  const { isDark, toggleTheme } = useTheme()
  const { cartCount } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const debouncedSearch = useDebounce(searchQuery, 300)

  React.useEffect(() => {
    if (debouncedSearch.length > 0) {
      productService.search(debouncedSearch)
        .then(res => setSuggestions(res.data.products || []))
        .catch(() => setSuggestions([]))
    } else {
      setSuggestions([])
    }
  }, [debouncedSearch])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`)
      setSearchQuery('')
      setSuggestions([])
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className={`${isDark ? 'bg-gray-900 text-white' : 'glass'} sticky top-0 z-50 shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-2xl bg-gradient-primary bg-clip-text text-transparent">
            👑 Belmont & Oak
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-8 relative">
            <input
              type="text"
              placeholder="Search products, brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border-2 ${
                isDark ? 'bg-gray-800 border-gray-700' : 'border-primary/30'
              } focus:border-primary outline-none`}
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-primary">
              <FiSearch size={20} />
            </button>
            {suggestions.length > 0 && (
              <div className={`absolute top-full left-0 right-0 mt-2 rounded-lg shadow-xl ${isDark ? 'bg-gray-800' : 'bg-white'} z-10`}>
                {suggestions.slice(0, 5).map(product => (
                  <button
                    key={product.id}
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="w-full text-left px-4 py-2 hover:bg-primary/10 transition"
                  >
                    {product.title}
                  </button>
                ))}
              </div>
            )}
          </form>

          {/* Right Menu */}
          <div className="hidden md:flex items-center gap-6">
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800">
              {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            <Link to="/wishlist" className="relative p-2 hover:text-primary">
              <AiOutlineHeart size={24} />
              {wishlistCount > 0 && <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{wishlistCount}</span>}
            </Link>

            <Link to="/compare" className="relative p-2 hover:text-primary">
              <AiOutlineSwap size={24} />
              {compareCount > 0 && <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{compareCount}</span>}
            </Link>

            <Link to="/cart" className="relative p-2 hover:text-primary">
              <BsCart3 size={24} />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {isAdmin && (
                  <Link to="/admin" className="btn-primary text-sm px-4 py-1.5">
                    Admin Panel
                  </Link>
                )}
                <div className="flex items-center gap-3 border-l pl-4 border-gray-300 dark:border-gray-600">
                  <div className="w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center shadow-md">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <button onClick={handleLogout} className="text-sm font-semibold hover:text-primary transition">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden pb-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <form onSubmit={handleSearch} className="mb-4 relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'border-gray-300'}`}
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2">
                <FiSearch />
              </button>
            </form>
            <div className="flex gap-4 justify-center py-2">
              <Link to="/wishlist" className="flex items-center gap-2">
                <AiOutlineHeart /> Wishlist ({wishlistCount})
              </Link>
              <Link to="/compare" className="flex items-center gap-2">
                <AiOutlineSwap /> Compare ({compareCount})
              </Link>
              <Link to="/cart" className="flex items-center gap-2">
                <BsCart3 /> Cart ({cartCount})
              </Link>
            </div>
            {isAuthenticated ? (
              <button onClick={handleLogout} className="btn-primary w-full">
                Logout
              </button>
            ) : (
              <Link to="/login" className="btn-primary block text-center">
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
