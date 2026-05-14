import { LayoutGrid, List, Download, Plus, CalendarClock, TrendingUp, CheckCircle2, Users, Euro } from 'lucide-react'

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

function fmt(n) {
  return new Intl.NumberFormat('nl-NL', { minimumFractionDigits: 0 }).format(n)
}

export default function Header({ partners, view, setView, onExport, onNewPartner }) {
  const today = todayStr()

  const totalLeads = partners.length
  const inProgress = partners.filter(p => p.status === 'In gesprek' || p.status === 'Voorstel verstuurd').length
  const dealsGesloten = partners.filter(p => p.status === 'Deal gesloten').length
  const pipelineWaarde = partners
    .filter(p => p.status !== 'Afgewezen')
    .reduce((sum, p) => sum + (Number(p.financialValue) || 0), 0)
  const followUpsVandaag = partners.filter(p => p.followUpDate && p.followUpDate <= today).length

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
      {/* Top bar */}
      <div className="px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* MARUG logo / wordmark */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#C91E2D' }}>
              <span className="text-white font-bold text-xs tracking-tight">M</span>
            </div>
            <div>
              <div className="font-bold text-gray-900 text-sm leading-none">MARUG</div>
              <div className="text-gray-400 text-xs">Partner CRM</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="hidden md:flex bg-gray-100 rounded-lg p-1 gap-1">
            <button
              onClick={() => setView('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                view === 'kanban'
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <LayoutGrid size={15} />
              Kanban
            </button>
            <button
              onClick={() => setView('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                view === 'table'
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <List size={15} />
              Tabel
            </button>
          </div>

          <button
            onClick={onExport}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Download size={15} />
            Exporteer CSV
          </button>

          <button
            onClick={onNewPartner}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors"
            style={{ background: '#C91E2D' }}
            onMouseEnter={e => e.currentTarget.style.background = '#A8171F'}
            onMouseLeave={e => e.currentTarget.style.background = '#C91E2D'}
          >
            <Plus size={15} />
            <span className="hidden sm:inline">Nieuwe partner</span>
            <span className="sm:hidden">Nieuw</span>
          </button>
        </div>
      </div>

      {/* Metrics bar */}
      <div className="px-4 md:px-6 pb-3 grid grid-cols-2 md:grid-cols-5 gap-3">
        <MetricCard
          icon={<Users size={16} />}
          label="Totaal leads"
          value={totalLeads}
          color="gray"
        />
        <MetricCard
          icon={<TrendingUp size={16} />}
          label="In gesprek"
          value={inProgress}
          color="amber"
        />
        <MetricCard
          icon={<CheckCircle2 size={16} />}
          label="Deals gesloten"
          value={dealsGesloten}
          color="green"
        />
        <MetricCard
          icon={<Euro size={16} />}
          label="Pipeline waarde"
          value={`€ ${fmt(pipelineWaarde)}`}
          color="red"
        />
        <MetricCard
          icon={<CalendarClock size={16} />}
          label="Follow-ups vandaag"
          value={followUpsVandaag}
          color={followUpsVandaag > 0 ? 'urgent' : 'gray'}
          highlight={followUpsVandaag > 0}
        />
      </div>
    </header>
  )
}

const METRIC_STYLES = {
  gray:   { bg: 'bg-gray-50',   icon: 'text-gray-400',  val: 'text-gray-900' },
  amber:  { bg: 'bg-amber-50',  icon: 'text-amber-500', val: 'text-amber-700' },
  green:  { bg: 'bg-green-50',  icon: 'text-green-500', val: 'text-green-700' },
  red:    { bg: 'bg-red-50',    icon: 'text-red-500',   val: 'text-red-700' },
  urgent: { bg: 'bg-red-50',    icon: 'text-red-500',   val: 'text-red-700' },
}

function MetricCard({ icon, label, value, color, highlight }) {
  const s = METRIC_STYLES[color] || METRIC_STYLES.gray
  return (
    <div className={`${s.bg} rounded-xl px-4 py-3 flex items-center gap-3 ${highlight ? 'ring-2 ring-red-200' : ''}`}>
      <div className={`${s.icon} flex-shrink-0`}>{icon}</div>
      <div className="min-w-0">
        <div className={`${s.val} font-bold text-lg leading-none`}>{value}</div>
        <div className="text-gray-400 text-xs mt-0.5 truncate">{label}</div>
      </div>
    </div>
  )
}
