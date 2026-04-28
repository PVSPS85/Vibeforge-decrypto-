import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GroupCard from '../components/GroupCard'
import LeaderBoard from '../components/LeaderBoard'
import BalanceCard from '../components/BalanceCard'
import { useWeb3 } from '../context/Web3Context'

const DEMO_GROUPS = [
  { id: '1', name: '🏖️ Goa Trip', members: 4, totalExpense: 12400, yourShare: 3100, settled: false, emoji: '🏖️' },
  { id: '2', name: '🍕 Pizza Fridays', members: 3, totalExpense: 2800, yourShare: 0, settled: true, emoji: '🍕' },
  { id: '3', name: '🏠 Flat Expenses', members: 5, totalExpense: 8500, yourShare: 1700, settled: false, emoji: '🏠' },
]

export default function Dashboard() {
  const { account } = useWeb3()
  const navigate = useNavigate()
  const [showNewGroup, setShowNewGroup] = useState(false)
  const [groupName, setGroupName] = useState('')

  const totalOwed = DEMO_GROUPS.filter(g => !g.settled).reduce((sum, g) => sum + g.yourShare, 0)

  return (
    <div className="min-h-screen bg-vibe-bg bg-grid px-4 md:px-8 py-8 pt-24">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-bold">
              Hey, <span className="gradient-text">Splitter</span> 👋
            </h1>
            <p className="text-gray-400 mt-1 text-sm">
              {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Demo Mode'}
            </p>
          </div>
          <button className="btn-primary" onClick={() => setShowNewGroup(true)}>
            + New Group
          </button>
        </div>

        {/* Balance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <BalanceCard label="You Owe" amount={totalOwed} color="pink" icon="📤" />
          <BalanceCard label="Owed to You" amount={4200} color="green" icon="📥" />
          <BalanceCard label="Total Settled" amount={28000} color="cyan" icon="✅" />
        </div>

        {/* Groups + Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Groups list */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-xl font-semibold mb-4 text-gray-200">Your Groups</h2>
            <div className="space-y-4">
              {DEMO_GROUPS.map(group => (
                <GroupCard
                  key={group.id}
                  group={group}
                  onClick={() => navigate(`/group/${group.id}`)}
                />
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div>
            <h2 className="font-display text-xl font-semibold mb-4 text-gray-200">🏆 Top Settlers</h2>
            <LeaderBoard />
          </div>
        </div>

        {/* New Group Modal */}
        {showNewGroup && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
            <div className="glass-card p-8 w-full max-w-md animate-slide-up">
              <h3 className="font-display text-2xl font-bold mb-6">Create New Group</h3>
              <input
                className="w-full bg-vibe-bg border border-vibe-border rounded-xl px-4 py-3 text-white placeholder-gray-500 mb-4 focus:outline-none focus:border-vibe-purple"
                placeholder="e.g. 🏕️ Coorg Trip"
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
              />
              <div className="flex gap-3">
                <button className="btn-primary flex-1" onClick={() => setShowNewGroup(false)}>
                  Create Group
                </button>
                <button className="btn-secondary flex-1" onClick={() => setShowNewGroup(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}