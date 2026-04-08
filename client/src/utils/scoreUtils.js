// Live confidence estimate — runs every second during recording
export function estimateLiveConfidence(eyeContact, fillerCount, wordCount) {
  let score = 10

  if (eyeContact < 60) score -= 2
  if (eyeContact < 40) score -= 2

  const fillerRatio = wordCount > 0 ? fillerCount / wordCount : 0
  if (fillerRatio > 0.10) score -= 2
  else if (fillerRatio > 0.05) score -= 1

  return Math.max(0, Math.min(10, Math.round(score)))
}

// Format seconds into readable duration
export function formatDuration(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}m ${s}s`
}

// Get color for a score
export function getScoreColor(score, outOf = 10) {
  const pct = (score / outOf) * 100
  if (pct >= 75) return 'text-emerald-400'
  if (pct >= 50) return 'text-yellow-400'
  return 'text-red-400'
}