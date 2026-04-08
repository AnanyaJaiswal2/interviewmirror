import { useEffect, useRef } from 'react'

export default function WaveformVisualizer({ isActive }) {
  const barsRef = useRef([])
  const animRef = useRef(null)

  useEffect(() => {
    if (isActive) {
      animate()
    } else {
      cancelAnimationFrame(animRef.current)
      // Reset all bars to flat when not recording
      barsRef.current.forEach(bar => {
        if (bar) bar.style.height = '4px'
      })
    }

    return () => cancelAnimationFrame(animRef.current)
  }, [isActive])

  const animate = () => {
    barsRef.current.forEach(bar => {
      if (bar) {
        // Random height between 4px and 28px
        const height = isActive
          ? Math.floor(Math.random() * 24) + 4
          : 4
        bar.style.height = `${height}px`
      }
    })
    animRef.current = requestAnimationFrame(() => {
      setTimeout(animate, 100)  // update 10 times per second
    })
  }

  return (
    <div className="flex items-center justify-center gap-1 h-10">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          ref={el => barsRef.current[i] = el}
          className="w-1 rounded-full transition-all duration-100"
          style={{
            height: '4px',
            background: isActive
              ? `hsl(${250 + i * 2}, 70%, 65%)`  // purple gradient
              : 'rgba(255,255,255,0.15)',
            minHeight: '4px',
          }}
        />
      ))}
    </div>
  )
}