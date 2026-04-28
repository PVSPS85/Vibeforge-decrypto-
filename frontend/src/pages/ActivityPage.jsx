import ActivityFeed from '../components/ActivityFeed'

export default function ActivityPage() {
  return (
    <div className="min-h-screen bg-vibe-bg bg-grid px-4 md:px-8 py-8 pt-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-4xl font-bold mb-2">
          Recent <span className="gradient-text">Activity</span>
        </h1>
        <p className="text-gray-400 mb-8">Everything that's happened across your groups</p>
        <ActivityFeed />
      </div>
    </div>
  )
}
