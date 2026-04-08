import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('App error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-950 flex items-center
                        justify-center text-center px-4">
          <div>
            <div className="text-4xl mb-4">⚠</div>
            <h2 className="text-white text-xl font-bold mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Please refresh the page to continue.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-violet-600 text-white px-6 py-2
                         rounded-lg text-sm hover:bg-violet-500 transition"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}