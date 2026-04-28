import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

const FLOATING_EMOJIS = ['💸', '⚡', '🏆', '🎮', '🔗', '✨', '🦊', '🎯']

const STATS = [
  { label: 'Total Settled', value: '₹2.4L', icon: '💸' },
  { label: 'Active Groups', value: '1,240', icon: '👥' },
  { label: 'XP Earned', value: '840K', icon: '⚡' },
  { label: 'On-Chain Txns', value: '9,200', icon: '🔗' },
]

const STEPS = [
  { icon: '🦊', title: 'Connect Wallet', desc: 'Link MetaMask in one click. No sign up needed.' },
  { icon: '👥', title: 'Create a Group', desc: 'Add friends, name your squad, set the vibe.' },
  { icon: '💸', title: 'Add Expenses', desc: 'Split bills equally or custom. Tracked on-chain.' },
  { icon: '⚡', title: 'Settle & Level Up', desc: 'Pay on-chain, earn XP, climb the leaderboard.' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setTick(p => p + 1), 2000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="relative min-h-screen bg-vibe-bg overflow-hidden">

      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-60" />

      {/* Blobs */}
      <div className="blob absolute top-20 left-[-100px] w-96 h-96 bg-vibe-purple" />
      <div className="blob absolute bottom-40 right-[-80px] w-80 h-80 bg-vibe-cyan" style={{ animationDelay: '2s' }} />
      <div className="blob absolute top-1/2 left-1/2 w-64 h-64 bg-vibe-pink" style={{ animationDelay: '4s', opacity: 0.07 }} />

      {/* Floating emojis */}
      {FLOATING_EMOJIS.map((emoji, i) => (
        <div
          key={i}
          className="absolute text-2xl select-none pointer-events-none"
          style={{
            left: `${10 + (i * 12)}%`,
            top: `${15 + (i % 3) * 20}%`,
            animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`,
            opacity: 0.15,
          }}
        >
          {emoji}
        </div>
      ))}

      {/* Navbar top strip */}
      <div className="relative z-10 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-vibe-purple to-vibe-cyan flex items-center justify-center text-sm font-bold">
            ⚡
          </div>
          <span className="font-display text-lg font-bold gradient-text">SmartSplit</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 font-semibold">
            QUEST
          </span>
        </div>
        <button
          onClick={() => navigate('/connect')}
          className="btn-secondary text-sm px-5 py-2"
        >
          🦊 Connect Wallet
        </button>
      </div>

      {/* Hero */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-16 pb-20">

        {/* Badge */}
        <div className="mb-6 px-4 py-2 rounded-full border border-vibe-purple/40 bg-vibe-purple/10 text-sm font-semibold text-vibe-violet flex items-center gap-2 animate-pulse-slow">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
          Built for DECRYPTO Hackathon @ BMSITM 🏆
        </div>

        {/* Headline */}
        <h1 className="font-display text-6xl md:text-8xl font-extrabold leading-tight mb-6 max-w-4xl">
          Split Bills.
          <br />
          <span className="gradient-text">Level Up Together.</span>
        </h1>

        <p className="text-gray-400 text-xl max-w-2xl mb-10 leading-relaxed">
          The world's first <span className="text-white font-semibold">gamified Web3 expense splitter</span>.
          No awkward reminders. No trust needed. Just vibes, XP, and on-chain settlements. ✨
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-16">
          <button
            className="btn-primary text-xl px-10 py-5 flex items-center gap-3"
            onClick={() => navigate('/connect')}
          >
            🔗 Connect Wallet
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Free</span>
          </button>
          <button
            className="btn-secondary text-xl px-10 py-5"
            onClick={() => navigate('/dashboard')}
          >
            👀 Try Demo
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl mb-20">
          {STATS.map((s, i) => (
            <div key={i} className="glass-card p-4 text-center hover:border-vibe-purple/40 transition-all">
              <p className="text-2xl mb-1">{s.icon}</p>
              <p className="font-display text-2xl font-bold gradient-text">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="w-full max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-white mb-2">How it works</h2>
          <p className="text-gray-400 mb-10 text-sm">Four steps to financial freedom ⚡</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {STEPS.map((step, i) => (
              <div
                key={i}
                className="glass-card p-6 text-center hover:border-vibe-purple/50 hover:-translate-y-1 transition-all duration-200"
              >
                {/* Step number */}
                <div className="w-6 h-6 rounded-full bg-vibe-purple/30 text-vibe-violet text-xs font-bold flex items-center justify-center mx-auto mb-3">
                  {i + 1}
                </div>
                <div className="text-4xl mb-3">{step.icon}</div>
                <p className="font-display font-bold text-white mb-2">{step.title}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Feature pills */}
        <div className="mt-16 flex flex-wrap gap-3 justify-center">
          {[
            '⚡ On-Chain Settlement',
            '🏆 XP Leaderboard',
            '🦊 MetaMask Login',
            '👥 Group Expenses',
            '💸 Auto Split',
            '🎮 Gamified UX',
            '🔐 Web3 Native',
            '📊 MongoDB Backend',
          ].map(f => (
            <span
              key={f}
              className="px-4 py-2 rounded-full bg-vibe-card border border-vibe-border text-sm text-gray-300 hover:border-vibe-purple/40 hover:text-white transition-all cursor-default"
            >
              {f}
            </span>
          ))}
        </div>

        {/* Footer */}
        <p className="mt-16 text-xs text-gray-600">
          Built with ❤️ for DECRYPTO @ BMSITM · React + Solidity + MongoDB
        </p>
      </div>
    </div>
  )
}