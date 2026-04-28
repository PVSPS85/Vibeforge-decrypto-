import { useState } from 'react'

const MEMBERS = ['Pranav', 'Rahul', 'Sneha', 'Arjun']

export default function ExpenseModal({ onClose }) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [paidBy, setPaidBy] = useState('Pranav')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!title || !amount) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="glass-card p-8 w-full max-w-md animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-2xl font-bold">Add Expense</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">×</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Expense Title</label>
            <input
              className="w-full bg-vibe-bg border border-vibe-border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-vibe-purple"
              placeholder="e.g. Hotel booking"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Amount (₹)</label>
            <input
              type="number"
              className="w-full bg-vibe-bg border border-vibe-border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-vibe-purple"
              placeholder="0"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Paid By</label>
            <select
              className="w-full bg-vibe-bg border border-vibe-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-vibe-purple"
              value={paidBy}
              onChange={e => setPaidBy(e.target.value)}
            >
              {MEMBERS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              className="btn-primary flex-1 py-4"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? '⏳ Adding...' : '+ Add Expense'}
            </button>
            <button className="btn-secondary flex-1 py-4" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
