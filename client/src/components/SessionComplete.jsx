import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const BAND_COLORS = {
  emerald: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', text: 'text-emerald-400' },
  green:   { bg: 'bg-green-500/20',   border: 'border-green-500/30',   text: 'text-green-400'   },
  yellow:  { bg: 'bg-yellow-500/20',  border: 'border-yellow-500/30',  text: 'text-yellow-400'  },
  orange:  { bg: 'bg-orange-500/20',  border: 'border-orange-500/30',  text: 'text-orange-400'  },
  red:     { bg: 'bg-red-500/20',     border: 'border-red-500/30',     text: 'text-red-400'     },
}

export default function SessionComplete({ summary, band }) {
  const navigate   = useNavigate()
  const bandColors = BAND_COLORS[band?.color] || BAND_COLORS.yellow

  const metrics = [
    { label: 'Overall',       value: summary?.overall_score,       suffix: '/100' },
    { label: 'Confidence',    value: summary?.confidence_score,    suffix: '/100' },
    { label: 'Communication', value: summary?.communication_score, suffix: '/100' },
    { label: 'Content',       value: summary?.content_score,       suffix: '/100' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-950 flex items-center justify-center px-4"
    >
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-violet-600/20 border
                          border-violet-500/30 flex items-center justify-center
                          mx-auto mb-4 text-2xl">
            ✓
          </div>
          <h2 className="text-white text-2xl font-bold mb-1">Session Complete!</h2>
          <p className="text-gray-400 text-sm">Here is how you performed</p>
        </div>

        {/* Performance Band */}
        <div className={`${bandColors.bg} border ${bandColors.border}
                         rounded-xl p-4 text-center mb-6`}>
          <div className={`text-lg font-bold ${bandColors.text} mb-1`}>
            {band?.label || 'Complete'}
          </div>
          <div className="text-white text-3xl font-bold">
            {summary?.overall_score || 0}
            <span className="text-gray-500 text-lg font-normal">/100</span>
          </div>
        </div>

        {/* Score Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {metrics.map(m => (
            <div key={m.label}
              className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {m.value || 0}
                <span className="text-gray-500 text-sm font-normal">{m.suffix}</span>
              </div>
              <div className="text-xs text-white/40">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Improvement Areas */}
        {summary?.improvement_areas?.length > 0 && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4">
            <div className="text-xs font-medium text-red-400 mb-2 tracking-wider">
              IMPROVE THESE
            </div>
            {summary.improvement_areas.map(area => (
              <div key={area} className="text-white/60 text-sm flex items-center gap-2 mb-1">
                <span className="text-red-400">→</span> {area}
              </div>
            ))}
          </div>
        )}

        {/* Strong Areas */}
        {summary?.strong_areas?.length > 0 && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-6">
            <div className="text-xs font-medium text-emerald-400 mb-2 tracking-wider">
              YOUR STRENGTHS
            </div>
            {summary.strong_areas.map(area => (
              <div key={area} className="text-white/60 text-sm flex items-center gap-2 mb-1">
                <span className="text-emerald-400">✓</span> {area}
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 bg-violet-600 hover:bg-violet-500 transition
                       py-3 rounded-xl text-white font-semibold text-sm"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-5 py-3 rounded-xl text-sm text-gray-400
                       border border-white/10 hover:border-white/20 transition"
          >
            New Session
          </button>
        </div>
      </div>
    </motion.div>
  )
}