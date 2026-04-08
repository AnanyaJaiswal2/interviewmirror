import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const BAND = (score) => {
  if (score >= 85) return { label: 'Strong hire',  color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' }
  if (score >= 70) return { label: 'Hire',         color: 'text-green-400',   bg: 'bg-green-500/10   border-green-500/20'   }
  if (score >= 55) return { label: 'Consider',     color: 'text-yellow-400',  bg: 'bg-yellow-500/10  border-yellow-500/20'  }
  if (score >= 40) return { label: 'Needs work',   color: 'text-orange-400',  bg: 'bg-orange-500/10  border-orange-500/20'  }
  return                   { label: 'Not ready',   color: 'text-red-400',     bg: 'bg-red-500/10     border-red-500/20'     }
}

export default function SessionCard({ session, index }) {
  const navigate = useNavigate()
  const score    = session.summary?.overall_score || 0
  const band     = BAND(score)

  const date = new Date(session.createdAt).toLocaleDateString('en-IN', {
    day:   'numeric',
    month: 'short',
    year:  'numeric'
  })

  const answeredCount = session.questions?.filter(
    q => q.answer?.transcript
  ).length || 0

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => navigate(`/session/${session._id}`)}
      className="bg-gray-900 border border-white/10 rounded-xl p-5
                 hover:border-white/20 transition cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-4">

        {/* Left */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white font-medium text-sm truncate">
              {session.jobRole}
            </h3>
            <span className="text-xs text-gray-500 capitalize">
              · {session.difficulty}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>{date}</span>
            <span>·</span>
            <span>{answeredCount} answers</span>
            {session.status === 'in_progress' && (
              <>
                <span>·</span>
                <span className="text-yellow-400">Incomplete</span>
              </>
            )}
          </div>
        </div>

        {/* Right — Score */}
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          {session.status === 'completed' ? (
            <>
              <div className="text-2xl font-bold text-white">
                {score}
                <span className="text-gray-500 text-sm font-normal">/100</span>
              </div>
              <div className={`text-xs px-2 py-0.5 rounded-full border ${band.bg} ${band.color}`}>
                {band.label}
              </div>
            </>
          ) : (
            <div className="text-xs text-yellow-400 bg-yellow-500/10
                            border border-yellow-500/20 px-2 py-1 rounded-lg">
              In progress
            </div>
          )}
        </div>
      </div>

      {/* Score bar — only for completed */}
      {session.status === 'completed' && (
        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            { label: 'Relevance',  val: session.summary?.breakdown?.relevance  || 0 },
            { label: 'Structure',  val: session.summary?.breakdown?.structure  || 0 },
            { label: 'Depth',      val: session.summary?.breakdown?.depth      || 0 },
            { label: 'Confidence', val: session.summary?.breakdown?.confidence || 0 },
          ].map(d => (
            <div key={d.label}>
              <div className="text-xs text-gray-500 mb-1">{d.label}</div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-violet-500 rounded-full"
                  style={{ width: `${d.val * 10}%` }}
                />
              </div>
              <div className="text-xs text-white/50 mt-0.5">{d.val}/10</div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}