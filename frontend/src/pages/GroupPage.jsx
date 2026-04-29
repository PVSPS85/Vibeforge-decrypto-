import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ExpenseModal from '../components/ExpenseModal'

export default function GroupPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [showModal, setShowModal] = useState(false)
  const [showAddMember, setShowAddMember] = useState(false)
  const [newMemberName, setNewMemberName] = useState('')
  const [paying, setPaying] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)

  // Load expenses from localStorage
  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem(`expenses_group_${id}`)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Load members from localStorage
  const [members, setMembers] = useState(() => {
    try {
      const saved = localStorage.getItem(`members_group_${id}`)
      return saved ? JSON.parse(saved) : ['Pranav']
    } catch {
      return ['Pranav']
    }
  })

  // Load group from localStorage
  const group = (() => {
    try {
      const saved = localStorage.getItem('vibeforge_groups')
      const groups = saved ? JSON.parse(saved) : []
      return groups.find(g => g.id === id) || { name: 'Group', emoji: '🏖️' }
    } catch {
      return { name: 'Group', emoji: '🏖️' }
    }
  })()

  // Calculate balances dynamically from expenses
  const balances = (() => {
    const balanceMap = {}
    members.forEach(member => balanceMap[member] = 0)

    expenses.forEach(exp => {
      const splitCount = exp.split.length
      const share = exp.amount / splitCount
      exp.split.forEach(person => {
        if (person !== exp.paidBy.name) {
          if (balanceMap[person] !== undefined) {
            balanceMap[person] -= share
          }
          if (balanceMap[exp.paidBy.name] !== undefined) {
            balanceMap[exp.paidBy.name] += share
          }
        }
      })
    })

    return members.map((member, index) => ({
      name: member,
      initials: member.split(' ').map(n => n[0]).join('').toUpperCase(),
      color: ['bg-purple-500', 'bg-cyan-500', 'bg-yellow-500', 'bg-green-500'][index % 4],
      owes: Math.round(balanceMap[member] * 100) / 100,
      settled: false
    }))
  })()

  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0)
  const settledCount = balances.filter(b => b.settled).length
  const settledAmount = balances.filter(b => b.settled && b.owes > 0).reduce((s, b) => s + b.owes, 0)
  const settleProgress = totalExpense > 0 ? (settledAmount / totalExpense) * 100 : 0

  const handlePay = async (name) => {
    setPaying(name)
    await new Promise(r => setTimeout(r, 1500))
    setPaying(null)
  }

  const handleSettleAll = async () => {
    setPaying('all')
    await new Promise(r => setTimeout(r, 2000))
    setPaying(null)
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
  }

  const handleAddExpense = (newExpense) => {
    if (!newExpense) return
    const updated = [newExpense, ...expenses]
    setExpenses(updated)
    try {
      localStorage.setItem(`expenses_group_${id}`, JSON.stringify(updated))
    } catch (error) {
      console.error('Error saving expenses:', error)
    }
  }

  const handleAddMember = () => {
    if (!newMemberName.trim()) return
    const updated = [...members, newMemberName.trim()]
    setMembers(updated)
    try {
      localStorage.setItem(`members_group_${id}`, JSON.stringify(updated))
    } catch (error) {
      console.error('Error saving members:', error)
    }
    setNewMemberName('')
    setShowAddMember(false)
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
              {members.length} members · ₹{totalExpense.toLocaleString()} total
            </p>
          </div>
          <div className="flex gap-3">
            <button className="btn-secondary" onClick={() => setShowAddMember(true)}>
              👥 Add Member
            </button>
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              + Add Expense
            </button>
          </div>
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
          members={members}
          onAdded={handleAddExpense}
          onClose={() => setShowModal(false)}
        />
      )}

      {showAddMember && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="glass-card p-8 w-full max-w-md animate-slide-up">
            <h3 className="font-display text-2xl font-bold mb-1">Add Member 👥</h3>
            <p className="text-gray-400 text-sm mb-6">Add someone to the group</p>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block font-semibold uppercase tracking-wide">Member Name</label>
                <input
                  className="w-full bg-vibe-bg border border-vibe-border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-vibe-purple transition-colors"
                  placeholder="e.g. John Doe"
                  value={newMemberName}
                  onChange={e => setNewMemberName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddMember()}
                  autoFocus
                />
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wide">Current Members</p>
                <div className="flex gap-2 flex-wrap">
                  {members.map((member, index) => (
                    <div
                      key={member}
                      className={`w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-xs font-bold text-white`}
                    >
                      {member.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                className="btn-primary flex-1 py-3 disabled:opacity-40"
                onClick={handleAddMember}
                disabled={!newMemberName.trim()}
              >
                Add 👥
              </button>
              <button
                className="btn-secondary flex-1 py-3"
                onClick={() => { setShowAddMember(false); setNewMemberName('') }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
