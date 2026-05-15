function formatDateTime(date) {
  if (!date || date.getTime() === 0) return '—'
  return (
    date.toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' ' +
    date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })
  )
}

export default function DashboardHeader({ selectedYear, onYearChange, onRefresh, crmUrl, lastUpdated }) {
  const years = ['2024-2025', '2025-2026', '2026-2027']

  function displayYear(y) {
    const [a, b] = y.split('-')
    return `${a}–${b}`
  }

  return (
    <header className="bg-white border-b border-gray-100 px-4 md:px-6 py-3 sticky top-0 z-20 shadow-sm">
      <div className="flex items-center justify-between gap-4">

        {/* Brand */}
        <div className="flex items-baseline gap-2.5 shrink-0">
          <span
            className="text-2xl font-heading font-bold tracking-tight"
            style={{ color: '#C91E2D' }}
          >
            MARUG
          </span>
          <span className="text-sm font-medium text-gray-400 hidden sm:block">
            Partnership Dashboard
          </span>
        </div>

        {/* Center: year selector + timestamp */}
        <div className="flex flex-col items-center gap-0.5">
          <select
            value={selectedYear}
            onChange={e => onYearChange(e.target.value)}
            className="text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#C91E2D]/20 cursor-pointer"
          >
            {years.map(y => (
              <option key={y} value={y}>{displayYear(y)}</option>
            ))}
          </select>
          {lastUpdated && (
            <span className="text-[10px] text-gray-400 leading-none">
              Bijgewerkt: {formatDateTime(lastUpdated)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onRefresh}
            className="text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 hover:text-gray-800 transition-colors font-medium"
          >
            Vernieuwen
          </button>
          <a
            href={crmUrl}
            className="text-xs font-semibold text-white rounded-lg px-3 py-1.5 transition-colors"
            style={{ background: '#C91E2D' }}
            onMouseEnter={e => e.currentTarget.style.background = '#A8171F'}
            onMouseLeave={e => e.currentTarget.style.background = '#C91E2D'}
          >
            Open CRM →
          </a>
        </div>
      </div>
    </header>
  )
}
