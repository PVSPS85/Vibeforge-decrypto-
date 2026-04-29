import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import ConnectPage from './pages/ConnectPage'
import Dashboard from './pages/Dashboard'
import GroupPage from './pages/GroupPage'
import ActivityPage from './pages/ActivityPage'
import Navbar from './components/Navbar'
import { useWeb3 } from './context/Web3Context'

function ProfileOnboardingModal() {
  const { account, userProfile, setUserProfile } = useWeb3()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  if (!account || !userProfile || userProfile.displayName !== 'User') return null

  const handleSave = async () => {
    if (!name.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:5005/api/users/${account}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName: name.trim() })
      })
      const data = await res.json()
      if (data.success) {
        setUserProfile(data.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center px-4">
      <div className="glass-card p-8 w-full max-w-md animate-slide-up text-center border border-vibe-purple/50 shadow-[0_0_50px_rgba(124,58,237,0.3)]">
        <div className="w-16 h-16 rounded-full bg-vibe-purple/20 flex items-center justify-center text-3xl mx-auto mb-4">
          ✨
        </div>
        <h2 className="font-display text-3xl font-bold mb-2 text-white">Welcome to Vibeforge!</h2>
        <p className="text-gray-400 text-sm mb-6">Choose a display name so your friends can easily find you to split bills.</p>
        
        <input
          className="w-full bg-vibe-bg/50 border border-vibe-border rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-vibe-purple focus:ring-1 focus:ring-vibe-purple transition-all text-center font-display text-xl mb-6"
          placeholder="e.g. Satoshi"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          autoFocus
        />
        
        <button 
          onClick={handleSave} 
          disabled={!name.trim() || loading}
          className="btn-primary w-full py-4 text-lg shadow-lg hover:shadow-vibe-purple/25 transition-all disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Set Display Name'}
        </button>
      </div>
    </div>
  )
}

// Protected Route to enforce Wallet connection
const ProtectedRoute = ({ children }) => {
  const { account } = useWeb3()
  if (!account) return <Navigate to="/connect" replace />
  return children
}

export default function App() {
  const { account } = useWeb3()

  return (
    <div className="min-h-screen bg-vibe-bg font-body text-white">
      {account && <Navbar />}
      <ProfileOnboardingModal />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/connect" element={<ConnectPage />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/group/:id" element={<ProtectedRoute><GroupPage /></ProtectedRoute>} />
        <Route path="/activity" element={<ProtectedRoute><ActivityPage /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}