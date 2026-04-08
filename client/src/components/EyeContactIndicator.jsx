import { motion } from 'framer-motion'

export default function EyeContactIndicator({ eyeContact, faceDetected, expression }) {

  const getStatus = () => {
    if (!faceDetected)    return { label: 'Face not detected', color: 'text-gray-400',   bg: 'bg-gray-500/10  border-gray-500/20'  }
    if (eyeContact >= 70) return { label: 'Eye contact: good',      color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' }
    if (eyeContact >= 45) return { label: 'Look at camera',         color: 'text-yellow-400',  bg: 'bg-yellow-500/10  border-yellow-500/20'  }
    return                       { label: 'Maintain eye contact',   color: 'text-red-400',     bg: 'bg-red-500/10     border-red-500/20'     }
  }

  const status = getStatus()

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-md
                  border ${status.bg} ${status.color}`}
    >
      {status.label}
      {faceDetected && (
        <span className="ml-1 opacity-60">({eyeContact}%)</span>
      )}
    </motion.div>
  )
}