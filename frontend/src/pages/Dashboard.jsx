import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWeb3 } from '../context/Web3Context'

// ═══ CONFETTI ENGINE ═══
function launchConfetti() {
  const colors = ['#7c3aed', '#06b6d4', '#f59e0b', '#10b981', '#ec4899', '#a855f7']
  const shapes = ['■', '●', '▲', '★', '◆']
  for (let i = 0; i < 80; i++) {
    const el = document.createElement('div')
    el.className = 'confetti-piece'
    el.innerText = shapes[Math.floor(Math.random() * shapes.length)]
    el.style.cssText = `
      position: fixed;
      top: -20px;
      left: ${Math.random() * 100}vw;
      color: ${colors[Math.floor(Math.random() * colors.length)]};
      font-size: ${8 + Math.random() * 14}px;
      animation: confettiFall ${2 + Math.random() * 3}s ease-in forwards;
      animation-delay: ${Math.random() * 1.5}s;
      pointer-events: none;
      z-index: 9999;
    `
    document.body.appendChild(el)
    setTimeout(() => el.remove(), 5000)
  }
}

// ═══ TOAST ═══
function Toast({ toasts }) {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2">
      {Array.isArray(toasts) && toasts.map(t => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-5 py-3 rounded-2xl border backdrop-blur-md shadow-2xl
            ${t.type === 'success' ? 'bg-green-500/20 border-green-500/40 text-green-300' :
              t.type === 'xp' ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300' :
              t.type === 'error' ? 'bg-red-500/20 border-red-500/40 text-red-300' :
              'bg-vibe-purple/20 border-vibe-purple/40 text-vibe-violet'}`}
        >
          <span className="text-xl">{t.icon}</span>
          <div>
            <p className="font-semibold text-sm">{t.title}</p>
            {t.sub && <p className="text-xs opacity-70">{t.sub}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}

// ═══ ANIMATED NUMBER ═══
function AnimatedNumber({ value, prefix = '₹', decimals = 0 }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    let start = 0
    const end = parseFloat(value)
    const duration = 1200
    const step = 16
    const increment = end / (duration / step)
    clearInterval(ref.current)
    ref.current = setInterval(() => {
      start += increment
      if (start >= end) { setDisplay(end); clearInterval(ref.current) }
      else setDisplay(start)
    }, step)
    return () => clearInterval(ref.current)
  }, [value])

  return <span>{prefix}{decimals ? display.toFixed(decimals) : Math.floor(display).toLocaleString()}</span>
}

// ═══ XP BAR ═══
function XPBar({ xp, maxXp, level }) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setWidth((xp / maxXp) * 100), 300)
    return () => clearTimeout(t)
  }, [xp, maxXp])

  return (
    <div className="glass-card p-5 mb-8">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-lg font-bold">
            {level}
          </div>
          <div>
            <p className="font-display font-bold text-white text-sm">Level {level} — Debt Crusher</p>
            <p className="text-xs text-gray-500">{maxXp - xp} XP to Level {level + 1}</p>
          </div>
        </div>
        <p className="text-yellow-400 font-bold font-mono text-sm">
          {xp.toLocaleString()} / {maxXp.toLocaleString()} XP
        </p>
      </div>
      <div className="h-4 rounded-full bg-vibe-border overflow-hidden relative">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${width}%`,
            background: 'linear-gradient(90deg, #7c3aed, #a855f7, #06b6d4)',
          }}
        />
      </div>
      <div className="flex gap-2 mt-3 flex-wrap">
        {['⚡ Fast Payer', '🏆 Group Hero', '💸 Big Spender'].map(badge => (
          <span key={badge} className="text-xs px-2 py-1 rounded-full bg-vibe-purple/20 border border-vibe-purple/30 text-vibe-violet">
            {badge}
          </span>
        ))}
      </div>
    </div>
  )
}

// ═══ INITIAL DATA ═══
const INITIAL_GROUPS = []

const TAG_EMOJIS = { Fun: '🎮', Home: '🏠', Travel: '✈️', Food: '🍕', Work: '💼' }

// ═══ MAIN DASHBOARD ═══
export default function Dashboard() {
  const { account, userProfile } = useWeb3()
  const navigate = useNavigate()

  const [groups, setGroups] = useState([])
  const [showNewGroup, setShowNewGroup] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [groupTag, setGroupTag] = useState('Fun')
  const [toasts, setToasts] = useState([])
  const [mounted, setMounted] = useState(false)

  // XP is pulled from backend profile directly!
  const xp = userProfile?.xp || 50
  const maxXp = 3500
  const level = Math.floor(xp / 500) + 1

  const [allExpenses, setAllExpenses] = useState([])

  // Fetch Groups AND true Expenses from backend
  useEffect(() => {
    if (!account) return
    const fetchData = async () => {
      try {
        const groupsRes = await fetch(`http://localhost:5005/api/groups?wallet=${account}`)
        const groupsData = await groupsRes.json()
        
        if (groupsData.success) {
          let globalExpenses = []
          const formattedGroups = await Promise.all(groupsData.data.map(async (g) => {
            
            // Fetch ALL expenses for this group to ensure math is 100% real
            const expRes = await fetch(`http://localhost:5005/api/expenses/group/${g._id}`)
            const expData = await expRes.json()
            const groupExps = expData.success ? expData.data : []
            
            globalExpenses = [...globalExpenses, ...groupExps]

            let totalExp = 0
            let yourBal = 0
            
            groupExps.forEach(exp => {
              totalExp += exp.amount
              const share = exp.amount / exp.split.length
              
              const payerWallet = (exp.paidBy?.walletAddress || exp.paidBy).toLowerCase()
              
              if (payerWallet === account.toLowerCase()) {
                yourBal += (exp.amount - share)
              } else {
                const inSplit = exp.split.find(s => (s.user?.walletAddress || s.user).toLowerCase() === account.toLowerCase())
                if (inSplit) {
                  yourBal -= share
                }
              }
            })

            return {
              ...g,
              id: g._id,
              memberColors: g.members.map(() => 'bg-purple-500'),
              totalExpense: totalExp,
              settled: 0, 
              yourBalance: yourBal,
              memberCount: g.members.length > 1 ? g.members.length - 1 : 0
            }
          }))
          setGroups(formattedGroups)
          setAllExpenses(globalExpenses)
        }
      } catch (err) {
        console.error("Failed to fetch data", err)
      }
    }
    fetchData()
  }, [account, userProfile])

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(t)
  }, [])

  const addToast = (toast) => {
    const id = Date.now()
    setToasts(prev => [...prev, { ...toast, id }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }

  const handleCreateGroup = async () => {
    if (!groupName.trim() || !account) return

    const emoji = TAG_EMOJIS[groupTag] || '✨'
    
    try {
      const res = await fetch('http://localhost:5005/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: groupName.trim(),
          emoji,
          tag: groupTag,
          tagColor: 'bg-cyan-500/20 text-cyan-300',
          adminWallet: account
        })
      })
      
      const data = await res.json()
      if (data.success) {
        const newGroup = {
          ...data.data,
          id: data.data._id,
          memberColors: ['bg-purple-500'],
          totalExpense: 0,
          settled: 0,
          yourBalance: 0,
          memberCount: 0
        }
        
        setGroups(prev => [newGroup, ...prev])
        setGroupName('')
        setShowNewGroup(false)
        launchConfetti()
        addToast({ type: 'success', icon: '🎉', title: 'Group Created!', sub: '+100 XP earned' })
        setTimeout(() => addToast({ type: 'xp', icon: '⚡', title: 'XP Gained!', sub: 'Keep splitting to level up' }), 800)
      }
    } catch (err) {
      addToast({ type: 'error', icon: '⚠️', title: 'Network Error', sub: 'Failed to create group' })
    }
  }

  const youOwe = useMemo(() => {
    if (!Array.isArray(groups) || groups.length === 0) return 0
    return groups.filter(g => g.yourBalance < 0).reduce((sum, g) => sum + Math.abs(g.yourBalance), 0)
  }, [groups])
  const youGetBack = useMemo(() => {
    if (!Array.isArray(groups) || groups.length === 0) return 0
    return groups.filter(g => g.yourBalance > 0).reduce((sum, g) => sum + g.yourBalance, 0)
  }, [groups])
  const netBalance = useMemo(() => youGetBack - youOwe, [youGetBack, youOwe])

  return (
    <div className={`min-h-screen bg-vibe-bg bg-grid px-4 md:px-8 py-8 pt-24 transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-display text-4xl md:text-5xl font-extrabold text-white">
                Quest Dashboard
              </h1>
              <span className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-xs font-bold">
                ⚡ Lv.{level}
              </span>
            </div>
            <p className="text-gray-400 text-sm flex items-center gap-2 mt-1">
              {userProfile ? (
                <>
                  <span className="font-bold text-white text-base">👋 {userProfile.displayName}</span>
                  <span className="bg-vibe-purple/20 text-vibe-violet px-2 py-0.5 rounded text-xs font-mono border border-vibe-purple/30">
                    {userProfile.appUid}
                  </span>
                </>
              ) : (
                <span className="opacity-50 text-xs">Loading Profile...</span>
              )}
            </p>
          </div>
          <button
            className="btn-primary flex items-center gap-2 self-start"
            onClick={() => setShowNewGroup(true)}
          >
            <span className="text-lg">+</span> New Group
          </button>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { label: 'You Owe', value: isNaN(youOwe) ? 0 : youOwe, color: 'red', icon: '📤', arrow: '↘', sub: `Across ${Array.isArray(groups) ? groups.filter(g => g.yourBalance < 0).length : 0} groups` },
            { label: 'You Get Back', value: isNaN(youGetBack) ? 0 : youGetBack, color: 'green', icon: '📥', arrow: '↗', sub: `From ${Array.isArray(groups) ? groups.filter(g => g.yourBalance > 0).length : 0} friends` },
            { label: 'Net Balance', value: isNaN(netBalance) ? 0 : netBalance, color: 'purple', icon: '⚖️', arrow: '—', sub: (isNaN(netBalance) ? 0 : netBalance) >= 0 ? 'Looking good! 🎉' : 'Time to settle up! 💸', prefix: '₹' },
          ].map((card, i) => (
            <div
              key={i}
              className="glass-card p-6"
              style={{
                background: card.color === 'red' ? 'rgba(239,68,68,0.08)' : card.color === 'green' ? 'rgba(16,185,129,0.08)' : 'rgba(124,58,237,0.08)',
                borderColor: card.color === 'red' ? 'rgba(239,68,68,0.25)' : card.color === 'green' ? 'rgba(16,185,129,0.25)' : 'rgba(124,58,237,0.25)',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-400 text-sm flex items-center gap-2">
                  <span>{card.icon}</span>{card.label}
                </p>
                <span className={`text-lg ${card.color === 'red' ? 'text-red-400' : card.color === 'green' ? 'text-green-400' : 'text-purple-400'}`}>
                  {card.arrow}
                </span>
              </div>
              <p className={`font-display text-3xl font-bold ${card.color === 'red' ? 'text-red-400' : card.color === 'green' ? 'text-green-400' : 'text-purple-400'}`}>
                <AnimatedNumber value={card.value} decimals={2} prefix={card.prefix || '₹'} />
              </p>
              <p className="text-xs text-gray-500 mt-1">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* XP Bar */}
        <XPBar xp={xp} maxXp={maxXp} level={level} />

        {/* Groups + Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Groups */}
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
              {Array.isArray(groups) && groups.map((group, idx) => (
                <div
                  key={group.id}
                  onClick={() => navigate(`/group/${group.id}`)}
                  className="glass-card p-5 cursor-pointer border border-vibe-border hover:border-vibe-purple/50 transition-all hover:scale-[1.02]"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-display font-bold text-white text-lg">
                        {group.emoji} {group.name}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${group.tagColor}`}>
                        {group.tag}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className={`font-display font-bold text-lg ${group.yourBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {group.yourBalance >= 0 ? '+' : ''}₹{Math.abs(group.yourBalance).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">{group.yourBalance >= 0 ? 'you get' : 'you owe'}</p>
                    </div>
                  </div>

                  <div className="flex gap-1 mb-3">
                    {Array.isArray(group.populatedMembers) ? group.populatedMembers.map((m, i) => (
                      <div
                        key={i}
                        className={`w-8 h-8 rounded-full ${group.memberColors[i] || 'bg-gray-600'} flex items-center justify-center text-xs font-bold text-white border-2 border-vibe-bg`}
                        style={{ marginLeft: i > 0 ? '-6px' : '0' }}
                        title={`${m.displayName || 'Unknown User'} (${m.appUid || '???'})`}
                      >
                        {(m.displayName || 'U').slice(0, 2).toUpperCase()}
                      </div>
                    )) : Array.isArray(group.members) && group.members.map((m, i) => (
                      <div
                        key={i}
                        className={`w-8 h-8 rounded-full ${group.memberColors[i] || 'bg-gray-600'} flex items-center justify-center text-xs font-bold text-white border-2 border-vibe-bg`}
                        style={{ marginLeft: i > 0 ? '-6px' : '0' }}
                        title="Unknown User"
                      >
                        U
                      </div>
                    ))}
                    <div
                      className="w-8 h-8 rounded-full bg-vibe-border flex items-center justify-center text-xs text-gray-400 border-2 border-vibe-bg"
                      style={{ marginLeft: '-6px' }}
                    >
                      +{group.memberCount}
                    </div>
                  </div>

                  {group.totalExpense > 0 ? (
                    <>
                      <div className="h-2 rounded-full bg-vibe-border overflow-hidden mb-1">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min((group.settled / group.totalExpense) * 100, 100)}%`,
                            background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>₹{group.settled} settled</span>
                        <span>{Math.round((group.settled / group.totalExpense) * 100)}%</span>
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-gray-500 italic">No expenses yet — add one! 💸</p>
                  )}
                </div>
              ))}

              {/* Add group card */}
              <div
                onClick={() => setShowNewGroup(true)}
                className="glass-card p-5 cursor-pointer border border-dashed border-vibe-border flex items-center justify-center gap-3 text-gray-500 hover:text-vibe-violet hover:border-vibe-purple/50 transition-all min-h-[160px]"
              >
                <span className="text-3xl">+</span>
                <span className="font-display font-semibold">New Group</span>
              </div>
            </div>
          </div>

          {/* Leaderboard & Stats */}
          <div>
            <h2 className="font-display text-xl font-bold text-white mb-4">📊 Your Stats</h2>
            
            <div className="glass-card p-5 space-y-3 mb-6">
              {[
                { label: 'Groups Joined', value: Array.isArray(groups) ? groups.length : 0, icon: '👥' },
                { label: 'Total Expenses', value: Array.isArray(allExpenses) ? allExpenses.length : 0, icon: '🧾' },
                { label: 'Total XP', value: xp.toLocaleString(), icon: '⚡' },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 flex items-center gap-2">{s.icon} {s.label}</span>
                  <span className="text-sm font-bold text-white">{s.value}</span>
                </div>
              ))}
            </div>

            <h2 className="font-display text-xl font-bold text-white mb-4">🏆 Network Leaderboard</h2>
            <div className="glass-card p-5 space-y-4">
              <div className="text-center py-6 text-gray-500">
                <p className="text-3xl mb-2">🚀</p>
                <p className="text-sm">Leaderboard unlocks soon!</p>
                <p className="text-xs mt-1">Keep splitting to rank up in the network.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Group Modal */}
      {showNewGroup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="glass-card p-8 w-full max-w-md animate-slide-up">
            <h3 className="font-display text-2xl font-bold mb-1">New Group ✨</h3>
            <p className="text-gray-400 text-sm mb-6">Create a squad, start splitting</p>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block font-semibold uppercase tracking-wide">Group Name</label>
                <input
                  className="w-full bg-vibe-bg border border-vibe-border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-vibe-purple transition-colors"
                  placeholder="e.g. 🏕️ Coorg Trip"
                  value={groupName}
                  onChange={e => setGroupName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreateGroup()}
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-2 block font-semibold uppercase tracking-wide">Vibe</label>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(TAG_EMOJIS).map(([tag, emoji]) => (
                    <button
                      key={tag}
                      onClick={() => setGroupTag(tag)}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1 ${
                        groupTag === tag
                          ? 'bg-vibe-purple text-white scale-105'
                          : 'bg-vibe-border text-gray-400 hover:text-white'
                      }`}
                    >
                      {emoji} {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                className="btn-primary flex-1 py-3 disabled:opacity-40"
                onClick={handleCreateGroup}
                disabled={!groupName.trim()}
              >
                Create ✨
              </button>
              <button
                className="btn-secondary flex-1 py-3"
                onClick={() => { setShowNewGroup(false); setGroupName('') }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast toasts={toasts} />
    </div>
  )
}