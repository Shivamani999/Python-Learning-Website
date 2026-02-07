import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '30 Days of Python',
  description: 'Learn Python in 30 days',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  )
}
