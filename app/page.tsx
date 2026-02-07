'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/dashboard')
      } else {
        setLoading(false)
      }
    })
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-3xl mr-3">🐍</span>
            <h1 className="text-2xl font-bold text-blue-600">30 Days Of Python</h1>
          </div>
          <Link href="/auth" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h2 className="text-5xl font-bold mb-6">
            Learn Python in 30 Days
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            A complete beginner-friendly programming course. No prior coding experience required.
            Start your journey to becoming a Python developer today.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth" className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg text-lg transition-colors">
              Start Learning Free
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-bold mb-2">Structured Learning</h3>
            <p className="text-gray-600">
              30 days of carefully crafted lessons, from basics to advanced topics
            </p>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-4">🔥</div>
            <h3 className="text-xl font-bold mb-2">Track Your Streak</h3>
            <p className="text-gray-600">
              Build consistency with daily progress tracking and streak counters
            </p>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-4">💻</div>
            <h3 className="text-xl font-bold mb-2">Hands-on Exercises</h3>
            <p className="text-gray-600">
              Practice with real coding exercises and projects every day
            </p>
          </div>
        </div>
      </section>

      {/* Curriculum Preview */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">30-Day Curriculum</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid md:grid-cols-2 gap-4">
              {curriculum.map((item) => (
                <div key={item.day} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
                  <span className="font-bold text-blue-600 min-w-[60px]">Day {item.day}</span>
                  <span className="text-gray-700">{item.topic}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Python Journey?</h2>
          <p className="text-xl mb-8">
            Join thousands of learners and become a Python developer in just 30 days
          </p>
          <Link href="/auth" className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg text-lg transition-colors inline-block">
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© 2026 30 Days Of Python. Free for everyone.</p>
        </div>
      </footer>
    </div>
  )
}

const curriculum = [
  { day: 1, topic: 'Introduction' },
  { day: 2, topic: 'Variables, Built-in Functions' },
  { day: 3, topic: 'Operators' },
  { day: 4, topic: 'Strings' },
  { day: 5, topic: 'Lists' },
  { day: 6, topic: 'Tuples' },
  { day: 7, topic: 'Sets' },
  { day: 8, topic: 'Dictionaries' },
  { day: 9, topic: 'Conditionals' },
  { day: 10, topic: 'Loops' },
  { day: 11, topic: 'Functions' },
  { day: 12, topic: 'Modules' },
  { day: 13, topic: 'List Comprehension' },
  { day: 14, topic: 'Higher Order Functions' },
  { day: 15, topic: 'Python Type Errors' },
  { day: 16, topic: 'Python Date time' },
  { day: 17, topic: 'Exception Handling' },
  { day: 18, topic: 'Regular Expressions' },
  { day: 19, topic: 'File Handling' },
  { day: 20, topic: 'Python Package Manager' },
  { day: 21, topic: 'Classes and Objects' },
  { day: 22, topic: 'Web Scraping' },
  { day: 23, topic: 'Virtual Environment' },
  { day: 24, topic: 'Statistics' },
  { day: 25, topic: 'Pandas' },
  { day: 26, topic: 'Python web' },
  { day: 27, topic: 'Python with MongoDB' },
  { day: 28, topic: 'API' },
  { day: 29, topic: 'Building API' },
  { day: 30, topic: 'Conclusions' },
]
