import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ExpenseModal from '../components/ExpenseModal'

const INITIAL_BALANCES = [
  { name: 'Rahul', initials: 'RA', color: 'bg-cyan-500', owes: 1500, settled: false },
  { name: 'Sneha', initials: 'SN', color: 'bg-pink-500', owes: -800, settled: false },
  { name: 'Arjun', initials: 'AR', color: 'bg-yellow-500', owes: 600, settled: false },
]

const DEMO_EXPENSES = [
  { _id: '1', title: 'Hotel Booking', amount: 6000, paidBy: { name: 'Pranav' }, split: ['Pranav','Rahul','Sneha','Arjun'], createdAt: '2026-04-20' },
  { _id: '2', title: 'Dinner at Shack', amount: 2400, paidBy: { name: 'Rahul' }, split: ['Pranav','Rahul','Sneha','Arjun'], createdAt: '2026-04-21' },
]

export default function GroupPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [balances, setBalances] = useState(INITIAL_BALANCES)
  const [paying, setPaying] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)

  // Expenses persist in localStorage per group
  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem(`expenses_group_${id}`)
      return saved ? JSON.parse(saved) : DEMO_EXPENSES
    } catch { return DEMO_EXPENSES }
  })

  // Load group info from localStorage
  const [group] = useState(() => {
    try {
      const saved = localStorage.getItem('vibeforge_groups')
      const groups = saved ? JSON.parse(saved) : []
      return groups.find(g => g.id === id) || { name: 'Group', emoji: '🏖️', members: [] }
    } catch { return { name: 'Group', emoji: '🏖️', members: [] } }
  })

  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0)
  const settledCount = balances.filter(b => b.settled).length
  const settledAmount = balances.filter(b => b.settled && b.owes > 0).reduce((s, b) => s + b.owes, 0)
  const settleProgress = totalExpense > 0 ? (settledAmount / totalExpense) * 100 : 0

  const handlePay = async (name) => {
    setPaying(name)
    await new Promise(r => setTimeout(r, 1500))
    setBalances(prev => prev.map(b => b.name === name ? { ...b, settled: true } : b))
    setPaying(null)
  }

  const handleSettleAll = async () => {
    setPaying('all')
    await new Promise(r => setTimeout(r, 2000))
    setBalances(prev => prev.map(b => ({ ...b, settled: true })))
    setPaying(null)
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
  }

  const handleAddExpense = (newExpense) => {
    if (!newExpense) return
    setExpenses(prev => {
      const updated = [newExpense, ...prev]
      localStorage.setItem(`expenses_group_${id}`, JSON.stringify(updated))
      return updated
    })
  }

  return (
    <div className="min-h-screen bg-vibe-bg bg-grid px-4 md:px-8 py-8 pt-24">

      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          <div className="text-center animate-slide-up">
            <p className="text-8xl mb-4">🎉</p>
            <p className="font-display text-4xl font-bold gradient-text">All Settled!</p>
            <p className="text-gray-400 mt-2">+500 XP earned ⚡</p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">

        <button
          onClick={() => navigate('/dashboard')}
          className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 text-sm transition-colors"
        >
          ← Back to Dashboard
        </button>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-4xl font-bold">
              {group.emoji} {group.name}
            </h1>
            <p className="text-gray-400 mt-1 text-sm">
              4 members · ₹{totalExpense.toLocaleString()} total
            </p>
          </div>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            + Add Expense
          </button>
        </div>

        {/* Progress */}
        <div className="glass-card p-5 mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="font-display font-semibold text-white">⚡ Settlement Progress</p>
            <p className="text-vibe-cyan text-sm font-bold">{settleProgress.toFixed(0)}% done</p>
          </div>
          <div className="h-3 rounded-full bg-vibe-border overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${settleProgress}%`, background: 'linear-gradient(90deg, #7c3aed, #06b6d4)' }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {settledCount} of {balances.length} people settled · ₹{settledAmount.toLocaleString()} paid back
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Expenses */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="font-display text-xl font-semibold text-gray-200 mb-4">💸 Expenses</h2>
            {expenses.length === 0 ? (
              <div className="glass-card p-8 text-center text-gray-400">
                No expenses yet. Add one! 💸
              </div>
            ) : (
              expenses.map(exp => {
                const paidByName = exp.paidBy?.name || exp.paidBy || 'Unknown'
                const dateLabel = exp.createdAt ? new Date(exp.createdAt).toLocaleDateString() : '—'
                const itemCount = Array.isArray(exp.split) ? exp.split.length : 0
                const perPerson = itemCount ? (exp.amount / itemCount).toFixed(0) : '0'
                return (
                  <div key={exp._id} className="glass-card p-5 flex items-center justify-between hover:border-vibe-purple/40 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-vibe-purple flex items-center justify-center text-xs font-bold text-white">
                        {paidByName[0] || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{exp.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Paid by {paidByName} · {dateLabel} · {itemCount} people
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-xl font-bold text-vibe-violet">
                        ₹{exp.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">₹{perPerson} each</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Balances */}
          <div>
            <h2 className="font-display text-xl font-semibold text-gray-200 mb-4">🤝 Who Owes Whom</h2>
            <div className="glass-card p-5 space-y-4 mb-4">
              {balances.map(b => (
                <div key={b.name} className={`transition-all duration-300 ${b.settled ? 'opacity-50' : ''}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full ${b.color} flex items-center justify-center text-xs font-bold text-white`}>
                        {b.initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{b.name}</p>
                        <p className={`text-xs font-bold ${b.owes > 0 ? 'text-red-400' : 'text-green-400'}`}>
                          {b.settled
                            ? '✅ Settled'
                            : b.owes > 0
                            ? `owes ₹${b.owes}`
                            : `gets ₹${Math.abs(b.owes)}`}
                        </p>
                      </div>
                    </div>
                    {b.owes > 0 && !b.settled && (
                      <button
                        onClick={() => handlePay(b.name)}
                        disabled={paying !== null}
                        className="px-3 py-1.5 rounded-xl bg-vibe-purple/20 border border-vibe-purple/30 text-vibe-violet text-xs font-bold hover:bg-vibe-purple/40 transition-all disabled:opacity-50"
                      >
                        {paying === b.name ? '⏳...' : `Pay ₹${b.owes}`}
                      </button>
                    )}
                  </div>
                  {b.owes > 0 && (
                    <div className="h-1 rounded-full bg-vibe-border overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: b.settled ? '100%' : '0%',
                          background: b.settled ? '#10b981' : '#7c3aed'
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={handleSettleAll}
              disabled={paying !== null || balances.every(b => b.settled)}
              className="btn-primary w-full py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {paying === 'all'
                ? '⏳ Settling...'
                : balances.every(b => b.settled)
                ? '✅ All Settled!'
                : '⚡ Settle All On-Chain'}
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <ExpenseModal
          groupId={id}
          onAdded={handleAddExpense}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}