import { motion, AnimatePresence } from 'framer-motion'

export default function FillerWordBadge({ fillerCount, detectedFillers }) {
  const severity = fillerCount === 0 ? 'none'
                 : fillerCount <= 2  ? 'low'
                 : fillerCount <= 5  ? 'medium'
                 : 'high'

  const colors = {
    none:   'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    low:    'bg-yellow-500/10  border-yellow-500/20  text-yellow-400',
    medium: 'bg-orange-500/10  border-orange-500/20  text-orange-400',
    high:   'bg-red-500/10     border-red-500/20     text-red-400',
  }

  const messages = {
    none:   'No filler words',
    low:    `${fillerCount} filler word${fillerCount > 1 ? 's' : ''}`,
    medium: `${fillerCount} fillers — slow down`,
    high:   `${fillerCount} fillers — too many!`,
  }

  return (
    <div className={`border rounded-lg px-3 py-2 text-xs ${colors[severity]}`}>
      <div className="font-medium mb-1">{messages[severity]}</div>
      {detectedFillers.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {detectedFillers.map(f => (
            <span key={f.word}
              className="bg-white/10 px-1.5 py-0.5 rounded text-xs">
              "{f.word}" ×{f.count}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}