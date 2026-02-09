'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { UserProgress, UserStreak } from '@/lib/types'
import { shouldResetStreak } from '@/lib/streak'
import Link from 'next/link'
import { DynamicCodingBackground } from '@/components/DynamicCodingBackground'
import { AnimatedRocketsAndAsteroids } from '@/components/AnimatedRocketsAndAsteroids'

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [progress, setProgress] = useState<UserProgress[]>([])
  const [streak, setStreak] = useState<UserStreak | null>(null)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      router.push('/auth')
      return
    }

    setUserId(session.user.id)
    await loadUserData(session.user.id)
    setLoading(false)
  }

  const loadUserData = async (userId: string) => {
    // Load progress
    const { data: progressData } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .order('day_number')

    setProgress(progressData || [])

    // Load or create streak
    let { data: streakData } = await supabase
      .from('user_streaks')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (!streakData) {
      // Create initial streak record
      const { data: newStreak } = await supabase
        .from('user_streaks')
        .insert({
          user_id: userId,
          current_streak: 0,
          longest_streak: 0,
          last_activity_date: new Date().toISOString()
        })
        .select()
        .single()
      
      streakData = newStreak
    } else {
      // Check if streak should reset
      if (shouldResetStreak(streakData.last_activity_date)) {
        const { data: updatedStreak } = await supabase
          .from('user_streaks')
          .update({ current_streak: 0 })
          .eq('user_id', userId)
          .select()
          .single()
        
        streakData = updatedStreak
      }
    }

    setStreak(streakData)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const getNextDay = () => {
    for (let i = 1; i <= 30; i++) {
      const dayProgress = progress.find(p => p.day_number === i)
      if (!dayProgress || !dayProgress.completed) {
        return i
      }
    }
    return 1 // All complete, restart
  }

  const completedDays = progress.filter(p => p.completed).length

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen magic-bg relative overflow-hidden">
      {/* Dynamic coding background */}
      <DynamicCodingBackground />
      
      {/* Animated rockets and asteroids */}
      <AnimatedRocketsAndAsteroids />

      {/* sparkles */}
      <div className="sparkles" aria-hidden>
        <span style={{ left: '5%', top: '90%', animationDelay: '0s' }} />
        <span style={{ left: '20%', top: '95%', animationDelay: '0.8s', width: '8px', height: '8px' }} />
        <span style={{ left: '50%', top: '100%', animationDelay: '1.6s' }} />
        <span style={{ left: '75%', top: '110%', animationDelay: '2.4s', width: '7px', height: '7px' }} />
      </div>

      {/* Header */}
      <header className="glass-card shadow-sm sticky top-0 z-50 backdrop-blur-md border-b border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-3xl mr-1 animate-pulse">🐍</span>
            <h1 className="text-2xl font-bold text-white">30 Days Of Python</h1>
            <div className="ml-4 text-sm text-white/60">Keep your streak alive ✨</div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleSignOut} className="text-white text-sm bg-white/10 hover:bg-white/15 px-4 py-2 rounded-lg transition">Sign Out</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-white py-20 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-green-200 to-pink-300">Learn Python in 30 Days</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">A journey of tiny steps that becomes your strongest habit. ✨</p>
          <div className="flex gap-4 justify-center">
            <Link href={`/day/${getNextDay()}`} className="py-3 px-8 btn-magic font-bold shadow-lg">Continue Learning</Link>
            <Link href="/dashboard" className="py-3 px-6 bg-white/8 text-white rounded-lg">Your Progress</Link>
          </div>
        </div>
      </section>

      {/* Features / Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid md:grid-cols-3 gap-6 -mt-16 relative z-20">
        <div className="glass-card p-6 rounded-2xl float-anim border border-white/10">
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="none" />
                <circle cx="64" cy="64" r="56" stroke="url(#grad1)" strokeWidth="8" fill="none" strokeDasharray={`${(completedDays / 30) * 351.86} 351.86`} />
                <defs>
                  <linearGradient id="grad1" x1="0%" x2="100%">
                    <stop offset="0%" stopColor="#7b2ff7" />
                    <stop offset="100%" stopColor="#2af598" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute text-center">
                <div className="text-3xl font-bold text-white">{completedDays}</div>
                <div className="text-sm text-white/50">/ 30</div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white">Days Completed</h3>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl float-anim delay-200 border border-white/10">
          <div className="text-center">
            <div className="text-6xl mb-2">🔥</div>
            <div className="text-4xl font-bold text-white mb-2">{streak?.current_streak || 0}</div>
            <h3 className="text-lg font-semibold text-white">Current Streak</h3>
            <p className="text-sm text-white/50 mt-1">day{streak?.current_streak !== 1 ? 's' : ''} in a row</p>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl float-anim delay-400 border border-white/10">
          <div className="text-center">
            <div className="text-6xl mb-2">🏆</div>
            <div className="text-4xl font-bold text-yellow-300 mb-2">{streak?.longest_streak || 0}</div>
            <h3 className="text-lg font-semibold text-white">Longest Streak</h3>
            <p className="text-sm text-white/50 mt-1">personal best</p>
          </div>
        </div>
      </div>

      {/* Continue Learning */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-20">
        <div className="mb-8 glass-card p-6 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-bold mb-4 text-white">{completedDays === 0 ? 'Start Your Journey' : 'Continue Learning'}</h2>
          <p className="text-white/70 mb-6">{completedDays === 30 ? '🎉 Congratulations! You\'ve completed all 30 days!' : `You're on Day ${getNextDay()}. Keep going!`}</p>
          <Link href={`/day/${getNextDay()}`} className="btn-magic inline-block py-3 px-6 font-bold">{completedDays === 0 ? 'Start Day 1' : `Continue to Day ${getNextDay()}`}</Link>
        </div>

        {/* Calendar View */}
        <div className="glass-card rounded-lg shadow-md p-6 border border-white/10">
          <h2 className="text-2xl font-bold mb-6 text-white">Your Progress Calendar</h2>
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-3">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
              const dayProgress = progress.find(p => p.day_number === day)
              const isCompleted = dayProgress?.completed || false
              
              return (
                <Link
                  key={day}
                  href={`/day/${day}`}
                  className={`
                    aspect-square flex items-center justify-center rounded-lg font-semibold
                    transition-all hover:scale-105
                    ${isCompleted 
                      ? 'bg-green-500 text-white font-bold' 
                      : 'bg-white/10 text-white/70 hover:bg-white/15'
                    }
                  `}
                >
                  {day}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-transparent text-white py-8 border-t border-white/10 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="mb-4">© 2026 30 Days Of Python. Free for everyone.</p>
          <a href="https://www.instagram.com/automationwithclarity" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white/70 hover:text-pink-400 transition font-semibold">
            📱 Follow: Automation With Clarity
          </a>
        </div>
      </footer>
    </div>
  )
}
