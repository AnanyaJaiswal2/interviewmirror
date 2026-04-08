import { useState, useRef, useCallback } from 'react'

// Filler words to detect
const FILLER_WORDS = [
  'um', 'uh', 'umm', 'uhh',
  'like', 'basically', 'literally',
  'you know', 'i mean', 'sort of',
  'kind of', 'right', 'okay so'
]

export function useSpeech() {
  const [transcript, setTranscript]           = useState('')
  const [interimTranscript, setInterim]       = useState('')
  const [isListening, setIsListening]         = useState(false)
  const [fillerCount, setFillerCount]         = useState(0)
  const [wordCount, setWordCount]             = useState(0)
  const [detectedFillers, setDetectedFillers] = useState([])

  const recognitionRef  = useRef(null)
  const startTimeRef    = useRef(null)
  const finalTextRef    = useRef('')   // accumulates all final text

  const startListening = useCallback(() => {
    // Check browser support
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert('Speech recognition not supported. Please use Chrome or Edge.')
      return
    }

    const recognition = new SpeechRecognition()

    // Configuration
    recognition.continuous     = true
    // continuous = keeps listening even after pauses
    // without this it stops after first sentence

    recognition.interimResults = true
    // interimResults = fires events while still speaking
    // gives us the live preview effect

    recognition.lang           = 'en-US'
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsListening(true)
      startTimeRef.current = Date.now()
      finalTextRef.current = ''
      setTranscript('')
      setInterim('')
      setFillerCount(0)
      setWordCount(0)
      setDetectedFillers([])
    }

    recognition.onresult = (event) => {
      let interimText = ''
      let newFinalText = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const text = result[0].transcript

        if (result.isFinal) {
          // This chunk is done — add to final text
          newFinalText += text + ' '
        } else {
          // Still speaking — show as preview
          interimText += text
        }
      }

      if (newFinalText) {
        finalTextRef.current += newFinalText

        // Analyze the final text for fillers
        const analysis = analyzeText(finalTextRef.current)
        setFillerCount(analysis.fillerCount)
        setWordCount(analysis.wordCount)
        setDetectedFillers(analysis.foundFillers)
      }

      // Show combined: all final text + current interim
      setTranscript(finalTextRef.current)
      setInterim(interimText)
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      if (event.error === 'no-speech') {
        // User stopped speaking — this is normal, not an error
        return
      }
      setIsListening(false)
    }

    recognition.onend = () => {
      // Auto-restart if we're still supposed to be listening
      // This handles the browser cutting off after 60 seconds
      if (isListening && recognitionRef.current) {
        try {
          recognition.start()
        } catch (e) {
          setIsListening(false)
        }
      }
    }

    recognitionRef.current = recognition
    recognition.start()

  }, [isListening])

  const stopListening = useCallback(() => {
    setIsListening(false)
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }

    // Calculate final speaking pace
    const durationMinutes = (Date.now() - startTimeRef.current) / 60000
    const wpm = durationMinutes > 0
      ? Math.round(wordCount / durationMinutes)
      : 0

    return {
      fullTranscript: finalTextRef.current.trim(),
      fillerCount,
      wordCount,
      wordsPerMinute: wpm,
      detectedFillers
    }
  }, [fillerCount, wordCount, detectedFillers])

  // Returns current full text (final + interim preview)
  const fullDisplay = transcript + interimTranscript

  return {
    fullDisplay,       // what to show in the transcript box
    transcript,        // final confirmed text only
    interimTranscript, // current unconfirmed preview
    isListening,
    fillerCount,
    wordCount,
    detectedFillers,
    startListening,
    stopListening,
  }
}

// ─────────────────────────────────────────
// ANALYSIS HELPERS
// ─────────────────────────────────────────
function analyzeText(text) {
  const lower = text.toLowerCase()
  const words = lower.trim().split(/\s+/).filter(Boolean)
  const wordCount = words.length

  let fillerCount = 0
  const foundFillers = []

  FILLER_WORDS.forEach(filler => {
    // Count how many times this filler appears
    const regex = new RegExp(`\\b${filler}\\b`, 'gi')
    const matches = text.match(regex)
    if (matches && matches.length > 0) {
      fillerCount += matches.length
      foundFillers.push({ word: filler, count: matches.length })
    }
  })

  return { fillerCount, wordCount, foundFillers }
}