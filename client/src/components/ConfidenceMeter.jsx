import { motion } from 'framer-motion'

export default function ConfidenceMeter({ score, isLive = false }) {
  const pct   = Math.round(score * 10)
  const color = pct >= 75 ? '#1D9E75'
              : pct >= 50 ? '#EF9F27'
              : '#D85A30'

  const label = pct >= 75 ? 'Strong'
              : pct >= 50 ? 'Moderate'
              : 'Needs work'

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <div className="flex justify-between items-center mb-3">
        <div className="text-xs font-medium text-white/40 tracking-wider">
          {isLive ? 'LIVE CONFIDENCE' : 'CONFIDENCE SCORE'}
        </div>
        {isLive && (
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>
            <span className="text-xs text-emerald-400">Live</span>
          </div>
        )}
      </div>

      {/* Big score number */}
      <div className="flex items-end gap-2 mb-3">
        <motion.span
          key={pct}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white"
        >
          {pct}
        </motion.span>
        <span className="text-gray-500 text-sm mb-1">/100</span>
        <span className="text-xs mb-1.5 ml-auto font-medium"
          style={{ color }}>
          {label}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Segments */}
      <div className="flex justify-between text-xs text-white/20 mt-1">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
    </div>
  )
}