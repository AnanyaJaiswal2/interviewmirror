import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

// If user is not logged in → redirect to /auth
// If user IS logged in → show the actual page
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    // Still checking localStorage — don't redirect yet
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  return children
}