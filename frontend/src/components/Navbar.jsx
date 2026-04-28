import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useWeb3 } from '../context/Web3Context'

export default function Navbar() {
  const { account, disconnectWallet } = useWeb3()
  const navigate = useNavigate()
  const location = useLocation()

  const short = account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Demo'

  const isActive = (path) => location.pathname === path

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 px-6 py-3 flex items-center justify-between border-b border-vibe-border bg-vibe-bg/90 backdrop-blur-md">

      {/* Logo */}
      <Link to="/dashboard" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-vibe-purple to-vibe-cyan flex items-center justify-center text-sm font-bold text-white">
          ⚡
        </div>
        <span className="font-display text-lg font-bold gradient-text">SmartSplit</span>
        <span className="hidden md:inline text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 font-semibold">
          QUEST
        </span>
      </Link>

      {/* Nav Links */}
      <div className="flex items-center gap-1">
        {[
          { path: '/dashboard', label: '🏠 Dashboard' },
          { path: '/activity', label: '📋 Activity' },
        ].map(({ path, label }) => (
          <Link
            key={path}
            to={path}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              isActive(path)
                ? 'bg-vibe-purple/20 text-vibe-violet border border-vibe-purple/30'
                : 'text-gray-400 hover:text-white hover:bg-vibe-card'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Right side — wallet + XP */}
      <div className="flex items-center gap-3">

        {/* XP Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
          <span className="text-xs text-yellow-300 font-bold">⚡ 2,840 XP</span>
        </div>

        {/* Level Badge */}
        <div className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-vibe-purple/10 border border-vibe-purple/20">
          <span className="text-xs text-vibe-violet font-bold">Lv.7</span>
        </div>

        {/* Wallet address */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-vibe-card border border-vibe-border">
          {/* Green dot */}
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm font-mono text-gray-300">
            {account ? `🦊 ${short}` : '👀 Demo'}
          </span>
        </div>

        {/* Disconnect */}
        <button
          onClick={() => { disconnectWallet(); navigate('/') }}
          className="px-3 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-vibe-card border border-transparent hover:border-vibe-border transition-all"
        >
          ↗ Exit
        </button>
      </div>
    </nav>
  )
}