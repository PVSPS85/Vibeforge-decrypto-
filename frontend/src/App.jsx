import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import ConnectPage from './pages/ConnectPage'
import Dashboard from './pages/Dashboard'
import GroupPage from './pages/GroupPage'
import ActivityPage from './pages/ActivityPage'
import Navbar from './components/Navbar'
import { useWeb3 } from './context/Web3Context'

export default function App() {
  const { account } = useWeb3()

  return (
    <div className="min-h-screen bg-vibe-bg font-body text-white">
      {account && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/connect" element={<ConnectPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/group/:id" element={<GroupPage />} />
        <Route path="/activity" element={<ActivityPage />} />
      </Routes>
    </div>
  )
}
