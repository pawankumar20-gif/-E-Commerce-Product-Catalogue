import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { FiPlus, FiEdit, FiTrash2, FiX } from 'react-icons/fi'
import { toast } from 'react-toastify'
import Breadcrumb from '../components/Breadcrumb'
import { useAuth, useProducts } from '../hooks'

const AdminDashboard = () => {
  const { user } = useAuth()
  const { products, categories } = useProducts()
  const [activeTab, setActiveTab] = useState('products')
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    originalPrice: '',
    description: '',
    brand: '',
    category: '',
    rating: '4',
    image: ''
  })

  // Mock analytics data
  const analyticsData = [
    { month: 'Jan', sales: 4000, views: 2400 },
    { month: 'Feb', sales: 3000, views: 1398 },
    { month: 'Mar', sales: 2000, views: 9800 },
    { month: 'Apr', sales: 2780, views: 3908 },
    { month: 'May', sales: 1890, views: 4800 }
  ]

  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-16">
        <p className="text-xl font-semibold mb-4">Access Denied</p>
        <p className="text-gray-600 mb-8">You need admin privileges to access this page</p>
        <Link to="/" className="btn-primary">
          Go Home
        </Link>
      </div>
    )
  }

  const handleAddProduct = (e) => {
    e.preventDefault()
    if (editingProduct) {
      toast.success('Product updated successfully')
      setEditingProduct(null)
    } else {
      toast.success('Product added successfully')
    }
    setFormData({
      title: '',
      price: '',
      originalPrice: '',
      description: '',
      brand: '',
      category: '',
      rating: '4',
      image: ''
    })
    setShowForm(false)
  }

  const handleDeleteProduct = (id) => {
    toast.success('Product deleted successfully')
  }

  return (
    <div>
      <Breadcrumb />

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="text-sm text-gray-600">
          Welcome, {user?.name}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Products', value: products.length, icon: '📦' },
          { label: 'Categories', value: categories.length, icon: '🏷️' },
          { label: 'Total Views', value: '12,450', icon: '👁️' },
          { label: 'Wishlist Count', value: '345', icon: '❤️' }
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-xl">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="glass rounded-xl p-6">
        <div className="flex gap-4 mb-6 border-b">
          {['products', 'categories', 'analytics'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-semibold transition ${
                activeTab === tab
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <button
              onClick={() => {
                setShowForm(!showForm)
                setEditingProduct(null)
              }}
              className="mb-6 flex items-center gap-2 btn-primary"
            >
              <FiPlus /> Add New Product
            </button>

            {showForm && (
              <motion.form
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleAddProduct}
                className="p-6 bg-gray-50 rounded-lg mb-6 space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Product Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="px-4 py-2 border rounded-lg outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    placeholder="Brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="px-4 py-2 border rounded-lg outline-none focus:border-primary"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="px-4 py-2 border rounded-lg outline-none focus:border-primary"
                  />
                  <input
                    type="number"
                    placeholder="Original Price"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="px-4 py-2 border rounded-lg outline-none focus:border-primary"
                  />
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="px-4 py-2 border rounded-lg outline-none focus:border-primary"
                  >
                    <option value="">Select Category</option>
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion</option>
                    <option value="home">Home</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Rating (0-5)"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    className="px-4 py-2 border rounded-lg outline-none focus:border-primary"
                  />
                </div>
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:border-primary resize-none"
                  rows="3"
                />
                <div className="flex gap-2">
                  <button type="submit" className="btn-primary">
                    {editingProduct ? 'Update' : 'Add'} Product
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </motion.form>
            )}

            {/* Products List */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left">Product</th>
                    <th className="px-4 py-3 text-left">Brand</th>
                    <th className="px-4 py-3 text-left">Price</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-center">Rating</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 10).map(product => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{product.title}</td>
                      <td className="px-4 py-3">{product.brand}</td>
                      <td className="px-4 py-3 font-semibold">₹{product.price}</td>
                      <td className="px-4 py-3">{product.category}</td>
                      <td className="px-4 py-3 text-center">{product.rating} ★</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => {
                            setEditingProduct(product)
                            setShowForm(true)
                          }}
                          className="text-primary hover:text-primary/70 mr-3"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-accent hover:text-accent/70"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div>
            <button className="mb-6 flex items-center gap-2 btn-primary">
              <FiPlus /> Add Category
            </button>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categories.map(cat => (
                <div key={cat.id} className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                  <span className="font-semibold">{cat.name}</span>
                  <div className="flex gap-2">
                    <button className="text-primary hover:text-primary/70"><FiEdit /></button>
                    <button className="text-accent hover:text-accent/70"><FiTrash2 /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div>
              <h3 className="font-semibold mb-4">Sales & Views Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#4f46e5" />
                  <Line type="monotone" dataKey="views" stroke="#7c3aed" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
