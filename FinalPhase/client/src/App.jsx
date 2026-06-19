import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Providers
import { AuthProvider } from './context/AuthContext'
import { ProductProvider } from './context/ProductContext'
import { WishlistProvider } from './context/WishlistContext'
import { CompareProvider } from './context/CompareContext'
import { ThemeProvider } from './context/ThemeContext'
import { CartProvider } from './context/CartContext'

// Layouts & Components
import MainLayout from './layouts/MainLayout'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Pages
import HomePage from './pages/HomePage'
import ProductGridPage from './pages/ProductGridPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CategoryPage from './pages/CategoryPage'
import SearchPage from './pages/SearchPage'
import WishlistPage from './pages/WishlistPage'
import ComparePage from './pages/ComparePage'
import CartPage from './pages/CartPage'
import AdminDashboard from './pages/AdminDashboard'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ProductProvider>
            <WishlistProvider>
              <CompareProvider>
                <CartProvider>
                  <ToastContainer
                    position="bottom-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={true}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                  />
                  <MainLayout>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/products" element={<ProductGridPage />} />
                      <Route path="/product/:id" element={<ProductDetailPage />} />
                      <Route path="/category/:category" element={<CategoryPage />} />
                      <Route path="/category/:category/:subcategory" element={<CategoryPage />} />
                      <Route path="/search" element={<SearchPage />} />
                      <Route path="/wishlist" element={<WishlistPage />} />
                      <Route path="/compare" element={<ComparePage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </MainLayout>
                </CartProvider>
              </CompareProvider>
            </WishlistProvider>
          </ProductProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App
