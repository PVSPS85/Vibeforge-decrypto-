import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useWeb3 } from '../context/Web3Context'

export default function Navbar() {
  const { account, userProfile, disconnectWallet } = useWeb3()
  const navigate = useNavigate()
  const location = useLocation()
  const [copied, setCopied] = useState(false)

  const handleCopyUid = async () => {
    const uid = userProfile?.appUid
    if (!uid) return

    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(uid)
      } else {
        // Fallback for non-HTTPS (localhost dev)
        const textarea = document.createElement('textarea')
        textarea.value = uid
        textarea.style.position = 'fixed'
        textarea.style.left = '-9999px'
        textarea.style.top = '-9999px'
        document.body.appendChild(textarea)
        textarea.focus()
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

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
          <span className="text-xs text-yellow-300 font-bold">⚡ {(userProfile?.xp || 0).toLocaleString()} XP</span>
        </div>

        {/* Level Badge */}
        <div className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-vibe-purple/10 border border-vibe-purple/20">
          <span className="text-xs text-vibe-violet font-bold">Lv.{Math.floor((userProfile?.xp || 0) / 500) + 1}</span>
        </div>

        {/* User Identity */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-vibe-card border border-vibe-border">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          {userProfile ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">
                {userProfile.displayName || 'Unnamed User'}
              </span>
              <span className="text-xs bg-vibe-purple/20 text-vibe-violet px-2 py-0.5 rounded font-mono border border-vibe-purple/30">
                {userProfile.appUid || 'SS-????'}
              </span>
              <button 
                onClick={handleCopyUid}
                className="ml-1 px-2 py-1 rounded-lg bg-vibe-purple/10 hover:bg-vibe-purple/30 border border-vibe-purple/20 hover:border-vibe-purple/50 text-gray-400 hover:text-white transition-all flex items-center justify-center"
                title="Copy UID to clipboard"
              >
                {copied ? (
                  <span className="text-xs text-green-400 font-semibold whitespace-nowrap">✓ Copied</span>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
          ) : (
            <span className="text-sm font-mono text-gray-300">
              {account ? 'Loading Profile...' : '👀 Demo'}
            </span>
          )}
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