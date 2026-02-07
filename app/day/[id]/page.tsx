'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { UserProgress, UserStreak } from '@/lib/types'
import { shouldResetStreak } from '@/lib/streak'
import Link from 'next/link'

const dayTopics = [
  'Introduction',
  'Variables, Built-in Functions',
  'Operators',
  'Strings',
  'Lists',
  'Tuples',
  'Sets',
  'Dictionaries',
  'Conditionals',
  'Loops',
  'Functions',
  'Modules',
  'List Comprehension',
  'Higher Order Functions',
  'Python Type Errors',
  'Python Date time',
  'Exception Handling',
  'Regular Expressions',
  'File Handling',
  'Python Package Manager',
  'Classes and Objects',
  'Web Scraping',
  'Virtual Environment',
  'Statistics',
  'Pandas',
  'Python web',
  'Python with MongoDB',
  'API',
  'Building API',
  'Conclusions',
]

export default function DayPage() {
  const router = useRouter()
  const params = useParams()
  const dayNumber = parseInt(params.id as string)

  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showCompleteButton, setShowCompleteButton] = useState(false)
  const [streak, setStreak] = useState<UserStreak | null>(null)
  const [completing, setCompleting] = useState(false)

  useEffect(() => {
    checkUser()
  }, [dayNumber])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      router.push('/auth')
      return
    }

    setUserId(session.user.id)
    await loadDayData(session.user.id)
    setLoading(false)
  }

  const loadDayData = async (userId: string) => {
    // Check if day is completed
    const { data: progressData } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('day_number', dayNumber)
      .single()

    if (progressData?.completed) {
      setIsCompleted(true)
    }

    // Update last_accessed
    if (progressData) {
      await supabase
        .from('user_progress')
        .update({ last_accessed: new Date().toISOString() })
        .eq('id', progressData.id)
    } else {
      await supabase
        .from('user_progress')
        .insert({
          user_id: userId,
          day_number: dayNumber,
          completed: false,
          last_accessed: new Date().toISOString()
        })
    }

    // Load streak
    const { data: streakData } = await supabase
      .from('user_streaks')
      .select('*')
      .eq('user_id', userId)
      .single()

    setStreak(streakData)
    
    // Show complete button after 3 seconds
    setTimeout(() => setShowCompleteButton(true), 3000)
  }

  const handleComplete = async () => {
    if (!userId || isCompleted || completing) return

    setCompleting(true)

    try {
      // Mark day as complete
      await supabase
        .from('user_progress')
        .update({ 
          completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('day_number', dayNumber)

      // Update streak
      if (streak) {
        const shouldReset = shouldResetStreak(streak.last_activity_date)
        const newStreak = shouldReset ? 1 : streak.current_streak + 1
        const newLongest = Math.max(newStreak, streak.longest_streak)

        await supabase
          .from('user_streaks')
          .update({
            current_streak: newStreak,
            longest_streak: newLongest,
            last_activity_date: new Date().toISOString()
          })
          .eq('user_id', userId)

        setStreak({
          ...streak,
          current_streak: newStreak,
          longest_streak: newLongest,
          last_activity_date: new Date().toISOString()
        })
      }

      setIsCompleted(true)

      // Show success message
      alert(`🎉 Day ${dayNumber} completed! ${streak && !shouldResetStreak(streak.last_activity_date) ? `Streak: ${(streak.current_streak + 1)} days!` : 'Keep going!'}`)

      // Navigate to next day or dashboard
      if (dayNumber < 30) {
        router.push(`/day/${dayNumber + 1}`)
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error completing day:', error)
      alert('Failed to mark as complete. Please try again.')
    } finally {
      setCompleting(false)
    }
  }

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
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80">
              <span className="text-2xl">🐍</span>
              <span className="font-bold text-blue-600">30 Days Of Python</span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="font-semibold">🔥 Streak:</span> {streak?.current_streak || 0}
              </div>
              {!isCompleted && showCompleteButton && (
                <button
                  onClick={handleComplete}
                  disabled={completing}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {completing ? 'Completing...' : '✓ Mark Complete'}
                </button>
              )}
              {isCompleted && (
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  ✓ Completed
                </div>
              )}
              <Link href="/dashboard" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Content - Full width iframe */}
      <iframe 
        src={`/content/day-${dayNumber}.html`}
        className="w-full border-0"
        style={{ height: 'calc(100vh - 73px)' }}
        title={`Day ${dayNumber} - ${dayTopics[dayNumber - 1]}`}
      />
    </div>
  )
}
