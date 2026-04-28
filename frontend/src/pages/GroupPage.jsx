import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ExpenseModal from '../components/ExpenseModal'
import PayButton from '../components/PayButton'

const DEMO_EXPENSES = [
  { id: 1, title: 'Hotel Booking', amount: 6000, paidBy: 'Pranav', date: '2026-04-20', split: ['Pranav', 'Rahul', 'Sneha', 'Arjun'] },
  { id: 2, title: 'Dinner at Shack', amount: 2400, paidBy: 'Rahul', date: '2026-04-21', split: ['Pranav', 'Rahul', 'Sneha', 'Arjun'] },
  { id: 3, title: 'Scooter Rent', amount: 1800, paidBy: 'Sneha', date: '2026-04-22', split: ['Pranav', 'Sneha'] },
  { id: 4, title: 'Waterpark Entry', amount: 2200, paidBy: 'Arjun', date: '2026-04-22', split: ['Pranav', 'Rahul', 'Sneha', 'Arjun'] },
]

const DEMO_BALANCES = [
  { name: 'Rahul', owes: 1500, color: 'text-vibe-pink' },
  { name: 'Sneha', owes: -800, color: 'text-vibe-green' },
  { name: 'Arjun', owes: 600, color: 'text-vibe-pink' },
]

export default function GroupPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="min-h-screen bg-vibe-bg bg-grid px-4 md:px-8 py-8 pt-24">
      <div className="max-w-4xl mx-auto">

        {/* Back + Header */}
        <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 text-sm">
          ← Back to Dashboard
        </button>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-4xl font-bold">🏖️ Goa Trip</h1>
            <p className="text-gray-400 mt-1 text-sm">4 members · ₹12,400 total</p>
          </div>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            + Add Expense
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Expenses list */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-display text-xl font-semibold text-gray-200">Expenses</h2>
            {DEMO_EXPENSES.map(exp => (
              <div key={exp.id} className="glass-card p-5 flex items-center justify-between hover:border-vibe-purple/40 transition-all cursor-pointer">
                <div>
                  <p className="font-semibold text-white">{exp.title}</p>
                  <p className="text-xs text-gray-500 mt-1">Paid by {exp.paidBy} · {exp.date} · {exp.split.length} people</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-xl font-bold text-vibe-violet">₹{exp.amount.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">₹{(exp.amount / exp.split.length).toFixed(0)} each</p>
                </div>
              </div>
            ))}
          </div>

          {/* Balances */}
          <div>
            <h2 className="font-display text-xl font-semibold text-gray-200 mb-4">Balances</h2>
            <div className="glass-card p-5 space-y-4">
              {DEMO_BALANCES.map(b => (
                <div key={b.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-vibe-purple/30 flex items-center justify-center text-sm font-bold">
                      {b.name[0]}
                    </div>
                    <span className="text-gray-300">{b.name}</span>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${b.owes > 0 ? 'text-vibe-pink' : 'text-vibe-green'}`}>
                      {b.owes > 0 ? `owes ₹${b.owes}` : `gets ₹${Math.abs(b.owes)}`}
                    </p>
                    {b.owes > 0 && <PayButton amount={b.owes} toName={b.name} />}
                  </div>
                </div>
              ))}
            </div>

            {/* Settle All */}
            <button className="btn-primary w-full mt-4 py-4">
              ⚡ Settle All On-Chain
            </button>
          </div>
        </div>

        {showModal && <ExpenseModal onClose={() => setShowModal(false)} />}
      </div>
    </div>
  )
}
