import { motion } from 'framer-motion'

const DIMENSIONS = [
  { key: 'relevance',  label: 'Relevance',  weight: '30%', color: '#7F77DD' },
  { key: 'structure',  label: 'Structure',  weight: '25%', color: '#1D9E75' },
  { key: 'depth',      label: 'Depth',      weight: '25%', color: '#EF9F27' },
  { key: 'confidence', label: 'Confidence', weight: '20%', color: '#D85A30' },
]

export default function ScoreBreakdown({ scores, answerScore, tip }) {
  if (!scores) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/10 rounded-xl p-4"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-xs font-medium text-white/40 tracking-wider">
          AI EVALUATION
        </div>
        {answerScore && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-white/40">Answer score</span>
            <span className="text-sm font-bold text-violet-400">
              {answerScore}/100
            </span>
          </div>
        )}
      </div>

      {/* Dimension scores */}
      {DIMENSIONS.map((dim, i) => {
        const val = scores[dim.key]
        if (!val) return null
        return (
          <motion.div
            key={dim.key}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="mb-3"
          >
            <div className="flex justify-between text-xs mb-1">
              <div className="flex items-center gap-1.5">
                <span className="text-white/60">{dim.label}</span>
                <span className="text-white/20">·</span>
                <span className="text-white/30">{dim.weight}</span>
              </div>
              <span className="font-medium" style={{ color: dim.color }}>
                {val.score}/10
              </span>
            </div>

            {/* Bar */}
            <div className="h-1 bg-white/10 rounded-full overflow-hidden mb-1">
              <motion.div
                className="h-full rounded-full"
                style={{ background: dim.color }}
                initial={{ width: 0 }}
                animate={{ width: `${val.score * 10}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.1 }}
              />
            </div>

            {/* Feedback */}
            <p className="text-white/30 text-xs leading-relaxed">
              {val.feedback}
            </p>
          </motion.div>
        )
      })}

      {/* Coaching tip */}
      {tip && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="text-xs font-medium text-emerald-400 mb-1">
            COACHING TIP
          </div>
          <p className="text-white/50 text-xs leading-relaxed">{tip}</p>
        </div>
      )}
    </motion.div>
  )
}