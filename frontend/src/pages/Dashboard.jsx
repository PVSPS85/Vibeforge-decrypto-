import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWeb3 } from '../context/Web3Context'

const INITIAL_GROUPS = [
  {
    id: '1',
    name: 'House Squad',
    emoji: '🏠',
    tag: 'Home',
    tagColor: 'bg-purple-500/20 text-purple-300',
    members: ['AK', 'PS', 'JT', 'GW'],
    memberColors: ['bg-purple-500', 'bg-cyan-500', 'bg-yellow-500', 'bg-green-500'],
    totalExpense: 180,
    settled: 137.5,
    yourBalance: -42.50,
    memberCount: 4,
  },
  {
    id: '2',
    name: 'Weekend Crew',
    emoji: '🎮',
    tag: 'Fun',
    tagColor: 'bg-yellow-500/20 text-yellow-300',
    members: ['MR', 'CL', 'AK', 'DP', '+1'],
    memberColors: ['bg-pink-500', 'bg-cyan-400', 'bg-orange-400', 'bg-red-400', 'bg-gray-500'],
    totalExpense: 250,
    settled: 182.8,
    yourBalance: 67.20,
    memberCount: 5,
  },
]

export default function Dashboard() {
  const { account } = useWeb3()
  const navigate = useNavigate()
  const [groups, setGroups] = useState(INITIAL_GROUPS)
  const [showNewGroup, setShowNewGroup] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [groupTag, setGroupTag] = useState('Fun')

  const xp = 2840
  const maxXp = 3500
  const level = 7
  const youOwe = 57.50
  const youGetBack = 89.20
  const netBalance = youGetBack - youOwe

  const handleCreateGroup = () => {
    if (!groupName.trim()) return
    const newGroup = {
      id: Date.now().toString(),
      name: groupName,
      emoji: '✨',
      tag: groupTag,
      tagColor: 'bg-cyan-500/20 text-cyan-300',
      members: ['YO'],
      memberColors: ['bg-purple-500'],
      totalExpense: 0,
      settled: 0,
      yourBalance: 0,
      memberCount: 1,
    }
    setGroups(prev => [...prev, newGroup])
    setGroupName('')
    setShowNewGroup(false)
  }

  return (
    <div className="min-h-screen bg-vibe-bg bg-grid px-4 md:px-8 py-8 pt-24">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-display text-4xl font-extrabold text-white">Quest Dashboard</h1>
              <span className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-xs font-bold">
                ⚡ Level {level}
              </span>
            </div>
            <p className="text-gray-400 text-sm">Your financial adventure awaits 👋</p>
          </div>
          <button
            className="btn-primary flex items-center gap-2"
            onClick={() => setShowNewGroup(true)}
          >
            + Add Expense
          </button>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="glass-card p-6" style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.2)' }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-400 text-sm">You Owe</p>
              <span className="text-red-400 text-lg">↘</span>
            </div>
            <p className="font-display text-3xl font-bold text-red-400">₹{youOwe.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">Across 2 groups</p>
          </div>
          <div className="glass-card p-6" style={{ background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.2)' }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-400 text-sm">You Get Back</p>
              <span className="text-green-400 text-lg">↗</span>
            </div>
            <p className="font-display text-3xl font-bold text-green-400">₹{youGetBack.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">From 3 friends</p>
          </div>
          <div className="glass-card p-6" style={{ background: 'rgba(124,58,237,0.08)', borderColor: 'rgba(124,58,237,0.2)' }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-400 text-sm">Net Balance</p>
              <span className="text-purple-400 text-lg">—</span>
            </div>
            <p className="font-display text-3xl font-bold text-purple-400">+₹{netBalance.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">Looking good! 🎉</p>
          </div>
        </div>

        {/* XP Bar */}
        <div className="glass-card p-5 mb-8">
          <div className="flex items-center justify-between mb-3">
            <p className="font-display font-semibold text-white flex items-center gap-2">
              ⚡ XP Progress — Level {level}
            </p>
            <p className="text-yellow-400 font-bold text-sm font-mono">{xp.toLocaleString()} / {maxXp.toLocaleString()} XP</p>
          </div>
          <div className="h-3 rounded-full bg-vibe-border overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${(xp / maxXp) * 100}%`,
                background: 'linear-gradient(90deg, #7c3aed, #06b6d4)'
              }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">{maxXp - xp} XP to Level {level + 1} — Keep splitting! ⚡</p>
        </div>

        {/* Groups + Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold text-white">🎮 Your Groups</h2>
              <button
                onClick={() => setShowNewGroup(true)}
                className="text-vibe-violet text-sm hover:text-white transition-colors"
              >
                New Group +
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groups.map(group => (
                <div
                  key={group.id}
                  onClick={() => navigate(`/group/${group.id}`)}
                  className="glass-card p-5 cursor-pointer hover:border-vibe-purple/50 transition-all duration-200 hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-display font-bold text-white text-lg">{group.emoji} {group.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${group.tagColor}`}>
                        {group.tag}
                      </span>
                    </div>
                    <p className={`font-display font-bold text-lg ${group.yourBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {group.yourBalance >= 0 ? '+' : ''}₹{group.yourBalance.toFixed(2)}
                    </p>
                  </div>

                  {/* Member avatars */}
                  <div className="flex gap-1 mb-3">
                    {group.members.map((m, i) => (
                      <div
                        key={i}
                        className={`w-8 h-8 rounded-full ${group.memberColors[i]} flex items-center justify-center text-xs font-bold text-white border-2 border-vibe-bg`}
                      >
                        {m}
                      </div>
                    ))}
                  </div>

                  {/* Settlement progress */}
                  <div className="h-1.5 rounded-full bg-vibe-border overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(group.settled / group.totalExpense) * 100}%`,
                        background: 'linear-gradient(90deg, #7c3aed, #06b6d4)'
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Settled ₹{group.settled}</span>
                    <span>Total ₹{group.totalExpense}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">👥 {group.memberCount} members ↗</p>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div>
            <h2 className="font-display text-xl font-bold text-white mb-4">🏆 Leaderboard</h2>
            <div className="glass-card p-5 space-y-4">
              {[
                { rank: 1, initials: 'PS', name: 'Priya S', title: '⚡ Debt Crusher', xp: '2.8k', color: 'bg-pink-500' },
                { rank: 2, initials: 'MR', name: 'Maya R', title: '🚀 Fast Payer', xp: '2.2k', color: 'bg-cyan-500' },
                { rank: 3, initials: 'AK', name: 'Alex Kim', title: '🏆 Group Hero', xp: '2.0k', color: 'bg-orange-400' },
                { rank: 4, initials: 'JT', name: 'Jordan T', title: '⭐ Rising Star', xp: '1.5k', color: 'bg-yellow-500' },
              ].map(p => (
                <div key={p.rank} className="flex items-center gap-3">
                  <span className="text-gray-400 font-bold w-4 text-sm">{p.rank}</span>
                  <div className={`w-9 h-9 rounded-full ${p.color} flex items-center justify-center text-xs font-bold text-white`}>
                    {p.initials}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.title}</p>
                  </div>
                  <p className="text-sm font-bold text-vibe-violet">{p.xp}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* New Group Modal */}
      {showNewGroup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="glass-card p-8 w-full max-w-md animate-slide-up">
            <h3 className="font-display text-2xl font-bold mb-2">New Group ✨</h3>
            <p className="text-gray-400 text-sm mb-6">Create a group to start splitting</p>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Group Name</label>
                <input
                  className="w-full bg-vibe-bg border border-vibe-border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-vibe-purple"
                  placeholder="e.g. 🏕️ Coorg Trip"
                  value={groupName}
                  onChange={e => setGroupName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreateGroup()}
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-2 block">Tag</label>
                <div className="flex gap-2 flex-wrap">
                  {['Fun', 'Home', 'Travel', 'Food', 'Work'].map(tag => (
                    <button
                      key={tag}
                      onClick={() => setGroupTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        groupTag === tag
                          ? 'bg-vibe-purple text-white'
                          : 'bg-vibe-border text-gray-400 hover:text-white'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button className="btn-primary flex-1 py-3" onClick={handleCreateGroup}>
                Create Group ✨
              </button>
              <button className="btn-secondary flex-1 py-3" onClick={() => { setShowNewGroup(false); setGroupName('') }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}