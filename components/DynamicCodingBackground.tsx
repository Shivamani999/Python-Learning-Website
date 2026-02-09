'use client'

import { useEffect, useState } from 'react'

interface CodeElement {
  id: string
  content: string
  type: 'line' | 'block'
  left: number
  duration: number
  delay: number
}

const codeSnippets = [
  'print("Hello World")',
  'def hello(): pass',
  'x = [1, 2, 3]',
  'for i in range(10):',
  'if True: return',
  'class Python: pass',
  'import sys',
  'lambda x: x * 2',
  'data = {"key": "value"}',
  'list.append(item)',
  'str.split(",")',
  'dict.get("key")',
  'try: except:',
  'with open("file"):',
  'async def func():',
  'await task()',
  '@decorator',
  'yield value',
  'tuple = (1, 2)',
  'set = {1, 2, 3}',
]

const codeBlocks = [
  'def fibonacci(n):\n  return n',
  'for loop in range(5):\n  print(loop)',
  'try:\n  code()\nexcept:',
  'class MyClass:\n  def __init__(self):',
  'with open("file") as f:\n  f.read()',
]

export function DynamicCodingBackground() {
  const [elements, setElements] = useState<CodeElement[]>([])

  useEffect(() => {
    const generateElements = () => {
      const newElements: CodeElement[] = []

      // Generate falling code lines
      for (let i = 0; i < 8; i++) {
        const snippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)]
        const duration = 8 + Math.random() * 6
        newElements.push({
          id: `line-${i}`,
          content: snippet,
          type: 'line',
          left: Math.random() * 100,
          duration,
          delay: Math.random() * 3,
        })
      }

      // Generate floating code blocks
      for (let i = 0; i < 4; i++) {
        const block = codeBlocks[Math.floor(Math.random() * codeBlocks.length)]
        newElements.push({
          id: `block-${i}`,
          content: block,
          type: 'block',
          left: Math.random() * 80 + 10,
          duration: 10 + Math.random() * 6,
          delay: Math.random() * 5,
        })
      }

      setElements(newElements)
    }

    generateElements()

    // Regenerate elements every 20 seconds for continuous effect
    const interval = setInterval(generateElements, 20000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="coding-background">
      {elements.map((el) => (
        <div
          key={el.id}
          className={el.type === 'line' ? 'code-line' : 'code-block'}
          style={{
            left: `${el.left}%`,
            animation: `${el.type === 'line' ? 'fallCode' : 'floatCode'} ${el.duration}s linear ${el.delay}s infinite`,
          }}
        >
          {el.content}
        </div>
      ))}

      {/* Animated code cursor indicators */}
      {[0, 1, 2].map((i) => (
        <div
          key={`cursor-${i}`}
          className="code-cursor pulse-glow"
          style={{
            left: `${20 + i * 30}%`,
            top: `${30 + i * 20}%`,
            animation: `blink ${1 + i * 0.2}s infinite`,
            animationDelay: `${i * 0.3}s`,
          }}
        />
      ))}
    </div>
  )
}
