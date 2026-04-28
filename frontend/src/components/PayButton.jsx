import { useState } from 'react'
import { useWeb3 } from '../context/Web3Context'

export default function PayButton({ amount, toName }) {
  const { signer, account } = useWeb3()
  const [status, setStatus] = useState('idle')

  const handlePay = async () => {
    if (!signer) {
      setStatus('nowallet')
      return
    }

    try {
      setStatus('loading')
      await new Promise(r => setTimeout(r, 1500))
      setStatus('done')
    } catch (err) {
      console.error(err)
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
