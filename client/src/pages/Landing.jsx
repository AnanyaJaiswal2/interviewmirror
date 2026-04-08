import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-sm font-bold">
            IM
          </div>
          <span className="font-semibold text-lg">InterviewMirror</span>
        </div>
        <button
          onClick={() => navigate('/auth')}
          className="bg-violet-600 hover:bg-violet-500 transition px-5 py-2 rounded-lg text-sm font-medium"
        >
          Get Started
        </button>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-400 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            AI-Powered • Real-Time Feedback • Behavioral Analysis
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Interview smarter,<br />
            <span className="text-violet-400">not just harder</span>
          </h1>

          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">
            Practice with an AI that watches your face, listens to your words,
            and coaches you in real time — just like a senior interviewer would.
          </p>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/auth')}
              className="bg-violet-600 hover:bg-violet-500 transition px-8 py-3 rounded-xl font-semibold"
            >
              Start Free Practice
            </button>
            <button
  onClick={() => navigate('/how-it-works')}
  className="border border-white/20 hover:border-white/40 transition
             px-8 py-3 rounded-xl font-semibold text-gray-300"
>
  See How It Works
</button>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex gap-12 mt-20 text-center"
        >
          {[
            { value: '94%', label: 'Confidence improvement' },
            { value: '3×', label: 'Better answer structure' },
            { value: 'Real-time', label: 'Behavioral coaching' },
          ].map(stat => (
            <div key={stat.label}>
              <div className="text-2xl font-bold text-violet-400">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  )
}