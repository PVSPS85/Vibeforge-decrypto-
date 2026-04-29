import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { ethers } from 'ethers'

const Web3Context = createContext(null)

export function Web3Provider({ children }) {
  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState(null)
  const [userProfile, setUserProfile] = useState(null)

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
          
          // Ensure user is registered in the backend
          try {
            const res = await fetch('http://localhost:5005/api/users', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: 'User', walletAddress })
            })
            const data = await res.json()
            if (data.success) {
              setUserProfile(data.data)
            }
          } catch (apiErr) {
            console.error('Failed to register user to backend:', apiErr)
          }

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
          // Don't auto fetch profile here, a reload is safer for dapp state
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

      // Ensure user is registered in the backend
      try {
        const res = await fetch('http://localhost:5005/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'User', walletAddress })
        })
        const data = await res.json()
        if (data.success) {
          setUserProfile(data.data)
        }
      } catch (apiErr) {
        console.error('Failed to register user to backend:', apiErr)
      }

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

  return (
    <Web3Context.Provider value={{
      account, provider, signer,
      isConnecting, error, userProfile, setUserProfile,
      connectWallet, disconnectWallet
    }}>
      {children}
    </Web3Context.Provider>
  )
}

export function useWeb3() {
  const ctx = useContext(Web3Context)
  if (!ctx) throw new Error('useWeb3 must be used inside Web3Provider')
  return ctx
}