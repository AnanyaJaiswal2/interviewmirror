import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { sessionService } from '../services/api'

export default function SessionDetail() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeQ, setActiveQ] = useState(0)

  useEffect(() => {
    loadSession()
  }, [])

  const loadSession = async () => {
    try {
      const res = await sessionService.getOne(id)
      setSession(res.data)
    } catch (err) {
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500
                        border-t-transparent rounded-full animate-spin"/>
      </div>
    )
  }

  if (!session) return null

  const answered = session.questions?.filter(q => q.answer?.transcript) || []

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Header */}
      <div className="border-b border-white/10 px-8 py-5">
        <div className="max-w-4xl mx-auto flex items-center
                        justify-between">
          <div>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-400 hover:text-white text-sm
                         transition mb-2 flex items-center gap-1"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-xl font-bold">{session.jobRole}</h1>
            <p className="text-gray-400 text-sm">
              {new Date(session.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric'
              })} · {session.difficulty} · {answered.length} answers
            </p>
          </div>

          {session.summary && (
            <div className="text-center">
              <div className="text-4xl font-bold text-violet-400">
                {session.summary.overall_score}
              </div>
              <div className="text-gray-500 text-sm">/100 overall</div>
            </div>
          )}
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-8 py-8">

        {/* Summary scores */}
        {session.summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              { label: 'Overall',       val: session.summary.overall_score       },
              { label: 'Confidence',    val: session.summary.confidence_score    },
              { label: 'Communication', val: session.summary.communication_score },
              { label: 'Content',       val: session.summary.content_score       },
            ].map(m => (
              <div key={m.label}
                className="bg-gray-900 border border-white/10
                           rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">
                  {m.val || 0}
                </div>
                <div className="text-xs text-gray-500 mt-1">{m.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Question replay */}
        <div className="bg-gray-900 border border-white/10 rounded-2xl
                        overflow-hidden">
          <div className="border-b border-white/10 p-4">
            <h2 className="font-semibold">Interview Replay</h2>
            <p className="text-gray-400 text-sm mt-1">
              Click each question to review your answer and scores
            </p>
          </div>

          {/* Question list */}
          <div className="divide-y divide-white/5">
            {session.questions?.map((q, i) => (
              <div key={q.id}>
                {/* Question header */}
                <button
                  onClick={() => setActiveQ(activeQ === i ? -1 : i)}
                  className="w-full text-left p-5 hover:bg-white/5
                             transition flex items-start gap-4"
                >
                  <div className="w-7 h-7 rounded-full bg-violet-600/20
                                  border border-violet-500/30 flex items-center
                                  justify-center text-xs text-violet-400
                                  flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white leading-relaxed">
                      {q.text}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-violet-500/70
                                       bg-violet-500/10 px-2 py-0.5
                                       rounded-full">
                        {q.type}
                      </span>
                      {q.answer?.scores ? (
                        <span className="text-xs text-gray-500">
                          Score:{' '}
                          <span className="text-violet-400 font-medium">
                            {Math.round(
                              Object.values(q.answer.scores)
                                .reduce((sum, s) => sum + (s.score || 0), 0) /
                              Object.values(q.answer.scores).length * 10
                            )}/100
                          </span>
                        </span>
                      ) : (
                        <span className="text-xs text-gray-600">
                          Not answered
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-gray-600 text-sm flex-shrink-0">
                    {activeQ === i ? '▲' : '▼'}
                  </div>
                </button>

                {/* Expanded answer detail */}
                {activeQ === i && q.answer && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="px-5 pb-5 ml-11"
                  >
                    {/* Transcript */}
                    {q.answer.transcript && (
                      <div className="bg-white/5 rounded-xl p-4 mb-4">
                        <div className="text-xs font-medium text-white/40
                                        tracking-wider mb-2">
                          YOUR ANSWER
                        </div>
                        <p className="text-white/70 text-sm leading-relaxed">
                          {q.answer.transcript}
                        </p>
                      </div>
                    )}

                    {/* Scores */}
                    {q.answer.scores && (
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {Object.entries(q.answer.scores).map(([key, val]) => (
                          <div key={key}
                            className="bg-white/5 rounded-lg p-3">
                            <div className="flex justify-between
                                            items-center mb-1">
                              <span className="text-xs text-white/50
                                               capitalize">{key}</span>
                              <span className="text-xs font-bold
                                               text-violet-400">
                                {val.score}/10
                              </span>
                            </div>
                            <div className="h-1 bg-white/10 rounded-full
                                            overflow-hidden mb-1">
                              <div
                                className="h-full bg-violet-500 rounded-full"
                                style={{ width: `${val.score * 10}%` }}
                              />
                            </div>
                            <p className="text-white/30 text-xs leading-relaxed">
                              {val.feedback}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Coaching tip */}
                    {q.answer.overall_tip && (
                      <div className="bg-emerald-500/10 border
                                      border-emerald-500/20 rounded-lg p-3">
                        <div className="text-xs font-medium text-emerald-400
                                        mb-1 tracking-wider">
                          COACHING TIP
                        </div>
                        <p className="text-white/60 text-xs leading-relaxed">
                          {q.answer.overall_tip}
                        </p>
                      </div>
                    )}

                    {/* Behavior data */}
                    {q.answer.behavior && (
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        {[
                          {
                            label: 'Eye contact',
                            val: `${q.answer.behavior.eye_contact_pct || 0}%`
                          },
                          {
                            label: 'Filler words',
                            val: q.answer.behavior.hesitation_count || 0
                          },
                          {
                            label: 'Pace (wpm)',
                            val: q.answer.behavior.speaking_pace_wpm || 0
                          },
                        ].map(b => (
                          <div key={b.label}
                            className="bg-white/5 rounded-lg p-2 text-center">
                            <div className="text-sm font-bold text-white">
                              {b.val}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {b.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}