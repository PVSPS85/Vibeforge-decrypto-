import { Link, useNavigate } from 'react-router-dom'
import { useWeb3 } from '../context/Web3Context'

export default function Navbar() {
  const { account, disconnectWallet } = useWeb3()
  const navigate = useNavigate()

  const short = account ? `${account.slice(0, 6)}...${account.slice(-4)}` : ''

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between border-b border-vibe-border bg-vibe-bg/80 backdrop-blur-md">
      <Link to="/dashboard" className="font-display text-xl font-bold gradient-text">
        ⚡ SmartSplit
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/dashboard" className="text-gray-400 hover:text-white text-sm transition-colors">Dashboard</Link>
        <Link to="/activity" className="text-gray-400 hover:text-white text-sm transition-colors">Activity</Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="px-4 py-2 rounded-xl bg-vibe-card border border-vibe-border text-sm font-mono text-gray-300">
          🦊 {short}
        </div>
        <button
          onClick={() => { disconnectWallet(); navigate('/') }}
          className="btn-secondary text-sm px-4 py-2"
        >
          Disconnect
        </button>
      </div>
    </nav>
  )
}
