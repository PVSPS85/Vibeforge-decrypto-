import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen bg-vibe-bg bg-grid overflow-hidden flex flex-col items-center justify-center px-6">

      {/* Background blobs */}
      <div className="blob absolute top-20 left-10 w-72 h-72 bg-vibe-purple" />
      <div className="blob absolute bottom-20 right-10 w-96 h-96 bg-vibe-cyan" style={{ animationDelay: '2s' }} />

      {/* Badge */}
      <div className="relative z-10 mb-6 px-4 py-2 rounded-full border border-vibe-purple/40 bg-vibe-purple/10 text-sm font-semibold text-vibe-violet tracking-wide">
        🎮 Web3 Expense Splitting — Gamified
      </div>

      {/* Hero text */}
      <h1 className="relative z-10 font-display text-6xl md:text-7xl font-extrabold text-center leading-tight mb-6">
        Split Bills.
        <br />
        <span className="gradient-text">No Trust Needed.</span>
      </h1>

      <p className="relative z-10 text-gray-400 text-lg text-center max-w-xl mb-10 leading-relaxed">
        Create groups, add expenses, and settle on-chain automatically.
        No Venmo. No awkward reminders. Just vibes. ✨
      </p>

      {/* Buttons */}
      <div className="relative z-10 flex gap-4 flex-wrap justify-center">
        <button className="btn-primary text-lg px-8 py-4" onClick={() => navigate('/connect')}>
          🔗 Connect Wallet
        </button>
        <button className="btn-secondary text-lg px-8 py-4" onClick={() => navigate('/dashboard')}>
          👀 View Demo
        </button>
      </div>

      {/* Feature pills */}
      <div className="relative z-10 mt-16 flex flex-wrap gap-3 justify-center">
        {['⚡ On-Chain Settlement', '👥 Group Expenses', '🏆 Leaderboard', '🔐 MetaMask Login', '💸 Auto Split'].map(f => (
          <span key={f} className="px-4 py-2 rounded-full bg-vibe-card border border-vibe-border text-sm text-gray-300">
            {f}
          </span>
        ))}
      </div>
    </div>
  )
}
