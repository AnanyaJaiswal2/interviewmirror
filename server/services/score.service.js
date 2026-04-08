// ─────────────────────────────────────────
// WEIGHTS — must add up to 1.0
// ─────────────────────────────────────────
const WEIGHTS = {
  relevance:  0.30,
  structure:  0.25,
  depth:      0.25,
  confidence: 0.20,
}

// ─────────────────────────────────────────
// COMPUTE CONFIDENCE FROM BEHAVIOR DATA
// Called after each answer
// ─────────────────────────────────────────
exports.computeConfidence = (behavior) => {
  if (!behavior) return 7

  let score = 10

  // Eye contact penalty
  const eyePct = behavior.eye_contact_pct || 0
  if (eyePct < 60) score -= 2
  if (eyePct < 40) score -= 2

  // Filler word penalty — max 3 points deducted
  const fillerPenalty = Math.min(3, (behavior.hesitation_count || 0) * 0.3)
  score -= fillerPenalty

  // Speaking pace penalty
  const pace = behavior.speaking_pace_wpm || 130
  if (pace > 0 && (pace < 100 || pace > 180)) score -= 1

  // Nervousness penalty
  const nervousness = behavior.nervousness_score || 0
  if (nervousness > 30) score -= 1

  return Math.max(0, Math.min(10, Math.round(score * 10) / 10))
}

// ─────────────────────────────────────────
// COMPUTE WEIGHTED SCORE FOR ONE ANSWER
// ─────────────────────────────────────────
exports.computeAnswerScore = (aiScores, confidenceScore) => {
  const relevance  = aiScores.relevance?.score  || 0
  const structure  = aiScores.structure?.score  || 0
  const depth      = aiScores.depth?.score      || 0
  const confidence = confidenceScore             || 0

  const weighted =
    relevance  * WEIGHTS.relevance  * 10 +
    structure  * WEIGHTS.structure  * 10 +
    depth      * WEIGHTS.depth      * 10 +
    confidence * WEIGHTS.confidence * 10

  return Math.round(weighted)
}

// ─────────────────────────────────────────
// COMPUTE SESSION SUMMARY
// Called when session ends — averages all answers
// ─────────────────────────────────────────
exports.computeSessionSummary = (questions) => {
  // Only include answered questions
  const answered = questions.filter(q => q.answer && q.answer.scores)

  if (answered.length === 0) {
    return {
      overall_score:       0,
      confidence_score:    0,
      communication_score: 0,
      content_score:       0,
      improvement_areas:   ['Complete at least one answer to get scores'],
      strong_areas:        []
    }
  }

  // Average each dimension across all answers
  const avg = (key) => {
    const vals = answered
      .map(q => q.answer.scores?.[key]?.score || 0)
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length * 10) / 10
  }

  const avgRelevance  = avg('relevance')
  const avgStructure  = avg('structure')
  const avgDepth      = avg('depth')
  const avgConfidence = avg('confidence')

  // Weighted overall
  const overall = Math.round(
    avgRelevance  * WEIGHTS.relevance  * 10 +
    avgStructure  * WEIGHTS.structure  * 10 +
    avgDepth      * WEIGHTS.depth      * 10 +
    avgConfidence * WEIGHTS.confidence * 10
  )

  // Communication = structure + confidence average
  const communication = Math.round((avgStructure + avgConfidence) / 2 * 10)

  // Content = relevance + depth average
  const content = Math.round((avgRelevance + avgDepth) / 2 * 10)

  // Identify weak areas (score below 6)
  const improvement_areas = []
  const strong_areas      = []

  const dimensions = [
    { name: 'eye contact and confidence', score: avgConfidence },
    { name: 'answer structure',           score: avgStructure  },
    { name: 'answer relevance',           score: avgRelevance  },
    { name: 'technical depth',            score: avgDepth      },
  ]

  dimensions.forEach(d => {
    if (d.score < 6)      improvement_areas.push(d.name)
    else if (d.score >= 8) strong_areas.push(d.name)
  })

  return {
    overall_score:       overall,
    confidence_score:    Math.round(avgConfidence * 10),
    communication_score: communication,
    content_score:       content,
    improvement_areas,
    strong_areas,
    breakdown: {
      relevance:  avgRelevance,
      structure:  avgStructure,
      depth:      avgDepth,
      confidence: avgConfidence,
    }
  }
}

// ─────────────────────────────────────────
// GET PERFORMANCE BAND
// ─────────────────────────────────────────
exports.getBand = (score) => {
  if (score >= 85) return { label: 'Strong hire',  color: 'emerald' }
  if (score >= 70) return { label: 'Hire',         color: 'green'   }
  if (score >= 55) return { label: 'Consider',     color: 'yellow'  }
  if (score >= 40) return { label: 'Needs work',   color: 'orange'  }
  return                   { label: 'Not ready',   color: 'red'     }
}

// ─────────────────────────────────────────
// LIVE CONFIDENCE ESTIMATE
// Used by frontend to show live meter
// Based on current behavior data alone
// ─────────────────────────────────────────
exports.estimateLiveConfidence = (eyeContact, fillerCount, wordCount) => {
  let score = 10

  if (eyeContact < 60) score -= 2
  if (eyeContact < 40) score -= 2

  // Scale filler penalty by answer length
  // More words = filler ratio matters more
  const fillerRatio = wordCount > 0 ? fillerCount / wordCount : 0
  if (fillerRatio > 0.1) score -= 2      // more than 10% fillers
  else if (fillerRatio > 0.05) score -= 1 // 5-10% fillers

  return Math.max(0, Math.min(10, Math.round(score)))
}