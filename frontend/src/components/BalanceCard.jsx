const colorMap = {
  pink: { text: 'text-vibe-pink', bg: 'bg-vibe-pink/10', border: 'border-vibe-pink/20' },
  green: { text: 'text-vibe-green', bg: 'bg-vibe-green/10', border: 'border-vibe-green/20' },
  cyan: { text: 'text-vibe-cyan', bg: 'bg-vibe-cyan/10', border: 'border-vibe-cyan/20' },
}

export default function BalanceCard({ label, amount, color, icon }) {
  const c = colorMap[color] || colorMap.cyan

  return (
    <div className={`glass-card p-5 ${c.bg} border ${c.border}`}>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{icon}</span>
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      <p className={`font-display text-3xl font-bold ${c.text}`}>
        ₹{amount.toLocaleString()}
      </p>
    </div>
  )
}
