const LEADERS = [
  { rank: 1, name: 'Pranav', settled: 12400, emoji: '🥇' },
  { rank: 2, name: 'Sneha', settled: 8900, emoji: '🥈' },
  { rank: 3, name: 'Rahul', settled: 6200, emoji: '🥉' },
  { rank: 4, name: 'Arjun', settled: 3100, emoji: '4️⃣' },
]

export default function LeaderBoard() {
  return (
    <div className="glass-card p-5 space-y-3">
      {LEADERS.map(l => (
        <div key={l.rank} className="flex items-center gap-3">
          <span className="text-xl w-8">{l.emoji}</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">{l.name}</p>
            <div className="mt-1 h-1.5 rounded-full bg-vibe-border overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-vibe-purple to-vibe-cyan"
                style={{ width: `${(l.settled / 12400) * 100}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-gray-400 font-mono">₹{l.settled.toLocaleString()}</p>
        </div>
      ))}
    </div>
  )
}
