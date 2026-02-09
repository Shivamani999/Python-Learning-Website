'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AuthPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)

  useEffect(() => {
    // subtle entry animation class on mount
    document.documentElement.classList.add('magic-bg')
    return () => { document.documentElement.classList.remove('magic-bg') }
  }, [])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
      }
      
      // small UX: save email if remember checked
      if (remember) localStorage.setItem('rememberEmail', email)

      router.push('/dashboard')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      setError('')
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error: any) {
      setError(error.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    const saved = localStorage.getItem('rememberEmail')
    if (saved) setEmail(saved)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden magic-bg">
      {/* sparkles */}
      <div className="sparkles" aria-hidden>
        <span style={{left: '10%', top: '90%', animationDelay: '0s'}} />
        <span style={{left: '30%', top: '95%', animationDelay: '1s', width: '8px', height: '8px'}} />
        <span style={{left: '60%', top: '100%', animationDelay: '2s'}} />
        <span style={{left: '80%', top: '110%', animationDelay: '3s', width: '9px', height: '9px'}} />
      </div>

      <div className="glass-card p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/10 backdrop-blur-md">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-3xl font-bold text-white mb-2">
            <span className="text-3xl">🐍</span>
            <span className="text-white">30 Days Of Python</span>
          </Link>
          <p className="text-white/80 mt-2">
            {isLogin ? 'Welcome back! Sign in to continue your streak ✨' : 'Create your account and start learning today!'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg input-magic focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 pr-12 rounded-lg input-magic focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-white/60 hover:text-white">{showPassword ? 'Hide' : 'Show'}</button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="inline-flex items-center gap-2 text-white text-sm">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="rounded" /> Remember me
            </label>
            <Link href="#" className="text-sm text-white/70 hover:text-white transition">Forgot?</Link>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-600/10 text-red-100 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          <button type="submit" disabled={loading} className="w-full py-3 btn-magic disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>

          <div className="flex items-center gap-2">
            <hr className="flex-1 border-white/10" />
            <small className="text-white/70 text-xs">or continue with</small>
            <hr className="flex-1 border-white/10" />
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={handleGoogleSignIn} disabled={loading} className="w-full py-2 rounded-lg bg-white/10 text-white hover:bg-white/15 transition disabled:opacity-50 disabled:cursor-not-allowed">Google</button>
          </div>
        </form>

        <div className="mt-6 text-center space-y-4">
          <button onClick={() => { setIsLogin(!isLogin); setError('') }} className="text-white/80 hover:text-white transition text-sm">{isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}</button>
          <div className="pt-4 border-t border-white/10">
            <p className="text-sm text-white/60 mb-2">Learn more from:</p>
            <a href="https://www.instagram.com/automationwithclarity" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white/70 hover:text-pink-400 transition font-semibold text-sm">
              📱 Automation With Clarity
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
