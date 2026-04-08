import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { sessionService } from '../services/api'
import StatsCard from '../components/StatsCard'
import SessionCard from '../components/SessionCard'
import PerformanceChart from '../components/PerformanceChart'

const QUICK_ROLES = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Scientist',
  'DevOps Engineer',
  'Product Manager',
  'Mobile Developer',
  'ML Engineer',
  'System Design',
  'Cybersecurity Engineer',
  'React Native Developer',
]

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate         = useNavigate()

  // ── State ──
  const [sessions, setSessions]     = useState([])
  const [stats, setStats]           = useState(null)
  const [loading, setLoading]       = useState(true)
  const [starting, setStarting]     = useState(false)
  const [activeTab, setActiveTab]   = useState('overview')

  // ── Interview Config ──
  const [jobRole, setJobRole]       = useState('Software Engineer')
  const [customRole, setCustomRole] = useState('')
  const [useCustom, setUseCustom]   = useState(false)
  const [difficulty, setDifficulty] = useState('medium')

  const finalRole = useCustom && customRole.trim().length > 0
    ? customRole.trim()
    : jobRole

  // ── Load Dashboard ──
  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const [sessionsRes, statsRes] = await Promise.all([
        sessionService.getAll(),
        sessionService.getStats(),
      ])
      setSessions(sessionsRes.data)
      setStats(statsRes.data)
    } catch (err) {
      console.error('Dashboard load error:', err)
    } finally {
      setLoading(false)
    }
  }

  // ── Start Interview ──
  const startInterview = async () => {
    if (!finalRole.trim()) return
    setStarting(true)
    try {
      const res = await sessionService.create({
        jobRole:    finalRole,
        difficulty,
      })
      navigate(`/interview/${res.data.sessionId}`)
    } catch (err) {
      console.error('Start interview error:', err)
      setStarting(false)
    }
  }

  // ────────────────────────────────────────
  // RENDER
  // ────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ── Navbar ── */}
      <nav className="flex justify-between items-center px-8 py-5
                      border-b border-white/10 sticky top-0
                      bg-gray-950/90 backdrop-blur-sm z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-violet-600 flex items-center
                          justify-center text-xs font-bold">
            IM
          </div>
          <span className="font-semibold">InterviewMirror</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">
            Hey, {user?.name}
          </span>
          <button
            onClick={logout}
            className="text-sm text-gray-500 hover:text-white transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-violet-500
                              border-t-transparent rounded-full
                              animate-spin mx-auto mb-4"/>
              <p className="text-gray-500 text-sm">Loading your dashboard...</p>
            </div>
          </div>
        ) : (
          <>
            {/* ── Header ── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold mb-1">
                {stats?.totalSessions === 0
                  ? 'Ready to start practicing?'
                  : `Welcome back, ${user?.name?.split(' ')[0]}`}
              </h1>
              <p className="text-gray-400 text-sm">
                {stats?.totalSessions === 0
                  ? 'Complete your first AI mock interview below. 10 questions, real-time feedback.'
                  : `You have completed ${stats.totalSessions} interview session${stats.totalSessions > 1 ? 's' : ''}. Keep going.`}
              </p>
            </motion.div>

            {/* ── Stats Cards ── */}
            {stats?.totalSessions > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
              >
                <StatsCard
                  label="Average Score"
                  value={stats.averageScore}
                  suffix="/100"
                  color="violet"
                />
                <StatsCard
                  label="Best Score"
                  value={stats.bestScore}
                  suffix="/100"
                  color="emerald"
                />
                <StatsCard
                  label="Total Sessions"
                  value={stats.totalSessions}
                  color="blue"
                />
                <StatsCard
                  label="Improvement"
                  value={stats.improvement >= 0
                    ? `+${stats.improvement}`
                    : stats.improvement}
                  suffix=" pts"
                  change={stats.improvement}
                  color="amber"
                />
              </motion.div>
            )}

            {/* ── Tabs ── */}
            <div className="flex gap-1 bg-gray-900 rounded-xl p-1
                            mb-6 w-fit">
              {['overview', 'history', 'analytics'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium
                    transition capitalize
                    ${activeTab === tab
                      ? 'bg-violet-600 text-white'
                      : 'text-gray-400 hover:text-white'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* ────────────────────────────────────────
                OVERVIEW TAB
            ──────────────────────────────────────── */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* ── Start Interview Card ── */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gray-900 border border-white/10
                             rounded-2xl p-6"
                >
                  <h2 className="text-lg font-semibold mb-1">
                    New Interview Session
                  </h2>
                  <p className="text-gray-400 text-sm mb-6">
                    AI generates 10 role-specific questions.
                    Each session is unique.
                  </p>

                  {/* Job Role Section */}
                  <div className="mb-5">
                    <label className="block text-sm text-gray-400 mb-3">
                      Job Role
                    </label>

                    {/* Quick select chips */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {QUICK_ROLES.map(role => (
                        <button
                          key={role}
                          onClick={() => {
                            setJobRole(role)
                            setUseCustom(false)
                            setCustomRole('')
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs
                            font-medium transition border
                            ${!useCustom && jobRole === role
                              ? 'bg-violet-600 border-violet-600 text-white'
                              : 'bg-gray-800 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                            }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>

                    {/* Custom role input */}
                    <input
                      type="text"
                      placeholder="Or type any role — iOS Developer, ML Engineer, SRE..."
                      value={customRole}
                      onChange={e => {
                        setCustomRole(e.target.value)
                        setUseCustom(e.target.value.length > 0)
                      }}
                      className="w-full bg-gray-800 border border-white/10
                                 rounded-xl px-4 py-2.5 text-white text-sm
                                 placeholder-gray-600 focus:outline-none
                                 focus:border-violet-500 transition"
                    />

                    {/* Detected role feedback */}
                    <AnimatePresence>
                      {useCustom && customRole.trim().length > 2 && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-xs text-violet-400 mt-2"
                        >
                          Questions will be tailored for: {customRole}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Difficulty */}
                  <div className="mb-6">
                    <label className="block text-sm text-gray-400 mb-2">
                      Difficulty
                    </label>
                    <div className="flex gap-2">
                      {[
                        { value: 'easy',   label: 'Easy',   desc: 'Fundamentals'    },
                        { value: 'medium', label: 'Medium', desc: 'Standard'        },
                        { value: 'hard',   label: 'Hard',   desc: 'Senior level'    },
                      ].map(d => (
                        <button
                          key={d.value}
                          onClick={() => setDifficulty(d.value)}
                          className={`flex-1 py-2.5 rounded-xl text-sm
                            font-medium transition text-center
                            ${difficulty === d.value
                              ? 'bg-violet-600 text-white'
                              : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                        >
                          <div>{d.label}</div>
                          <div className={`text-xs mt-0.5
                            ${difficulty === d.value
                              ? 'text-violet-200'
                              : 'text-gray-600'}`}>
                            {d.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Session info */}
                  <div className="flex items-center gap-4 mb-4
                                  text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full
                                       bg-violet-400"/>
                      10 questions
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full
                                       bg-emerald-400"/>
                      Live AI feedback
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full
                                       bg-amber-400"/>
                      Behavioral analysis
                    </div>
                  </div>

                  {/* Start button */}
                  <button
                    onClick={startInterview}
                    disabled={starting || !finalRole.trim()}
                    className="w-full bg-violet-600 hover:bg-violet-500
                               disabled:opacity-50 disabled:cursor-not-allowed
                               transition py-3 rounded-xl font-semibold
                               text-sm flex items-center justify-center gap-2"
                  >
                    {starting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30
                                        border-t-white rounded-full
                                        animate-spin"/>
                        Generating questions...
                      </>
                    ) : (
                      `Start Interview — ${finalRole}`
                    )}
                  </button>
                </motion.div>

                {/* ── Recent Sessions ── */}
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gray-900 border border-white/10
                             rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">
                      Recent Sessions
                    </h2>
                    {sessions.length > 3 && (
                      <button
                        onClick={() => setActiveTab('history')}
                        className="text-xs text-violet-400
                                   hover:text-violet-300 transition"
                      >
                        View all →
                      </button>
                    )}
                  </div>

                  {sessions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center
                                    py-12 text-center">
                      <div className="w-12 h-12 rounded-full bg-white/5
                                      flex items-center justify-center
                                      text-2xl mb-3">
                        🎯
                      </div>
                      <p className="text-gray-400 text-sm mb-1">
                        No sessions yet
                      </p>
                      <p className="text-gray-600 text-xs">
                        Start your first interview to see history here
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {sessions.slice(0, 4).map((s, i) => (
                        <motion.div
                          key={s._id}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          onClick={() => navigate(`/session/${s._id}`)}
                          className="flex items-center justify-between
                                     p-3 rounded-xl bg-gray-800/50
                                     hover:bg-gray-800 cursor-pointer
                                     transition border border-white/5
                                     hover:border-white/10"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-white
                                            truncate">
                              {s.jobRole}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {new Date(s.createdAt).toLocaleDateString(
                                'en-IN', {
                                  day:   'numeric',
                                  month: 'short',
                                  year:  'numeric'
                                }
                              )}
                              {' · '}
                              <span className="capitalize">{s.difficulty}</span>
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0 ml-3">
                            {s.status === 'completed' ? (
                              <>
                                <div className="text-lg font-bold
                                                text-violet-400">
                                  {s.summary?.overall_score || 0}
                                </div>
                                <div className="text-xs text-gray-500">
                                  /100
                                </div>
                              </>
                            ) : (
                              <div className="text-xs text-yellow-400
                                              bg-yellow-500/10 border
                                              border-yellow-500/20 px-2
                                              py-1 rounded-lg">
                                Incomplete
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>
            )}

            {/* ────────────────────────────────────────
                HISTORY TAB
            ──────────────────────────────────────── */}
            {activeTab === 'history' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-lg font-semibold">
                      All Sessions
                    </h2>
                    <p className="text-gray-500 text-sm">
                      {sessions.length} session{sessions.length !== 1 ? 's' : ''} total
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('overview')}
                    disabled={starting}
                    className="bg-violet-600 hover:bg-violet-500
                               disabled:opacity-50 transition px-4 py-2
                               rounded-lg text-sm font-medium"
                  >
                    New Session
                  </button>
                </div>

                {sessions.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="text-4xl mb-4">🎯</div>
                    <p className="text-gray-400 mb-2">No sessions yet</p>
                    <p className="text-gray-600 text-sm">
                      Start your first interview to build your history
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {sessions.map((s, i) => (
                      <SessionCard key={s._id} session={s} index={i} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ────────────────────────────────────────
                ANALYTICS TAB
            ──────────────────────────────────────── */}
            {activeTab === 'analytics' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-6"
              >
                {/* Performance Chart */}
                <div className="bg-gray-900 border border-white/10
                                rounded-2xl p-6">
                  <h2 className="text-lg font-semibold mb-1">
                    Score Progress
                  </h2>
                  <p className="text-gray-400 text-sm mb-6">
                    Your performance trend across all sessions
                  </p>
                  <PerformanceChart data={stats?.chartData || []} />
                </div>

                {/* Role Breakdown */}
                {stats?.roleBreakdown?.length > 0 && (
                  <div className="bg-gray-900 border border-white/10
                                  rounded-2xl p-6">
                    <h2 className="text-lg font-semibold mb-1">
                      Performance by Role
                    </h2>
                    <p className="text-gray-400 text-sm mb-5">
                      Average score across each job role practiced
                    </p>
                    <div className="flex flex-col gap-4">
                      {stats.roleBreakdown.map(r => (
                        <div key={r.role}
                          className="flex items-center gap-4">
                          <div className="w-40 flex-shrink-0">
                            <div className="text-sm text-white truncate">
                              {r.role}
                            </div>
                            <div className="text-xs text-gray-500">
                              {r.count} session{r.count > 1 ? 's' : ''}
                            </div>
                          </div>
                          <div className="flex-1 h-2 bg-white/10
                                          rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-violet-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${r.averageScore}%` }}
                              transition={{ duration: 1, ease: 'easeOut' }}
                            />
                          </div>
                          <div className="text-sm font-medium
                                          text-violet-400 w-12 text-right
                                          flex-shrink-0">
                            {r.averageScore}/100
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Improvement Areas */}
                {sessions.filter(s => s.status === 'completed').length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Areas to improve */}
                    <div className="bg-gray-900 border border-white/10
                                    rounded-2xl p-6">
                      <h3 className="font-semibold mb-1 text-red-400">
                        Common Weak Areas
                      </h3>
                      <p className="text-gray-500 text-xs mb-4">
                        Dimensions where you score below 6/10
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {[...new Set(
                          sessions
                            .filter(s => s.summary?.improvement_areas?.length > 0)
                            .flatMap(s => s.summary.improvement_areas)
                        )].length > 0
                          ? [...new Set(
                              sessions
                                .filter(s => s.summary?.improvement_areas?.length > 0)
                                .flatMap(s => s.summary.improvement_areas)
                            )].map(area => (
                              <span key={area}
                                className="text-xs bg-red-500/10 border
                                           border-red-500/20 text-red-400
                                           px-3 py-1.5 rounded-full">
                                {area}
                              </span>
                            ))
                          : (
                            <p className="text-gray-600 text-sm">
                              No weak areas identified yet
                            </p>
                          )
                        }
                      </div>
                    </div>

                    {/* Strong areas */}
                    <div className="bg-gray-900 border border-white/10
                                    rounded-2xl p-6">
                      <h3 className="font-semibold mb-1 text-emerald-400">
                        Consistent Strengths
                      </h3>
                      <p className="text-gray-500 text-xs mb-4">
                        Dimensions where you consistently score above 8/10
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {[...new Set(
                          sessions
                            .filter(s => s.summary?.strong_areas?.length > 0)
                            .flatMap(s => s.summary.strong_areas)
                        )].length > 0
                          ? [...new Set(
                              sessions
                                .filter(s => s.summary?.strong_areas?.length > 0)
                                .flatMap(s => s.summary.strong_areas)
                            )].map(area => (
                              <span key={area}
                                className="text-xs bg-emerald-500/10 border
                                           border-emerald-500/20
                                           text-emerald-400 px-3 py-1.5
                                           rounded-full">
                                {area}
                              </span>
                            ))
                          : (
                            <p className="text-gray-600 text-sm">
                              Complete more sessions to identify strengths
                            </p>
                          )
                        }
                      </div>
                    </div>
                  </div>
                )}

                {/* No data state */}
                {stats?.totalSessions === 0 && (
                  <div className="text-center py-16 text-gray-500">
                    <div className="text-4xl mb-4">📊</div>
                    <p className="mb-2">No analytics yet</p>
                    <p className="text-sm text-gray-600">
                      Complete at least one session to see your analytics
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </>
        )}
      </main>
    </div>
  )
}