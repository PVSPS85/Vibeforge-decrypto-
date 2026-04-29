import { useMemo } from 'react'

const typeColor = {
  pay: 'border-vibe-green/30 bg-vibe-green/5',
  add: 'border-vibe-purple/30 bg-vibe-purple/5',
  settle: 'border-vibe-cyan/30 bg-vibe-cyan/5',
  join: 'border-vibe-yellow/30 bg-vibe-yellow/5',
}

function timeAgo(createdAt) {
  if (!createdAt) return 'Just now'
  const date = new Date(createdAt)
  if (Number.isNaN(date.getTime())) return 'Just now'

  const diffSeconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (diffSeconds < 60) return `${diffSeconds} sec ago`
  const diffMinutes = Math.floor(diffSeconds / 60)
  if (diffMinutes < 60) return `${diffMinutes} min ago`
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours} hr ago`
  const diffDays = Math.floor(diffHours / 24)
  return diffDays === 1 ? 'Yesterday' : `${diffDays} days ago`
}

function loadActivities() {
  if (typeof window === 'undefined') return []

  try {
    const savedGroups = localStorage.getItem('vibeforge_groups')
    const groups = savedGroups ? JSON.parse(savedGroups) : []

    const activities = []
    groups.forEach(group => {
      const expenseKey = `expenses_group_${group.id}`
      const savedExpenses = localStorage.getItem(expenseKey)
      const expenses = savedExpenses ? JSON.parse(savedExpenses) : []
      if (!Array.isArray(expenses)) return

      expenses.forEach(expense => {
        const paidBy = expense.paidBy?.name || expense.paidBy || 'Someone'
        const title = expense.title || 'Expense'
        const amount = Number(expense.amount) || 0
        const text = `${paidBy} paid ₹${amount.toLocaleString()} for “${title}” in ${group.name}`
        activities.push({
          id: `${group.id}-${expense._id || expense.id || title}-${expense.createdAt || ''}`,
          icon: '💸',
          text,
          type: 'add',
          createdAt: expense.createdAt,
          time: timeAgo(expense.createdAt),
        })
      })
    })

    return activities.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime()
      const dateB = new Date(b.createdAt || 0).getTime()
      return dateB - dateA
    })
  } catch {
    return []
  }
}

export default function ActivityFeed() {
  const activities = useMemo(() => loadActivities(), [])

  if (activities.length === 0) {
    return (
      <div className="glass-card p-6 text-center text-gray-400">
        No recent activity yet. Add an expense to see activity here.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {activities.map(a => (
        <div key={a.id} className={`glass-card p-4 flex items-center gap-4 border ${typeColor[a.type]}`}>
          <span className="text-2xl">{a.icon}</span>
          <div className="flex-1">
            <p className="text-sm text-gray-200">{a.text}</p>
            <p className="text-xs text-gray-500 mt-1">{a.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
