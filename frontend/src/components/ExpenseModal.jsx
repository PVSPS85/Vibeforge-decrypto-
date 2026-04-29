import { useState } from 'react'

const MEMBERS = [
  { name: 'Pranav', initials: 'PR', color: 'bg-purple-500' },
  { name: 'Rahul', initials: 'RA', color: 'bg-cyan-500' },
  { name: 'Sneha', initials: 'SN', color: 'bg-pink-500' },
  { name: 'Arjun', initials: 'AR', color: 'bg-yellow-500' },
]

const CATEGORIES = ['🍕 Food', '🏠 Home', '✈️ Travel', '🎮 Fun', '💡 Bills', '🛒 Shopping']
const COLOR_OPTIONS = ['bg-purple-500', 'bg-cyan-500', 'bg-pink-500', 'bg-yellow-500', 'bg-green-500']

export default function ExpenseModal({ groupId, onAdded, onClose, members }) {
  // Convert members prop to objects if provided, otherwise use fallback
  const membersList = members && members.length > 0
    ? members.map((userObj, index) => ({
        name: userObj.displayName || 'Unknown',
        walletAddress: userObj.walletAddress || `mock-${index}`,
        initials: (userObj.displayName || 'U').slice(0, 2).toUpperCase(),
        color: COLOR_OPTIONS[index % COLOR_OPTIONS.length]
      }))
    : MEMBERS

  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [paidBy, setPaidBy] = useState(membersList[0]?.walletAddress || membersList[0]?.name)
  const [splitAmong, setSplitAmong] = useState(membersList.map(m => m.walletAddress || m.name))
  const [category, setCategory] = useState('🍕 Food')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const toggleMember = (id) => {
    setSplitAmong(prev =>
      prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]
    )
  }

  const perPerson = splitAmong.length > 0 && amount
    ? (parseFloat(amount) / splitAmong.length).toFixed(2)
    : '0.00'

  const handleSubmit = async () => {
    if (!title || !amount || splitAmong.length === 0) return
    setLoading(true)

    try {
      const res = await fetch('http://localhost:5005/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          amount: parseFloat(amount),
          category,
          paidBy,
          groupId,
          participants: splitAmong
        })
      })
      const data = await res.json()
      
      if (data.success) {
        setDone(true)
        if (onAdded) onAdded(data.data)
        setTimeout(() => onClose(), 1800)
      }
    } catch (err) {
      console.error("Failed to add expense", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="glass-card p-8 w-full max-w-md animate-slide-up max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-display text-2xl font-bold">Add Expense ✨</h3>
            <p className="text-gray-400 text-xs mt-1">Split it fairly, on-chain</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">×</button>
        </div>

        {done ? (
          <div className="text-center py-8">
            <p className="text-6xl mb-4">🎉</p>
            <p className="font-display text-2xl font-bold gradient-text">Expense Added!</p>
            <p className="text-gray-400 text-sm mt-2">+50 XP earned ⚡</p>
          </div>
        ) : (
          <div className="space-y-5">

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

            <div>
              <label className="text-xs text-gray-400 mb-1.5 block font-semibold uppercase tracking-wide">Paid By</label>
              <div className="flex gap-2">
                {membersList.map(m => {
                  const id = m.walletAddress || m.name
                  const isSelected = paidBy === id
                  return (
                    <button
                      key={id}
                      onClick={() => setPaidBy(id)}
                      className={`flex flex-col items-center gap-1 transition-all ${isSelected ? 'scale-110' : 'opacity-50 hover:opacity-75'}`}
                    >
                      <div className={`w-10 h-10 rounded-full ${m.color} flex items-center justify-center text-xs font-bold text-white border-2 ${isSelected ? 'border-white' : 'border-transparent'}`}>
                        {m.initials}
                      </div>
                      <span className="text-xs text-gray-400">{m.name.slice(0, 8)}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1.5 block font-semibold uppercase tracking-wide">
                Split Among ({splitAmong.length} people · ₹{perPerson} each)
              </label>
              <div className="flex gap-2">
                {membersList.map(m => {
                  const id = m.walletAddress || m.name
                  const isSelected = splitAmong.includes(id)
                  return (
                    <button
                      key={id}
                      onClick={() => toggleMember(id)}
                      className={`flex flex-col items-center gap-1 transition-all ${isSelected ? 'scale-110' : 'opacity-40 hover:opacity-60'}`}
                    >
                      <div className={`w-10 h-10 rounded-full ${m.color} flex items-center justify-center text-xs font-bold text-white border-2 ${isSelected ? 'border-white' : 'border-transparent'}`}>
                        {m.initials}
                      </div>
                      <span className="text-xs text-gray-400">{m.name.slice(0, 8)}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {amount && splitAmong.length > 0 && (
              <div className="rounded-xl bg-vibe-purple/10 border border-vibe-purple/20 px-4 py-3">
                <p className="text-sm text-vibe-violet font-semibold">
                  ₹{perPerson} per person across {splitAmong.length} people
                </p>
              </div>
            )}

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

