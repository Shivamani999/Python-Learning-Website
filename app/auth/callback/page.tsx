'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Supabase automatically handles the OAuth callback
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
          router.push('/dashboard')
        } else {
          router.push('/auth')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        router.push('/auth')
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center magic-bg">
      <div className="text-center">
        <div className="text-4xl mb-4">🐍</div>
        <h1 className="text-2xl font-bold text-white mb-2">Authenticating...</h1>
        <p className="text-white/70">Redirecting to your dashboard...</p>
      </div>
    </div>
  )
}
