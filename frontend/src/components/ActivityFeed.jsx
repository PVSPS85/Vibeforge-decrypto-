const ACTIVITIES = [
  { id: 1, icon: '💸', text: 'Rahul paid ₹1,500 to Pranav', time: '2 min ago', type: 'pay' },
  { id: 2, icon: '➕', text: 'Sneha added "Dinner at Shack" ₹2,400 in Goa Trip', time: '1 hr ago', type: 'add' },
  { id: 3, icon: '✅', text: 'Pizza Fridays group fully settled on-chain', time: '3 hrs ago', type: 'settle' },
  { id: 4, icon: '👥', text: 'Arjun joined Goa Trip group', time: '5 hrs ago', type: 'join' },
  { id: 5, icon: '💸', text: 'You paid ₹3,100 in Flat Expenses', time: 'Yesterday', type: 'pay' },
  { id: 6, icon: '➕', text: 'You added "Electricity Bill" ₹1,800 in Flat Expenses', time: 'Yesterday', type: 'add' },
]

const typeColor = {
  pay: 'border-vibe-green/30 bg-vibe-green/5',
  add: 'border-vibe-purple/30 bg-vibe-purple/5',
  settle: 'border-vibe-cyan/30 bg-vibe-cyan/5',
  join: 'border-vibe-yellow/30 bg-vibe-yellow/5',
}

export default function ActivityFeed() {
  return (
    <div className="space-y-3">
      {ACTIVITIES.map(a => (
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
