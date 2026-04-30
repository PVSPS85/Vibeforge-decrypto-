import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import ConnectPage from './pages/ConnectPage'
import Dashboard from './pages/Dashboard'
import GroupPage from './pages/GroupPage'
import ActivityPage from './pages/ActivityPage'
import Navbar from './components/Navbar'
import { useWeb3 } from './context/Web3Context'

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
      {/* Profile onboarding modal is rendered inside Web3Provider (Web3Context.jsx) */}
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