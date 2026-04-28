import { useState, useEffect } from 'react'
import { useWeb3 } from '../context/Web3Context'

export function useWallet() {
  const { account, connectWallet, disconnectWallet, isConnecting, error } = useWeb3()
  const [balance, setBalance] = useState(null)
  const [chainId, setChainId] = useState(null)

  useEffect(() => {
    if (!window.ethereum) return

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) disconnectWallet()
    }

    const handleChainChanged = () => {
      window.location.reload()
    }

    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainChanged)

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum.removeListener('chainChanged', handleChainChanged)
    }
  }, [disconnectWallet])

  useEffect(() => {
    if (!account || !window.ethereum) return

    const fetchBalance = async () => {
      try {
        const { ethers } = await import('ethers')
        const provider = new ethers.BrowserProvider(window.ethereum)
        const bal = await provider.getBalance(account)
        setBalance(ethers.formatEther(bal))
        const network = await provider.getNetwork()
        setChainId(Number(network.chainId))
      } catch (err) {
        console.error('Balance fetch error:', err)
      }
    }

    fetchBalance()
  }, [account])

  return {
    account,
    balance: balance ? parseFloat(balance).toFixed(4) : null,
    chainId,
    connectWallet,
    disconnectWallet,
    isConnecting,
    error,
    isConnected: !!account,
  }
}
