import { useNavigate } from 'react-router-dom'
import { useWeb3 } from '../context/Web3Context'
import { useEffect, useState } from 'react'

export default function ConnectPage() {
  const { connectWallet, account, isConnecting, error } = useWeb3()
  const navigate = useNavigate()
  const [noMetaMask, setNoMetaMask] = useState(false)

  useEffect(() => {
    if (!window.ethereum) setNoMetaMask(true)
  }, [])

  // Only redirect AFTER user explicitly connected
  useEffect(() => {
    if (account) navigate('/dashboard')
  }, [account])

  const handleConnect = async () => {
    await connectWallet()
  }



  return (
    <div className="relative min-h-screen bg-vibe-bg bg-grid flex items-center justify-center px-6 overflow-hidden">

      <div className="blob absolute top-10 right-20 w-80 h-80 bg-vibe-purple" />
      <div className="blob absolute bottom-10 left-20 w-64 h-64 bg-vibe-cyan" style={{ animationDelay: '3s' }} />

      <div className="relative z-10 glass-card p-10 max-w-md w-full text-center animate-slide-up">

        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-vibe-purple to-vibe-cyan flex items-center justify-center text-4xl glow-purple">
          🦊
        </div>

        <h2 className="font-display text-4xl font-bold mb-3">
          Connect Your <span className="gradient-text">Wallet</span>
        </h2>
        <p className="text-gray-400 mb-8">
          Link your MetaMask to start splitting expenses on-chain.
        </p>

        {/* Steps */}
        <div className="text-left mb-8 space-y-3">
          {[
            { step: '1', text: 'Click Connect MetaMask below' },
            { step: '2', text: 'Approve in MetaMask popup' },
            { step: '3', text: 'Start splitting!' },
          ].map(({ step, text }) => (
            <div key={step} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-vibe-purple text-white flex items-center justify-center text-xs font-bold">
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

        {noMetaMask && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm">
            ⚠️ MetaMask not detected. Use demo mode below or{' '}
            <a href="https://metamask.io" target="_blank" rel="noreferrer" className="underline">install MetaMask</a>.
          </div>
        )}

        <button
          className="btn-primary w-full text-lg py-4 mb-3"
          onClick={handleConnect}
          disabled={isConnecting}
        >
          {isConnecting ? '⏳ Connecting...' : '🦊 Connect MetaMask'}
        </button>

        <div className="mt-4 p-3 rounded-xl bg-vibe-purple/10 border border-vibe-purple/30 text-vibe-violet text-sm">
           MetaMask is required to use SmartSplit.
        </div>

        <p className="mt-4 text-xs text-gray-500">
          No MetaMask?{' '}
          <a href="https://metamask.io" target="_blank" rel="noreferrer" className="text-vibe-violet underline">
            Download here
          </a>
        </p>
      </div>
    </div>
  )
}