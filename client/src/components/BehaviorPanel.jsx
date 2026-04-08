import { motion } from 'framer-motion'

export default function BehaviorPanel({ eyeContact, expression, nervousness, faceDetected }) {

  const expressionEmoji = {
    neutral:   { label: 'Neutral',    color: 'text-gray-400'    },
    happy:     { label: 'Confident',  color: 'text-emerald-400' },
    fearful:   { label: 'Nervous',    color: 'text-red-400'     },
    surprised: { label: 'Surprised',  color: 'text-yellow-400'  },
    sad:       { label: 'Uncertain',  color: 'text-blue-400'    },
    disgusted: { label: 'Discomfort', color: 'text-orange-400'  },
    angry:     { label: 'Tense',      color: 'text-red-500'     },
  }

  const expInfo = expressionEmoji[expression] || expressionEmoji.neutral

  const metrics = [
    {
      label: 'Eye contact',
      value: `${eyeContact}%`,
      pct: eyeContact,
      color: eyeContact >= 70 ? 'bg-emerald-500'
           : eyeContact >= 45 ? 'bg-yellow-500'
           : 'bg-red-500'
    },
    {
      label: 'Composure',
      value: `${Math.max(0, 100 - nervousness)}%`,
      pct: Math.max(0, 100 - nervousness),
      color: nervousness < 20 ? 'bg-emerald-500'
           : nervousness < 50 ? 'bg-yellow-500'
           : 'bg-red-500'
    },
  ]

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <div className="text-xs font-medium text-white/40 mb-3 tracking-wider">
        BEHAVIOR ANALYSIS
      </div>

      {!faceDetected ? (
        <p className="text-white/30 text-xs">
          Position your face in the camera frame
        </p>
      ) : (
        <>
          {/* Expression */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-white/50">Expression</span>
            <span className={`text-xs font-medium ${expInfo.color}`}>
              {expInfo.label}
            </span>
          </div>

          {/* Metrics */}
          {metrics.map(m => (
            <div key={m.label} className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white/50">{m.label}</span>
                <span className="text-white/70 font-medium">{m.value}</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${m.color}`}
                  animate={{ width: `${m.pct}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}