import { useEffect, useRef, useState, useCallback } from 'react'
import * as faceapi from '@vladmandic/face-api'

export function useFaceAnalysis(videoRef) {
  const [isLoaded, setIsLoaded]           = useState(false)
  const [faceDetected, setFaceDetected]   = useState(false)
  const [eyeContact, setEyeContact]       = useState(0)
  const [expression, setExpression]       = useState('neutral')
  const [nervousness, setNervousness]     = useState(0)

  // These refs accumulate data across the entire answer
  const eyeContactReadings  = useRef([])
  const expressionReadings  = useRef([])
  const intervalRef         = useRef(null)
  const isAnalyzing         = useRef(false)

  // Load models on mount
  useEffect(() => {
    loadModels()
    return () => stopAnalysis()
  }, [])

 const loadModels = async () => {
  try {
    const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model'

    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ])

    console.log('Face detection models loaded')
    setIsLoaded(true)
  } catch (err) {
    console.error('Failed to load face models:', err)
  }
}

  const startAnalysis = useCallback(() => {
    if (!isLoaded || !videoRef.current) return

    // Reset accumulators for new answer
    eyeContactReadings.current  = []
    expressionReadings.current  = []
    isAnalyzing.current         = true

    // Run detection every 200ms
    // Why 200ms? Fast enough to be responsive, slow enough to not kill performance
    intervalRef.current = setInterval(async () => {
      if (!isAnalyzing.current || !videoRef.current) return
      await detectFrame()
    }, 200)

  }, [isLoaded, videoRef])

  const stopAnalysis = useCallback(() => {
    isAnalyzing.current = false
    clearInterval(intervalRef.current)

    // Calculate averages across the entire answer
    const avgEyeContact = eyeContactReadings.current.length > 0
      ? Math.round(
          eyeContactReadings.current.reduce((a, b) => a + b, 0) /
          eyeContactReadings.current.length
        )
      : 0

    // Find dominant expression
    const dominantExpression = getDominantExpression(expressionReadings.current)

    return {
      eye_contact_pct:  avgEyeContact,
      dominant_expression: dominantExpression,
      nervousness_score: calculateNervousness(expressionReadings.current),
      total_readings:   eyeContactReadings.current.length
    }
  }, [])

  const detectFrame = async () => {
    if (!videoRef.current || videoRef.current.readyState !== 4) return
    // readyState 4 = video data is fully loaded and playable

    try {
      const detection = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
          // TinyFaceDetector is faster and lighter than SSD
          // Perfect for real-time use — less accurate but good enough
        )
        .withFaceLandmarks()
        .withFaceExpressions()

      if (!detection) {
        // No face detected
        setFaceDetected(false)
        eyeContactReadings.current.push(0)
        return
      }

      setFaceDetected(true)

      // ── Eye Contact Analysis ──
      const landmarks    = detection.landmarks
      const leftEye      = landmarks.getLeftEye()
      const rightEye     = landmarks.getRightEye()
      const eyeContactPct = approximateEyeContact(
        detection.detection.box,
        leftEye,
        rightEye,
        videoRef.current
      )

      setEyeContact(eyeContactPct)
      eyeContactReadings.current.push(eyeContactPct)

      // ── Expression Analysis ──
      const expressions = detection.expressions
      const dominant    = getDominantFromDetection(expressions)
      setExpression(dominant)
      expressionReadings.current.push(expressions)

      // Update nervousness score live
      const fearScore    = expressions.fearful   || 0
      const surpriseScore = expressions.surprised || 0
      setNervousness(Math.round((fearScore + surpriseScore * 0.5) * 100))

    } catch (err) {
      // Silently ignore frame errors — next frame will try again
    }
  }

  return {
    isLoaded,
    faceDetected,
    eyeContact,
    expression,
    nervousness,
    startAnalysis,
    stopAnalysis,
  }
}

// ─────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────

function approximateEyeContact(faceBox, leftEye, rightEye, video) {
  // Eye contact approximation logic:
  // If the face is roughly centered and at a normal size,
  // the user is likely looking at the camera
  //
  // We check two things:
  // 1. Is the face centered horizontally? (left-right)
  // 2. Is the face a reasonable size? (not too far, not too close)

  const videoWidth   = video.videoWidth  || 640
  const videoHeight  = video.videoHeight || 480

  // Face center X position as percentage of video width
  const faceCenterX = (faceBox.x + faceBox.width  / 2) / videoWidth
  const faceCenterY = (faceBox.y + faceBox.height / 2) / videoHeight

  // Face size as percentage of video (too small = far away = not looking at camera)
  const faceSize = (faceBox.width * faceBox.height) / (videoWidth * videoHeight)

  // How centered is the face? 1.0 = perfect center, 0 = at edge
  const horizontalCenter = 1 - Math.abs(faceCenterX - 0.5) * 2
  const verticalCenter   = 1 - Math.abs(faceCenterY - 0.5) * 2

  // Face is too small = user looking away or too far
  const sizeScore = Math.min(1, faceSize * 20)

  // Combined score
  const rawScore = (horizontalCenter * 0.4 + verticalCenter * 0.3 + sizeScore * 0.3)

  return Math.round(Math.max(0, Math.min(100, rawScore * 100)))
}

function getDominantFromDetection(expressions) {
  return Object.entries(expressions)
    .sort(([, a], [, b]) => b - a)[0][0]
}

function getDominantExpression(readings) {
  if (!readings.length) return 'neutral'

  const totals = {}
  readings.forEach(exp => {
    Object.entries(exp).forEach(([key, val]) => {
      totals[key] = (totals[key] || 0) + val
    })
  })

  return Object.entries(totals)
    .sort(([, a], [, b]) => b - a)[0][0]
}

function calculateNervousness(readings) {
  if (!readings.length) return 0
  const avgFear = readings.reduce((sum, exp) => sum + (exp.fearful || 0), 0) / readings.length
  return Math.round(avgFear * 100)
}