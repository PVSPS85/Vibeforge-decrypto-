import { useNavigate } from 'react-router-dom'
import { useWeb3 } from '../context/Web3Context'
import { useEffect } from 'react'

export default function ConnectPage() {
  const { connectWallet, account, isConnecting, error } = useWeb3()
  const navigate = useNavigate()

  useEffect(() => {
    if (account) navigate('/dashboard')
  }, [account])

  return (
    <div className="relative min-h-screen bg-vibe-bg bg-grid flex items-center justify-center px-6 overflow-hidden">

      <div className="blob absolute top-10 right-20 w-80 h-80 bg-vibe-purple" />
      <div className="blob absolute bottom-10 left-20 w-64 h-64 bg-vibe-cyan" style={{ animationDelay: '3s' }} />

      <div className="relative z-10 glass-card p-10 max-w-md w-full text-center animate-slide-up">

        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-vibe-purple to-vibe-cyan flex items-center justify-center text-4xl glow-purple">
          🦊
        </div>

        <h2 className="font-display text-4xl font-bold mb-3">
          Connect Your <span className="gradient-text">Wallet</span>
        </h2>
        <p className="text-gray-400 mb-8">
          Link your MetaMask to start splitting expenses on-chain. It takes 2 seconds.
        </p>

        {/* Steps */}
        <div className="text-left mb-8 space-y-3">
          {[
            { step: '1', text: 'Click Connect below', done: true },
            { step: '2', text: 'Approve in MetaMask popup', done: false },
            { step: '3', text: 'Start splitting!', done: false },
          ].map(({ step, text, done }) => (
            <div key={step} className="flex items-center gap-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${done ? 'bg-vibe-purple text-white' : 'bg-vibe-border text-gray-400'}`}>
                {step}
              </div>
              <span className="text-gray-300 text-sm">{text}</span>
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            ⚠️ {error}
          </div>
        )}

        <button
          className="btn-primary w-full text-lg py-4"
          onClick={connectWallet}
          disabled={isConnecting}
        >
          {isConnecting ? '⏳ Connecting...' : '🔗 Connect MetaMask'}
        </button>

        <p className="mt-4 text-xs text-gray-500">
          No MetaMask? <a href="https://metamask.io" target="_blank" rel="noreferrer" className="text-vibe-violet underline">Download here</a>
        </p>
      </div>
    </div>
  )
}
