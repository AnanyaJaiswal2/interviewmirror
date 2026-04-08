import { motion } from 'framer-motion'

export default function StatsCard({ label, value, suffix = '', change, color = 'violet' }) {
  const colors = {
    violet:  { bg: 'bg-violet-500/10',  border: 'border-violet-500/20',  text: 'text-violet-400'  },
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
    amber:   { bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   text: 'text-amber-400'   },
    blue:    { bg: 'bg-blue-500/10',    border: 'border-blue-500/20',    text: 'text-blue-400'    },
  }

  const c = colors[color] || colors.violet

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${c.bg} border ${c.border} rounded-xl p-5`}
    >
      <div className="text-xs font-medium text-white/40 tracking-wider mb-2">
        {label.toUpperCase()}
      </div>
      <div className="flex items-end gap-2">
        <span className={`text-3xl font-bold ${c.text}`}>
          {value}
        </span>
        {suffix && (
          <span className="text-gray-500 text-sm mb-1">{suffix}</span>
        )}
      </div>
      {change !== undefined && (
        <div className={`text-xs mt-2 ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)} from first session
        </div>
      )}
    </motion.div>
  )
}