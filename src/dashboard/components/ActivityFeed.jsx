import { useMemo } from 'react'

const STATUS_CONFIG = {
  'Lead':               { color: '#6b7280', bg: '#f3f4f6' },
  'Benaderd':           { color: '#2563eb', bg: '#eff6ff' },
  'In gesprek':         { color: '#d97706', bg: '#fffbeb' },
  'Voorstel verstuurd': { color: '#7c3aed', bg: '#f5f3ff' },
  'Deal gesloten':      { color: '#059669', bg: '#ecfdf5' },
  'Afgewezen':          { color: '#b91c1c', bg: '#fef2f2' },
}

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2 leading-none">
      {children}
    </p>
  )
}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (mins < 2) return 'Zojuist'
  if (mins < 60) return `${mins} min geleden`
  if (hours < 24) return `${hours} uur geleden`
  if (days === 1) return 'Gisteren'
  return `${days} dagen geleden`
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['Lead']
  return (
    <span
      className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap shrink-0"
      style={{ color: cfg.color, background: cfg.bg }}
    >
      {status}
    </span>
  )
}

export default function ActivityFeed({ partners, crmUrl }) {
  const items = useMemo(() => {
    return [...partners]
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 10)
  }, [partners])

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col">
      <SectionLabel>Recente activiteit</SectionLabel>

      {items.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
          Nog geen activiteit
        </div>
      ) : (
        <div className="overflow-y-auto thin-scroll flex-1" style={{ maxHeight: 256 }}>
          <div className="space-y-0">
            {items.map((p, i) => {
              const cfg = STATUS_CONFIG[p.status] || STATUS_CONFIG['Lead']
              const value = Number(p.financialValue) || 0

              return (
                <div key={p.id} className="flex gap-3 relative pb-3">
                  {/* Timeline connector */}
                  {i < items.length - 1 && (
                    <div
                      className="absolute left-[7px] top-5 bottom-0 w-0.5 bg-gray-100"
                      style={{ bottom: 0 }}
                    />
                  )}

                  {/* Dot */}
                  <div
                    className="w-4 h-4 rounded-full shrink-0 border-2 border-white mt-0.5 z-10"
                    style={{ backgroundColor: cfg.color, boxShadow: `0 0 0 2px ${cfg.bg}` }}
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0 flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <button
                        className="text-xs font-semibold text-gray-900 hover:text-[#C91E2D] truncate block text-left leading-tight transition-colors"
                        onClick={() => window.open(`${crmUrl}?id=${p.id}`, '_blank')}
                      >
                        {p.company}
                      </button>
                      <p className="text-[10px] text-gray-400 leading-tight mt-0.5">
                        {timeAgo(p.updatedAt)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <StatusBadge status={p.status} />
                      {value > 0 && (
                        <span className="text-[10px] text-gray-400 tabular-nums">
                          € {value.toLocaleString('nl-NL')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
