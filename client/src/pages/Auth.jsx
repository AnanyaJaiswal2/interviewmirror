import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { authService } from '../services/api'

export default function Auth() {
  const [mode, setMode] = useState('login')       // 'login' or 'signup'
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    // ...form = spread existing values, then overwrite the changed field
  }

  const handleSubmit = async (e) => {
    e.preventDefault()  // stop the browser from refreshing the page
    setError('')
    setLoading(true)

    try {
      const fn = mode === 'login' ? authService.login : authService.signup
      const res = await fn(form)

      login(res.data.user, res.data.token)  // update AuthContext
      navigate('/dashboard')               // go to dashboard

    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-gray-900 border border-white/10 rounded-2xl p-8">

          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-sm font-bold text-white">
              IM
            </div>
            <span className="text-white font-semibold">InterviewMirror</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-1">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-gray-400 text-sm mb-6">
            {mode === 'login'
              ? 'Sign in to continue your practice'
              : 'Start your AI-powered interview journey'}
          </p>

          {/* Toggle Login / Signup */}
          <div className="flex bg-gray-800 rounded-xl p-1 mb-6">
            {['login', 'signup'].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError('') }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition
                  ${mode === m
                    ? 'bg-violet-600 text-white'
                    : 'text-gray-400 hover:text-white'}`}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name field — only on signup */}
            <AnimatePresence>
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <input
                    name="name"
                    type="text"
                    placeholder="Full name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-800 border border-white/10 rounded-xl
                               px-4 py-3 text-white placeholder-gray-500
                               focus:outline-none focus:border-violet-500 transition text-sm"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <input
              name="email"
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-white/10 rounded-xl
                         px-4 py-3 text-white placeholder-gray-500
                         focus:outline-none focus:border-violet-500 transition text-sm"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-white/10 rounded-xl
                         px-4 py-3 text-white placeholder-gray-500
                         focus:outline-none focus:border-violet-500 transition text-sm"
            />

            {/* Error message */}
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm text-center"
              >
                {error}
              </motion.p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50
                         transition py-3 rounded-xl text-white font-semibold text-sm"
            >
              {loading
                ? 'Please wait...'
                : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}