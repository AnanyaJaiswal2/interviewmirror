import { useEffect, useRef, useState } from 'react'

// This hook handles ALL webcam logic
// Your component stays clean — just call useWebcam()
export function useWebcam() {
  const videoRef = useRef(null)
  // useRef gives us a direct reference to the <video> DOM element
  // Unlike useState, changing a ref doesn't re-render the component

  const [hasPermission, setHasPermission] = useState(null)
  // null = not asked yet, true = granted, false = denied

  const [error, setError] = useState(null)

  useEffect(() => {
    startWebcam()
    return () => stopWebcam()
    // The return function = cleanup
    // When the Interview component unmounts, the webcam stops automatically
  }, [])

  const startWebcam = async () => {
    try {
      // Ask browser for webcam + mic access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'    // front camera
        },
        audio: true
      })

      // Attach the stream to the <video> element
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      setHasPermission(true)
    } catch (err) {
      setHasPermission(false)
      setError(err.message)
      // Common errors:
      // NotAllowedError = user clicked "Block"
      // NotFoundError = no camera found
    }
  }

  const stopWebcam = () => {
    // Stop all tracks — otherwise the camera light stays on forever
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop())
    }
  }

  return { videoRef, hasPermission, error }
}