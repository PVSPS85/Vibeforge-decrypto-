import { useState } from 'react'

const MEMBERS = [
  { name: 'Pranav', initials: 'PR', color: 'bg-purple-500' },
  { name: 'Rahul', initials: 'RA', color: 'bg-cyan-500' },
  { name: 'Sneha', initials: 'SN', color: 'bg-pink-500' },
  { name: 'Arjun', initials: 'AR', color: 'bg-yellow-500' },
]

const CATEGORIES = ['🍕 Food', '🏠 Home', '✈️ Travel', '🎮 Fun', '💡 Bills', '🛒 Shopping']

export default function ExpenseModal({ onClose }) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [paidBy, setPaidBy] = useState('Pranav')
  const [splitAmong, setSplitAmong] = useState(['Pranav', 'Rahul', 'Sneha', 'Arjun'])
  const [category, setCategory] = useState('🍕 Food')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const toggleMember = (name) => {
    setSplitAmong(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    )
  }

  const perPerson = splitAmong.length > 0 && amount
    ? (parseFloat(amount) / splitAmong.length).toFixed(2)
    : '0.00'

  const handleSubmit = async () => {
    if (!title || !amount || splitAmong.length === 0) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    setDone(true)
    await new Promise(r => setTimeout(r, 1000))
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="glass-card p-8 w-full max-w-md animate-slide-up max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-display text-2xl font-bold">Add Expense ✨</h3>
            <p className="text-gray-400 text-xs mt-1">Split it fairly, on-chain</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none transition-colors">×</button>
        </div>

        {done ? (
          <div className="text-center py-8">
            <p className="text-6xl mb-4">🎉</p>
            <p className="font-display text-2xl font-bold gradient-text">Expense Added!</p>
            <p className="text-gray-400 text-sm mt-2">+50 XP earned ⚡</p>
          </div>
        ) : (
          <div className="space-y-5">

            {/* Title */}
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block font-semibold uppercase tracking-wide">What was it?</label>
              <input
                className="w-full bg-vibe-bg border border-vibe-border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-vibe-purple transition-colors"
                placeholder="e.g. Hotel booking, Dinner..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                autoFocus
              />
            </div>

            {/* Amount */}
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block font-semibold uppercase tracking-wide">Amount (₹)</label>
              <input
                type="number"
                className="w-full bg-vibe-bg border border-vibe-border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-vibe-purple transition-colors text-xl font-display font-bold"
                placeholder="0"
                value={amount}
                onChange={e => setAmount(e.target.value)}
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block font-semibold uppercase tracking-wide">Category</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                      category === cat
                        ? 'bg-vibe-purple text-white font-semibold'
                        : 'bg-vibe-border text-gray-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Paid By */}
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block font-semibold uppercase tracking-wide">Paid By</label>
              <div className="flex gap-2">
                {MEMBERS.map(m => (
                  <button
                    key={m.name}
                    onClick={() => setPaidBy(m.name)}
                    className={`flex flex-col items-center gap-1 transition-all ${paidBy === m.name ? 'scale-110' : 'opacity-50 hover:opacity-75'}`}
                  >
                    <div className={`w-10 h-10 rounded-full ${m.color} flex items-center justify-center text-xs font-bold text-white border-2 ${paidBy === m.name ? 'border-white' : 'border-transparent'}`}>
                      {m.initials}
                    </div>
                    <span className="text-xs text-gray-400">{m.name.slice(0, 4)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Split Among */}
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block font-semibold uppercase tracking-wide">
                Split Among ({splitAmong.length} people · ₹{perPerson} each)
              </label>
              <div className="flex gap-2">
                {MEMBERS.map(m => (
                  <button
                    key={m.name}
                    onClick={() => toggleMember(m.name)}
                    className={`flex flex-col items-center gap-1 transition-all ${splitAmong.includes(m.name) ? 'scale-110' : 'opacity-40 hover:opacity-60'}`}
                  >
                    <div className={`w-10 h-10 rounded-full ${m.color} flex items-center justify-center text-xs font-bold text-white border-2 ${splitAmong.includes(m.name) ? 'border-white' : 'border-transparent'}`}>
                      {m.initials}
                    </div>
                    <span className="text-xs text-gray-400">{m.name.slice(0, 4)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Per person preview */}
            {amount && splitAmong.length > 0 && (
              <div className="rounded-xl bg-vibe-purple/10 border border-vibe-purple/20 px-4 py-3">
                <p className="text-sm text-vibe-violet font-semibold">
                  ₹{perPerson} per person across {splitAmong.length} people
                </p>
              </div>
            )}

            {/* Submit */}
            <div className="flex gap-3 pt-1">
              <button
                className="btn-primary flex-1 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={loading || !title || !amount || splitAmong.length === 0}
              >
                {loading ? '⏳ Adding...' : '+ Add Expense'}
              </button>
              <button className="btn-secondary flex-1 py-4" onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
