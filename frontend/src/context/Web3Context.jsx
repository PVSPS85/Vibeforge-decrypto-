import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { ethers } from 'ethers'

function ProfileOnboardingModal({ walletAddress, onComplete }) {
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!name.trim()) return
    setSaving(true)
    try {
      // First try POST (creates new user or returns existing)
      const res = await fetch('http://localhost:5005/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), walletAddress })
      })
      const data = await res.json()
      if (data.success) {
        let profile = data.data
        // If user already existed, update their displayName via PUT
        if (!data.isNewUser) {
          const putRes = await fetch(`http://localhost:5005/api/users/${walletAddress}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ displayName: name.trim() })
          })
          const putData = await putRes.json()
          if (putData.success) profile = putData.data
        }
        onComplete(profile)
      } else {
        alert(data.error)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center px-4">
      <div className="bg-vibe-card border border-vibe-border p-8 rounded-2xl w-full max-w-md animate-slide-up shadow-2xl">
        <h3 className="font-display text-2xl font-bold mb-2 text-white">Welcome to SmartSplit ⚡</h3>
        <p className="text-gray-400 text-sm mb-6">Choose a display name so your friends can recognize you. You'll get a unique App UID!</p>
        
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Display Name</label>
        <input 
          className="w-full bg-vibe-bg border border-vibe-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-vibe-purple transition-colors mb-6"
          placeholder="e.g. Satoshi"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          autoFocus
        />
        
        <button 
          onClick={handleSave} 
          disabled={!name.trim() || saving}
          className="w-full bg-vibe-purple hover:bg-vibe-violet text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
        >
          {saving ? 'Creating Profile...' : 'Start Splitting 🚀'}
        </button>
      </div>
    </div>
  )
}

const Web3Context = createContext(null)

export function Web3Provider({ children }) {
  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  
  // Keep a ref to the current wallet so refreshProfile never has stale closure
  const accountRef = useRef(null)

  const [needsOnboarding, setNeedsOnboarding] = useState(false)
  const [pendingWallet, setPendingWallet] = useState(null)

  // Sync accountRef whenever account changes
  useEffect(() => {
    accountRef.current = account
  }, [account])

  const handleAuth = async (walletAddress) => {
    try {
      const res = await fetch(`http://localhost:5005/api/users/${walletAddress}`)
      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          const profile = data.data
          // Check if user has a real display name or is a legacy/placeholder
          const placeholders = ['unnamed', 'user', '']
          const hasRealName = profile.displayName && !placeholders.includes(profile.displayName.toLowerCase().trim())
          
          if (hasRealName) {
            setUserProfile(profile)
            return
          }
          // Legacy user with placeholder name — let them set a real name
          // Store the profile so the onboarding modal can update it
          setUserProfile(profile)
          setPendingWallet(walletAddress)
          setNeedsOnboarding(true)
          return
        }
      }
      // If user doesn't exist at all, prompt for name
      setPendingWallet(walletAddress)
      setNeedsOnboarding(true)
    } catch (err) {
      console.error('Failed to auth user:', err)
    }
  }

  // Only auto-reconnect if user previously connected
  useEffect(() => {
    const tryAutoConnect = async () => {
      if (!window.ethereum) return
      try {
        const _provider = new ethers.BrowserProvider(window.ethereum)
        const accounts = await _provider.send('eth_accounts', [])
        if (accounts.length > 0) {
          const _signer = await _provider.getSigner()
          const walletAddress = accounts[0]
          await handleAuth(walletAddress)

          setProvider(_provider)
          setSigner(_signer)
          setAccount(walletAddress)
        }
        // If no accounts, stay on connect page — don't redirect
      } catch (e) {
        console.log('Auto-connect skipped', e)
      }
    }
    tryAutoConnect()

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          setAccount(null)
          setProvider(null)
          setSigner(null)
          setUserProfile(null)
        } else {
          setAccount(accounts[0])
          handleAuth(accounts[0])
        }
      })
    }
  }, [])

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      setError('MetaMask not found. Please install it.')
      return
    }
    try {
      setIsConnecting(true)
      setError(null)
      const _provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await _provider.send('eth_requestAccounts', [])
      const _signer = await _provider.getSigner()
      const walletAddress = accounts[0]

      await handleAuth(walletAddress)

      setProvider(_provider)
      setSigner(_signer)
      setAccount(walletAddress)
    } catch (err) {
      setError('Connection rejected. Please try again.')
    } finally {
      setIsConnecting(false)
    }
  }, [])

  const disconnectWallet = useCallback(() => {
    setAccount(null)
    setProvider(null)
    setSigner(null)
    setUserProfile(null)
  }, [])

  // Re-fetch user profile from backend (call after XP-granting actions)
  const refreshProfile = useCallback(async (walletOverride) => {
    const addr = walletOverride || accountRef.current
    if (!addr) return
    try {
      const res = await fetch(`http://localhost:5005/api/users/${addr}`)
      const data = await res.json()
      if (data.success) setUserProfile(data.data)
    } catch (e) {
      console.warn('refreshProfile failed:', e)
    }
  }, [])

  return (
    <Web3Context.Provider value={{
      account, provider, signer,
      isConnecting, error, userProfile, setUserProfile,
      connectWallet, disconnectWallet, refreshProfile
    }}>
      {children}
      {needsOnboarding && pendingWallet && (
        <ProfileOnboardingModal 
          walletAddress={pendingWallet} 
          onComplete={(profile) => {
            setUserProfile(profile)
            setNeedsOnboarding(false)
            setPendingWallet(null)
          }} 
        />
      )}
    </Web3Context.Provider>
  )
}

export function useWeb3() {
  const ctx = useContext(Web3Context)
  if (!ctx) throw new Error('useWeb3 must be used inside Web3Provider')
  return ctx
}