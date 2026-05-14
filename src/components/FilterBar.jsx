import { useState, useRef, useEffect } from 'react'
import { Search, Filter, X, ChevronDown } from 'lucide-react'
import { STATUSES, SECTORS, PRIORITIES, PARTNERSHIP_TIERS, STATUS_CONFIG } from '../data/constants'

export default function FilterBar({
  search, setSearch,
  filterStatus, setFilterStatus,
  filterSector, setFilterSector,
  filterPriority, setFilterPriority,
  filterTier, setFilterTier,
  showAfgewezen, setShowAfgewezen,
  activeFilterCount,
}) {
  const [filterOpen, setFilterOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setFilterOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function toggleStatus(s) {
    setFilterStatus(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    )
  }

  function clearAll() {
    setFilterStatus([])
    setFilterSector('')
    setFilterPriority('')
    setFilterTier('')
    setShowAfgewezen(false)
  }

  return (
    <div className="py-4 flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Zoek op bedrijf, contact, notities..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-9 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent"
          style={{ '--tw-ring-color': '#C91E2D' }}
          onFocus={e => { e.target.style.boxShadow = '0 0 0 2px #C91E2D33'; e.target.style.borderColor = '#C91E2D' }}
          onBlur={e => { e.target.style.boxShadow = ''; e.target.style.borderColor = '#e5e7eb' }}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filter button */}
      <div className="relative" ref={ref}>
        <button
          onClick={() => setFilterOpen(o => !o)}
          className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
            activeFilterCount > 0
              ? 'border-red-300 bg-red-50 text-red-700'
              : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Filter size={15} />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown size={14} className={`transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
        </button>

        {filterOpen && (
          <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-20 p-4">
            {/* Status */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Status</label>
              <div className="flex flex-wrap gap-1.5">
                {STATUSES.map(s => {
                  const cfg = STATUS_CONFIG[s]
                  const active = filterStatus.includes(s)
                  return (
                    <button
                      key={s}
                      onClick={() => toggleStatus(s)}
                      className="px-2.5 py-1 rounded-full text-xs font-medium border transition-all"
                      style={active
                        ? { background: cfg.border, color: '#fff', borderColor: cfg.border }
                        : { background: cfg.bg, color: cfg.color, borderColor: cfg.border + '66' }
                      }
                    >
                      {s}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Sector */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Sector</label>
              <select
                value={filterSector}
                onChange={e => setFilterSector(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 bg-white focus:outline-none"
              >
                <option value="">Alle sectoren</option>
                {SECTORS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            {/* Priority */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Prioriteit</label>
              <select
                value={filterPriority}
                onChange={e => setFilterPriority(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 bg-white focus:outline-none"
              >
                <option value="">Alle prioriteiten</option>
                {PRIORITIES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>

            {/* Tier */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Partnership Tier</label>
              <select
                value={filterTier}
                onChange={e => setFilterTier(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 bg-white focus:outline-none"
              >
                <option value="">Alle tiers</option>
                {PARTNERSHIP_TIERS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            {/* Afgewezen toggle */}
            <div className="flex items-center justify-between py-2 border-t border-gray-100">
              <span className="text-sm text-gray-600">Toon afgewezen</span>
              <button
                onClick={() => setShowAfgewezen(v => !v)}
                className={`relative w-10 h-6 rounded-full transition-colors ${showAfgewezen ? 'bg-red-500' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${showAfgewezen ? 'left-5' : 'left-1'}`} />
              </button>
            </div>

            {activeFilterCount > 0 && (
              <button
                onClick={clearAll}
                className="mt-3 w-full text-sm text-red-600 hover:text-red-800 font-medium py-1.5 hover:bg-red-50 rounded-lg transition-colors"
              >
                Wis alle filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Active filter chips */}
      {filterStatus.map(s => (
        <Chip key={s} label={s} onRemove={() => toggleStatus(s)} />
      ))}
      {filterSector && <Chip label={filterSector} onRemove={() => setFilterSector('')} />}
      {filterPriority && <Chip label={filterPriority} onRemove={() => setFilterPriority('')} />}
      {filterTier && <Chip label={filterTier} onRemove={() => setFilterTier('')} />}
      {showAfgewezen && <Chip label="Toon afgewezen" onRemove={() => setShowAfgewezen(false)} />}
    </div>
  )
}

function Chip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-medium">
      {label}
      <button onClick={onRemove} className="hover:text-red-900 ml-0.5">
        <X size={11} />
      </button>
    </span>
  )
}
