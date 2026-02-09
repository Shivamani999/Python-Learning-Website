'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { DynamicCodingBackground } from '@/components/DynamicCodingBackground'
import { AnimatedRocketsAndAsteroids } from '@/components/AnimatedRocketsAndAsteroids'

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
      <div className="min-h-screen flex items-center justify-center magic-bg">
        <div className="text-xl text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen magic-bg relative overflow-hidden">
      {/* Dynamic coding background */}
      <DynamicCodingBackground />
      
      {/* Animated rockets and asteroids */}
      <AnimatedRocketsAndAsteroids />

      {/* Animated background sparkles */}
      <div className="sparkles" aria-hidden>
        <span style={{ left: '10%', top: '80%', animationDelay: '0s' }} />
        <span style={{ left: '30%', top: '90%', animationDelay: '1s', width: '8px', height: '8px' }} />
        <span style={{ left: '60%', top: '95%', animationDelay: '2s' }} />
        <span style={{ left: '85%', top: '100%', animationDelay: '3s', width: '7px', height: '7px' }} />
      </div>

      {/* Header */}
      <header className="glass-card sticky top-0 z-50 border-b border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-4xl animate-bounce">🐍</span>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">30 Days Of Python</h1>
          </div>
          <Link href="/auth" className="btn-magic px-8 py-3 font-bold shadow-lg">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-32 text-white perspective-container z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8 card-3d">
            <h2 className="text-7xl font-black mb-6 gradient-text">
              Learn Python in 30 Days
            </h2>
          </div>
          <p className="text-2xl mb-10 max-w-3xl mx-auto text-white/90 leading-relaxed">
            Master Python from scratch in just 30 days. <span className="text-green-300 font-bold">No experience required.</span> Interactive lessons, real coding exercises, and daily motivation.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/auth" className="btn-magic px-10 py-4 font-bold text-lg shadow-2xl hover:scale-105 transition transform">
              🚀 Start Learning Free
            </Link>
            <Link href="/auth" className="px-10 py-4 font-bold text-lg rounded-xl bg-white/10 text-white hover:bg-white/20 transition border border-white/20">
              Explore Curriculum
            </Link>
          </div>
        </div>
      </section>

      {/* Features - 3D Card Flip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-20">
        <h2 className="text-5xl font-bold text-center mb-16 text-white">Why Choose Us?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="feature-card text-center p-8 rounded-2xl float-box card-3d text-white shadow-2xl border border-white/10">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold mb-4">Structured Learning</h3>
            <p className="text-lg text-white/90">
              30 days of carefully crafted lessons, from Python basics to advanced concepts. Each day builds on the previous.
            </p>
          </div>
          <div className="feature-card text-center p-8 rounded-2xl float-box card-3d text-white shadow-2xl border border-white/10" style={{animationDelay: '0.2s'}}>
            <div className="text-6xl mb-4">🔥</div>
            <h3 className="text-2xl font-bold mb-4">Build Your Streak</h3>
            <p className="text-lg text-white/90">
              Track daily progress and maintain your streak. Watch your consistency grow and celebrate milestones daily.
            </p>
          </div>
          <div className="feature-card text-center p-8 rounded-2xl float-box card-3d text-white shadow-2xl border border-white/10" style={{animationDelay: '0.4s'}}>
            <div className="text-6xl mb-4">💻</div>
            <h3 className="text-2xl font-bold mb-4">Hands-On Exercises</h3>
            <p className="text-lg text-white/90">
              5 interactive exercises per day using Pyodide real Python runtime. Practice coding directly in your browser.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 glass-card mx-4 rounded-3xl my-20 border border-white/10 relative z-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="float-anim">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">30</div>
              <p className="text-white/70 mt-2 text-lg">Days of Learning</p>
            </div>
            <div className="float-anim" style={{animationDelay: '0.2s'}}>
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">150+</div>
              <p className="text-white/70 mt-2 text-lg">Coding Exercises</p>
            </div>
            <div className="float-anim" style={{animationDelay: '0.4s'}}>
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">100%</div>
              <p className="text-white/70 mt-2 text-lg">Free Forever</p>
            </div>
            <div className="float-anim" style={{animationDelay: '0.6s'}}>
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">∞</div>
              <p className="text-white/70 mt-2 text-lg">Community Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Preview - 3D Grid */}
      <section className="py-20 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-bold text-center mb-16 text-white">30-Day Curriculum</h2>
          <div className="glass-card rounded-2xl p-8 border border-white/10">
            <div className="grid md:grid-cols-3 gap-4">
              {curriculum.map((item, idx) => (
                <div key={item.day} className="tilt-card group p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 hover:from-blue-500/40 hover:to-purple-500/40 border border-white/10 transition transform hover:scale-105 cursor-pointer" style={{animationDelay: `${idx * 0.05}s`}}>
                  <span className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">Day {item.day}</span>
                  <p className="text-white/80 group-hover:text-white transition text-sm mt-2">{item.topic}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center relative z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-6xl font-extrabold mb-6 gradient-text">Ready to Level Up?</h2>
          <p className="text-2xl mb-10 text-white/80">
            Join thousands of learners transforming their coding skills in just 30 days
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/auth" className="btn-magic px-12 py-4 font-bold text-lg shadow-2xl hover:scale-105 transition">
              ✨ Create Free Account
            </Link>
            <Link href="/auth" className="px-12 py-4 font-bold text-lg rounded-xl bg-white/10 text-white hover:bg-white/20 transition border border-white/20">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/30 text-white/70 py-12 border-t border-white/10 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="mb-4">© 2026 30 Days Of Python. Learn, Build, Master. 🐍</p>
          <p className="text-sm text-white/50">Made with ❤️ for aspiring Python developers worldwide</p>
          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="text-sm text-white/60">Follow for more:</span>
            <a href="https://www.instagram.com/automationwithclarity" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white/70 hover:text-pink-400 transition font-semibold">
              📱 Automation With Clarity
            </a>
          </div>
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
