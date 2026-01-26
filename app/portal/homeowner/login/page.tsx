'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { FiHome, FiMail, FiLock, FiArrowRight } from 'react-icons/fi'

export default function HomeownerLoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (isLogin) {
        // Login with NextAuth
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        })

        if (result?.error) {
          setError('Invalid email or password')
        } else if (result?.ok) {
          router.push('/portal/homeowner/dashboard')
          router.refresh()
        }
      } else {
        // Register
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            name: formData.name,
            role: 'HOMEOWNER',
            phone: formData.phone || undefined,
          }),
        })

        const data = await response.json()

        if (data.success) {
          // Auto-login after registration
          const result = await signIn('credentials', {
            email: formData.email,
            password: formData.password,
            redirect: false,
          })

          if (result?.ok) {
            router.push('/portal/homeowner/dashboard')
            router.refresh()
          } else {
            setError('Registration successful, but login failed. Please try logging in.')
          }
        } else {
          setError(data.error || 'Registration failed')
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
          <div className="text-center mb-8">
            <Logo size="medium" showTagline={false} />
            <h1 className="text-3xl font-black text-teal-800 mt-4 mb-2">
              Homeowner Portal
            </h1>
            <p className="text-gray-600 font-semibold">
              {isLogin ? 'Welcome back!' : 'Create your account'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-400 text-red-800 rounded-xl font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required={!isLogin}
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-teal-300 rounded-xl focus:ring-4 focus:ring-teal-400 focus:border-teal-500 bg-white shadow-md transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-teal-300 rounded-xl focus:ring-4 focus:ring-teal-400 focus:border-teal-500 bg-white shadow-md transition-all"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <FiMail className="inline w-4 h-4 mr-2" />
                Email *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-teal-300 rounded-xl focus:ring-4 focus:ring-teal-400 focus:border-teal-500 bg-white shadow-md transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <FiLock className="inline w-4 h-4 mr-2" />
                Password *
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                minLength={8}
                className="w-full px-4 py-3 border-2 border-teal-300 rounded-xl focus:ring-4 focus:ring-teal-400 focus:border-teal-500 bg-white shadow-md transition-all"
                placeholder={isLogin ? '••••••••' : 'At least 8 characters'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
              <FiArrowRight className="inline ml-2 w-5 h-5" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setError(null)
                setFormData({ email: '', password: '', name: '', phone: '' })
              }}
              className="text-teal-700 font-bold hover:text-teal-900 transition-colors"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <Link
              href="/portal"
              className="text-gray-600 font-semibold hover:text-teal-700 transition-colors"
            >
              ← Back to Portal Selection
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
