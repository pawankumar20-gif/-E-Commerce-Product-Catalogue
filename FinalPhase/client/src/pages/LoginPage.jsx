import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiUser } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { useAuth } from '../hooks'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login, register, isAuthenticated } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match')
          setLoading(false)
          return
        }
        const success = await register(formData.name, formData.email, formData.password)
        if (success) navigate('/')
      } else {
        const success = await login(formData.email, formData.password)
        if (success) navigate('/')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 rounded-2xl max-w-md w-full"
      >
        <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-primary bg-clip-text text-transparent">
          Belmont & Oak
        </h1>
        <h2 className="text-xl font-semibold text-center mb-8">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="relative">
              <FiUser className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required={isSignUp}
                className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:border-primary outline-none"
              />
            </div>
          )}

          <div className="relative">
            <FiMail className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:border-primary outline-none"
            />
          </div>

          <div className="relative">
            <FiLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:border-primary outline-none"
            />
          </div>

          {isSignUp && (
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:border-primary outline-none"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <div className="mt-6">
          <p className="text-center text-sm">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp)
                setFormData({ name: '', email: '', password: '', confirmPassword: '' })
              }}
              className="text-primary hover:underline font-semibold"
            >
              {isSignUp ? 'Login' : 'Sign Up'}
            </button>
          </p>
        </div>

        {/* Demo Login Info */}
        {!isSignUp && (
          <div className="mt-6 p-4 bg-primary/10 rounded-lg text-xs">
            <p className="font-semibold mb-2">Demo Credentials:</p>
            <p>📧 admin@test.com | 🔑 admin123</p>
            <p>📧 user@test.com | 🔑 user123</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default LoginPage
