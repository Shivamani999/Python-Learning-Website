'use client'

import { useEffect, useState } from 'react'

interface Rocket {
  id: string
  left: number
  top: number
  duration: number
  delay: number
}

interface CodingSymbol {
  id: string
  left: number
  top: number
  symbol: string
  duration: number
  delay: number
  fontSize: number
}

const codingSymbols = ['<>', '{}', '[]', '//', '=>', '<<', '>>', '++', '--', '#', '$', '@', '&&', '||', '===', '!=']

export function AnimatedRocketsAndAsteroids() {
  const [rockets, setRockets] = useState<Rocket[]>([])
  const [symbols, setSymbols] = useState<CodingSymbol[]>([])

  useEffect(() => {
    const generateElements = () => {
      const newRockets: Rocket[] = []
      for (let i = 0; i < 3; i++) {
        newRockets.push({
          id: `rocket-${i}`,
          left: Math.random() * 90 + 5,
          top: Math.random() * 80,
          duration: 12 + Math.random() * 8,
          delay: Math.random() * 5,
        })
      }

      const newSymbols: CodingSymbol[] = []
      for (let i = 0; i < 6; i++) {
        const symbolsArray = ['<>', '{}', '[]', '//', '=>', '<<', '>>', '++', '--', '#', '$', '@', '&&', '||', '===', '!=']
        newSymbols.push({
          id: `symbol-${i}`,
          left: Math.random() * 100,
          top: Math.random() * 100,
          symbol: symbolsArray[Math.floor(Math.random() * symbolsArray.length)],
          duration: 18 + Math.random() * 12,
          delay: Math.random() * 8,
          fontSize: 28 + Math.random() * 16,
        })
      }

      setRockets(newRockets)
      setSymbols(newSymbols)
    }

    generateElements()
    const interval = setInterval(generateElements, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <style>{`
        @keyframes rocketMove {
          0% { transform: translateX(-100px) translateY(120vh) rotate(-45deg); opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { transform: translateX(150vw) translateY(-100vh) rotate(-45deg); opacity: 0; }
        }
        @keyframes rocketFlame {
          0% { transform: scaleY(1); opacity: 0.6; }
          50% { transform: scaleY(1.2); opacity: 0.9; }
          100% { transform: scaleY(0.9); opacity: 0.6; }
        }
        @keyframes symbolOrbit {
          0% { transform: translateX(0) translateY(0) rotate(0deg); }
          25% { transform: translateX(50px) translateY(-40px) rotate(90deg); }
          50% { transform: translateX(0) translateY(-80px) rotate(180deg); }
          75% { transform: translateX(-50px) translateY(-40px) rotate(270deg); }
          100% { transform: translateX(0) translateY(0) rotate(360deg); }
        }
        .rocket-element {
          position: fixed;
          width: 60px;
          height: 60px;
          pointer-events: none;
          z-index: 5;
          font-size: 52px;
          filter: drop-shadow(0 0 20px rgba(255, 120, 0, 1)) drop-shadow(0 0 40px rgba(255, 100, 0, 0.6));
        }
        .rocket-element::before {
          content: '';
          position: absolute;
          width: 80px;
          height: 80px;
          background: radial-gradient(circle at 40% 40%, rgba(255, 200, 100, 0.8), rgba(255, 100, 0, 0.4), transparent);
          border-radius: 50%;
          left: -10px;
          top: -10px;
          filter: blur(3px);
          animation: rocketFlame 0.4s ease-in-out infinite;
          z-index: -1;
        }
        .rocket-element::after {
          content: '';
          position: absolute;
          width: 100px;
          height: 100px;
          background: radial-gradient(circle, rgba(255, 150, 50, 0.3), transparent);
          border-radius: 50%;
          left: -20px;
          top: -20px;
          filter: blur(8px);
          z-index: -1;
        }
        .symbol-element {
          position: fixed;
          pointer-events: none;
          z-index: 4;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Courier New', monospace;
          font-weight: bold;
          color: rgba(123, 245, 200, 0.8);
          text-shadow: 0 0 10px rgba(123, 245, 200, 0.6), 0 0 20px rgba(42, 245, 152, 0.3);
          filter: drop-shadow(0 0 8px rgba(123, 245, 200, 0.5));
          animation: symbolOrbit ease-in-out infinite;
        }
      `}</style>

      {rockets.map((rocket) => (
        <div
          key={rocket.id}
          className="rocket-element"
          style={{
            left: `${rocket.left}%`,
            animation: `rocketMove ${rocket.duration}s linear ${rocket.delay}s infinite`,
          }}
        >
          🚀
        </div>
      ))}

      {symbols.map((sym) => (
        <div
          key={sym.id}
          className="symbol-element"
          style={{
            left: `${sym.left}%`,
            top: `${sym.top}%`,
            fontSize: `${sym.fontSize}px`,
            animation: `symbolOrbit ${sym.duration}s linear ${sym.delay}s infinite`,
          }}
        >
          {sym.symbol}
        </div>
      ))}
    </>
  )
}
