export default function GroupCard({ group, onClick }) {
  return (
    <div
      onClick={onClick}
      className="glass-card p-5 flex items-center justify-between cursor-pointer hover:border-vibe-purple/50 hover:glow-purple transition-all duration-200"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-vibe-purple/20 border border-vibe-purple/30 flex items-center justify-center text-2xl">
          {group.emoji}
        </div>
        <div>
          <p className="font-display font-semibold text-white">{group.name}</p>
          <p className="text-xs text-gray-500 mt-1">{group.members} members · ₹{group.totalExpense.toLocaleString()} total</p>
        </div>
      </div>

      <div className="text-right">
        {group.settled ? (
          <span className="px-3 py-1 rounded-full bg-vibe-green/20 text-vibe-green text-xs font-semibold border border-vibe-green/30">
            ✅ Settled
          </span>
        ) : (
          <>
            <p className="text-vibe-pink font-bold font-display">₹{group.yourShare.toLocaleString()}</p>
            <p className="text-xs text-gray-500">you owe</p>
          </>
        )}
      </div>
    </div>
  )
}
