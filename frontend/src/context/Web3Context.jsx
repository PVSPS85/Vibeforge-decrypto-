import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { ethers } from 'ethers'

const Web3Context = createContext(null)

export function Web3Provider({ children }) {
  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState(null)

  // Only auto-reconnect if user previously connected
  useEffect(() => {
    const tryAutoConnect = async () => {
      if (!window.ethereum) return
      try {
        const _provider = new ethers.BrowserProvider(window.ethereum)
        const accounts = await _provider.send('eth_accounts', [])
        if (accounts.length > 0) {
          const _signer = await _provider.getSigner()
          setProvider(_provider)
          setSigner(_signer)
          setAccount(accounts[0])
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
        } else {
          setAccount(accounts[0])
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
      setProvider(_provider)
      setSigner(_signer)
      setAccount(accounts[0])
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
  }, [])

  return (
    <Web3Context.Provider value={{
      account, provider, signer,
      isConnecting, error,
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