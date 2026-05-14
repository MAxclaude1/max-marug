import { useMemo, useState } from 'react'

const STATUS_CONFIG = {
  'Lead':               { color: '#6b7280', bg: '#f3f4f6' },
  'Benaderd':           { color: '#2563eb', bg: '#eff6ff' },
  'In gesprek':         { color: '#d97706', bg: '#fffbeb' },
  'Voorstel verstuurd': { color: '#7c3aed', bg: '#f5f3ff' },
  'Deal gesloten':      { color: '#059669', bg: '#ecfdf5' },
  'Afgewezen':          { color: '#b91c1c', bg: '#fef2f2' },
}

const PRIORITY_COLORS = {
  Hoog:     '#ef4444',
  Gemiddeld:'#f59e0b',
  Laag:     '#22c55e',
}

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2 leading-none">
      {children}
    </p>
  )
}

function dateDiffLabel(dateStr) {
  if (!dateStr) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  target.setHours(0, 0, 0, 0)
  const diffDays = Math.round((target - today) / 86400000)

  if (diffDays === 0) return { label: 'Vandaag', overdue: true }
  if (diffDays < 0) return { label: `${Math.abs(diffDays)}d geleden`, overdue: true }
  if (diffDays === 1) return { label: 'Morgen', overdue: false }
  return { label: `Over ${diffDays}d`, overdue: false }
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['Lead']
  return (
    <span
      className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap"
      style={{ color: cfg.color, background: cfg.bg }}
    >
      {status}
    </span>
  )
}

export default function FollowUpList({ partners, selectedEvent, crmUrl }) {
  const [tab, setTab] = useState('open')

  const items = useMemo(() => {
    let list = partners
    if (tab === 'open') {
      list = list.filter(p => p.status !== 'Deal gesloten' && p.status !== 'Afgewezen')
    }
    if (selectedEvent) {
      list = list.filter(p => (p.events || []).includes(selectedEvent))
    }
    return list
      .filter(p => p.followUpDate)
      .sort((a, b) => a.followUpDate.localeCompare(b.followUpDate))
      .slice(0, 8)
  }, [partners, tab, selectedEvent])

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <SectionLabel>Follow-ups</SectionLabel>
        {selectedEvent && (
          <span className="text-[10px] bg-red-50 text-[#C91E2D] px-2 py-0.5 rounded-full font-medium">
            {selectedEvent}
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-3">
        {[['open', 'Openstaand'], ['all', 'Alle']].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${
              tab === key
                ? 'bg-gray-900 text-white'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-1.5 py-4">
          <span className="text-2xl">🎉</span>
          <p className="text-sm font-medium text-gray-600">Alles up-to-date</p>
          <p className="text-xs text-gray-400">Geen openstaande follow-ups</p>
        </div>
      ) : (
        <div className="space-y-1 overflow-y-auto thin-scroll flex-1" style={{ maxHeight: 220 }}>
          {items.map(p => {
            const diff = dateDiffLabel(p.followUpDate)
            const isOverdue = diff?.overdue

            return (
              <div
                key={p.id}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg ${
                  isOverdue ? 'bg-red-50' : 'hover:bg-gray-50'
                } group`}
              >
                {/* Priority dot */}
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: PRIORITY_COLORS[p.priority] || '#94a3b8' }}
                />

                {/* Company + contact */}
                <div className="flex-1 min-w-0">
                  <button
                    className="text-xs font-semibold text-gray-900 hover:text-[#C91E2D] truncate block text-left leading-tight transition-colors"
                    onClick={() => window.open(`${crmUrl}?id=${p.id}`, '_blank')}
                  >
                    {p.company}
                  </button>
                  {p.contactName && (
                    <p className="text-[10px] text-gray-400 truncate leading-tight">{p.contactName}</p>
                  )}
                </div>

                {/* Status badge */}
                <StatusBadge status={p.status} />

                {/* Date */}
                {diff && (
                  <span
                    className={`text-[10px] font-semibold whitespace-nowrap shrink-0 ${
                      isOverdue ? 'text-red-600' : 'text-gray-400'
                    }`}
                  >
                    {diff.label}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
