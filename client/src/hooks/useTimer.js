import { useState, useEffect, useRef } from 'react'

export function useTimer() {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef(null)
  // useRef stores the interval ID without causing re-renders

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => s + 1)   // s => s + 1 is safer than seconds + 1
        // because it always uses the latest value, not a stale closure
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }

    return () => clearInterval(intervalRef.current)
    // cleanup on unmount or when isRunning changes
  }, [isRunning])

  // Format seconds into MM:SS string
  const formatted = () => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0')
    const s = String(seconds % 60).padStart(2, '0')
    return `${m}:${s}`
  }

  const start  = () => setIsRunning(true)
  const pause  = () => setIsRunning(false)
  const reset  = () => { setIsRunning(false); setSeconds(0) }

  return { seconds, formatted, isRunning, start, pause, reset }
}