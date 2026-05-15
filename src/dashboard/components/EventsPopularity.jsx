import { useMemo } from 'react'

const EVENTS_LIST = [
  'Conference',
  'Recruitment Days',
  'Inhousetour',
  'Speeddate',
  'Commercial Night',
]

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2 leading-none">
      {children}
    </p>
  )
}

export default function EventsPopularity({ partners, selectedEvent, onEventClick }) {
  const events = useMemo(() => {
    const total = partners.length
    return EVENTS_LIST.map(event => {
      const count = partners.filter(p => (p.events || []).includes(event)).length
      return {
        event,
        count,
        percent: total > 0 ? Math.round((count / total) * 100) : 0,
      }
    }).sort((a, b) => b.count - a.count)
  }, [partners])

  const maxCount = Math.max(...events.map(e => e.count), 1)

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <SectionLabel>Event populariteit</SectionLabel>

      {partners.length === 0 ? (
        <div className="h-36 flex items-center justify-center text-sm text-gray-400">
          Nog geen data
        </div>
      ) : (
        <div className="space-y-2.5">
          {events.map(({ event, count, percent }) => {
            const isSelected = selectedEvent === event
            const barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0
            const isActive = !selectedEvent || isSelected

            return (
              <div
                key={event}
                className="flex items-center gap-3 group cursor-pointer"
                onClick={() => onEventClick(event)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && onEventClick(event)}
              >
                {/* Event name */}
                <div className="w-32 shrink-0">
                  <span
                    className={`text-xs font-medium transition-colors ${
                      isSelected
                        ? 'text-[#C91E2D]'
                        : 'text-gray-600 group-hover:text-gray-900'
                    }`}
                  >
                    {event}
                  </span>
                </div>

                {/* Bar track */}
                <div className="flex-1 h-5 bg-gray-50 rounded-md overflow-hidden relative">
                  <div
                    className="h-full rounded-md transition-all duration-500"
                    style={{
                      width: `${barWidth}%`,
                      backgroundColor: isSelected ? '#C91E2D' : '#fca5a5',
                      opacity: isActive ? 1 : 0.35,
                      minWidth: count > 0 ? '6px' : '0',
                    }}
                  />
                </div>

                {/* Count + pct */}
                <div className="w-14 shrink-0 text-right">
                  <span className="text-xs font-semibold text-gray-700 tabular-nums">
                    {count}
                  </span>
                  <span className="text-[10px] text-gray-400 ml-1">
                    {percent}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {selectedEvent && (
        <p className="mt-3 text-[10px] text-gray-400 text-right">
          Filter actief:{' '}
          <span className="font-medium text-[#C91E2D]">{selectedEvent}</span>
          {' '}— klik opnieuw om te wissen
        </p>
      )}
    </div>
  )
}
