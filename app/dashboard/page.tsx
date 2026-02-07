'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { UserProgress, UserStreak } from '@/lib/types'
import { shouldResetStreak } from '@/lib/streak'
import Link from 'next/link'

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-3xl">🐍</span>
            <h1 className="text-xl font-bold text-blue-600">30 Days Of Python</h1>
          </Link>
          <button onClick={handleSignOut} className="text-gray-600 hover:text-gray-900">
            Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Progress Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#3776ab"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(completedDays / 30) * 351.86} 351.86`}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute text-center">
                  <div className="text-3xl font-bold">{completedDays}</div>
                  <div className="text-sm text-gray-500">/ 30</div>
                </div>
              </div>
              <h3 className="text-lg font-semibold">Days Completed</h3>
            </div>
          </div>

          {/* Current Streak */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <div className="text-6xl mb-2">🔥</div>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {streak?.current_streak || 0}
              </div>
              <h3 className="text-lg font-semibold">Current Streak</h3>
              <p className="text-sm text-gray-500 mt-1">day{streak?.current_streak !== 1 ? 's' : ''} in a row</p>
            </div>
          </div>

          {/* Longest Streak */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <div className="text-6xl mb-2">🏆</div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">
                {streak?.longest_streak || 0}
              </div>
              <h3 className="text-lg font-semibold">Longest Streak</h3>
              <p className="text-sm text-gray-500 mt-1">personal best</p>
            </div>
          </div>
        </div>

        {/* Continue Learning */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {completedDays === 0 ? 'Start Your Journey' : 'Continue Learning'}
          </h2>
          <p className="text-gray-600 mb-6">
            {completedDays === 30 
              ? '🎉 Congratulations! You\'ve completed all 30 days!' 
              : `You're on Day ${getNextDay()}. Keep going!`}
          </p>
          <Link 
            href={`/day/${getNextDay()}`}
            className="btn-primary inline-block"
          >
            {completedDays === 0 ? 'Start Day 1' : `Continue to Day ${getNextDay()}`}
          </Link>
        </div>

        {/* Calendar View */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Your Progress</h2>
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
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
    </div>
  )
}
