'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { UserProgress, UserStreak } from '@/lib/types'
import { shouldResetStreak } from '@/lib/streak'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
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
  const [content, setContent] = useState('')
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
    // Load day content
    try {
      const response = await fetch(`/content/day-${dayNumber}.md`)
      const text = await response.text()
      setContent(text)
    } catch (error) {
      setContent('# Content not found\n\nThis day\'s content is not yet available.')
    }

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
  }

  const handleScroll = () => {
    const scrolled = window.scrollY
    const docHeight = document.documentElement.scrollHeight
    const windowHeight = window.innerHeight
    
    // Show complete button when scrolled 70% of the page
    if (scrolled + windowHeight > docHeight * 0.7) {
      setShowCompleteButton(true)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleComplete = async () => {
    if (!userId || isCompleted || completing) return

    setCompleting(true)

    try {
      // Mark day as complete
      const { data: progressData } = await supabase
        .from('user_progress')
        .update({ 
          completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('day_number', dayNumber)
        .select()
        .single()

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
              <Link href="/dashboard" className="btn-secondary text-sm py-1 px-4">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-bold mb-4">All Days</h3>
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {dayTopics.map((topic, index) => {
                    const day = index + 1
                    return (
                      <Link
                        key={day}
                        href={`/day/${day}`}
                        className={`
                          block p-2 rounded text-sm hover:bg-gray-100
                          ${day === dayNumber ? 'bg-blue-600 text-white hover:bg-blue-600' : ''}
                        `}
                      >
                        <div className="font-semibold">Day {day}</div>
                        <div className={`text-xs ${day === dayNumber ? 'text-white' : 'text-gray-500'}`}>
                          {topic}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="card mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    Day {dayNumber}: {dayTopics[dayNumber - 1]}
                  </h1>
                  {isCompleted && (
                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      ✓ Completed
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-3xl font-bold mb-4 mt-8 text-gray-900" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-2xl font-bold mb-3 mt-6 text-gray-900" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-xl font-semibold mb-2 mt-4 text-gray-900" {...props} />,
                    h4: ({node, ...props}) => <h4 className="text-lg font-semibold mb-2 mt-3 text-gray-900" {...props} />,
                    p: ({node, ...props}) => <p className="mb-4 leading-relaxed text-gray-700" {...props} />,
                    code: ({node, inline, ...props}: any) => inline ? 
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-red-600" {...props} /> :
                      <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4 font-mono text-sm" {...props} />,
                    pre: ({node, ...props}) => <pre className="mb-4" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 ml-6 space-y-2" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 ml-6 space-y-2" {...props} />,
                    li: ({node, ...props}) => <li className="text-gray-700" {...props} />,
                    a: ({node, ...props}) => <a className="text-blue-600 hover:underline" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-blue-600 pl-4 italic my-4 text-gray-600" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />,
                    table: ({node, ...props}) => <table className="w-full border-collapse mb-4" {...props} />,
                    th: ({node, ...props}) => <th className="bg-gray-100 border border-gray-300 px-4 py-2 text-left font-semibold" {...props} />,
                    td: ({node, ...props}) => <td className="border border-gray-300 px-4 py-2" {...props} />,
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center card">
              {dayNumber > 1 ? (
                <Link href={`/day/${dayNumber - 1}`} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-colors">
                  ← Previous Day
                </Link>
              ) : (
                <div />
              )}

              {!isCompleted && showCompleteButton && (
                <button
                  onClick={handleComplete}
                  disabled={completing}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {completing ? 'Completing...' : '✓ Mark as Complete'}
                </button>
              )}

              {dayNumber < 30 ? (
                <Link href={`/day/${dayNumber + 1}`} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-colors">
                  Next Day →
                </Link>
              ) : (
                <Link href="/dashboard" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-colors">
                  Back to Dashboard
                </Link>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
