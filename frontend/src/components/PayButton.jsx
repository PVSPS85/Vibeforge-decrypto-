import { useState } from 'react'
import { ethers } from 'ethers'
import { useWeb3 } from '../context/Web3Context'
import { CONTRACT_ABI } from '../constants/contractABI'
import { getContractAddress } from '../constants/contractAddress'

export default function PayButton({ amount, toName }) {
  const { account } = useWeb3()
  const [status, setStatus] = useState('idle')

  const handlePay = async () => {
    if (!window.ethereum) {
      console.log('MetaMask not available')
      setStatus('nowallet')
      return
    }

    try {
      setStatus('loading')
      await window.ethereum.request({ method: 'eth_requestAccounts' })

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const network = await provider.getNetwork()
      const contractAddress = getContractAddress(network.chainId)

      if (!contractAddress) {
        throw new Error('Contract address not found for current network')
      }

      const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, signer)
      const recipient = toName || (await signer.getAddress())
      const transaction = await contract.settleDebt(recipient, {
        value: BigInt(amount),
      })

      await transaction.wait()
      setStatus('done')
    } catch (err) {
      console.log(err)
      setStatus('error')
    }
  }

  if (status === 'done') return <span className="text-xs text-vibe-green font-semibold">✅ Paid!</span>

  return (
    <button
      onClick={handlePay}
      disabled={status === 'loading'}
      className="mt-1 px-3 py-1 rounded-lg bg-vibe-purple/20 border border-vibe-purple/30 text-vibe-violet text-xs font-semibold hover:bg-vibe-purple/30 transition-all"
    >
      {status === 'loading' ? '⏳...' : `Pay ₹${amount}`}
    </button>
  )
}
