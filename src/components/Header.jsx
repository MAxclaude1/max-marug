import { useState } from 'react'
import { X, LayoutGrid, List, Download, Plus, CalendarClock, TrendingUp, CheckCircle2, Users, Euro, RefreshCw } from 'lucide-react'

import { STATUSES } from '../data/constants'

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

function fmt(n) {
  return new Intl.NumberFormat('nl-NL', { minimumFractionDigits: 0 }).format(n)
}

export default function Header({ partners, view, setView, onExport, onReset, onNewPartner, onOpenPartner }) {
  const today = todayStr()

  const [openMetric, setOpenMetric] = useState(null)

  const money = p => Number(p.financialValue) || 0
  const sum = list => list.reduce((t, p) => t + money(p), 0)

  const inProgressList = partners.filter(p => p.status === 'In gesprek' || p.status === 'Voorstel verstuurd')
  const closedList = partners.filter(p => p.status === 'Deal gesloten')
  const pipelineList = partners.filter(p => p.status !== 'Afgewezen')
  const followUpList = partners.filter(p => p.followUpDate && p.followUpDate <= today)
  const followUpsVandaag = followUpList.length

  const metrics = {
    leads: {
      label: 'Totaal leads', icon: <Users size={16} />, color: 'gray', value: partners.length,
      list: partners, total: null,
      explain: 'Alle partners in de tracker, inclusief afgewezen.',
    },
    gesprek: {
      label: 'In gesprek', icon: <TrendingUp size={16} />, color: 'amber', value: inProgressList.length,
      sub: `€ ${fmt(sum(inProgressList))}`,
      list: inProgressList, total: sum(inProgressList),
      explain: 'Partners met status "In gesprek" of "Voorstel verstuurd". Bedrag = verwachte waarde.',
    },
    deals: {
      label: 'Deals gesloten', icon: <CheckCircle2 size={16} />, color: 'green', value: closedList.length,
      sub: `€ ${fmt(sum(closedList))}`,
      list: closedList, total: sum(closedList),
      explain: 'Partners met status "Deal gesloten". Het totaal is de som van hun financiële waarde.',
    },
    pipeline: {
      label: 'Pipeline waarde', icon: <Euro size={16} />, color: 'red', value: `€ ${fmt(sum(pipelineList))}`,
      list: pipelineList, total: sum(pipelineList), grouped: true,
      explain: 'Som van de financiële waarde van alle partners behalve afgewezen (gesloten deals + nog lopende kansen).',
    },
    followups: {
      label: 'Follow-ups vandaag', icon: <CalendarClock size={16} />, color: followUpsVandaag > 0 ? 'urgent' : 'gray',
      value: followUpsVandaag, highlight: followUpsVandaag > 0,
      list: followUpList, total: null, showDate: true,
      explain: 'Partners met een follow-up datum van vandaag of eerder (te laat).',
    },
  }
  const active = openMetric ? metrics[openMetric] : null

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
            onClick={onReset}
            title="Data herladen vanuit brondata"
            className="hidden md:flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw size={15} />
            Herladen
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
        {Object.entries(metrics).map(([key, m]) => (
          <MetricCard
            key={key}
            icon={m.icon}
            label={m.label}
            value={m.value}
            sub={m.sub}
            color={m.color}
            highlight={m.highlight}
            selected={openMetric === key}
            onClick={() => setOpenMetric(openMetric === key ? null : key)}
          />
        ))}
      </div>

      {active && (
        <MetricDetail
          metric={active}
          onClose={() => setOpenMetric(null)}
          onOpenPartner={p => { setOpenMetric(null); onOpenPartner?.(p) }}
        />
      )}
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

function MetricCard({ icon, label, value, sub, color, highlight, selected, onClick }) {
  const s = METRIC_STYLES[color] || METRIC_STYLES.gray
  return (
    <button
      onClick={onClick}
      className={`${s.bg} rounded-xl px-4 py-3 flex items-center gap-3 text-left transition-shadow hover:shadow-md ${highlight ? 'ring-2 ring-red-200' : ''} ${selected ? 'ring-2 ring-gray-400' : ''}`}
    >
      <div className={`${s.icon} flex-shrink-0`}>{icon}</div>
      <div className="min-w-0">
        <div className={`${s.val} font-bold text-lg leading-none`}>
          {value}
          {sub && <span className="ml-1.5 text-xs font-semibold opacity-70">{sub}</span>}
        </div>
        <div className="text-gray-400 text-xs mt-0.5 truncate">{label}</div>
      </div>
    </button>
  )
}

function MetricDetail({ metric, onClose, onOpenPartner }) {
  const { list, total, explain, grouped, showDate, label } = metric
  const sorted = [...list].sort((a, b) => (Number(b.financialValue) || 0) - (Number(a.financialValue) || 0))
  const isBarter = p => (p.notes || '').startsWith('RUILDIENST')

  const groups = grouped
    ? STATUSES.filter(st => st !== 'Afgewezen')
        .map(st => ({ st, items: sorted.filter(p => p.status === st) }))
        .filter(g => g.items.length)
    : [{ st: null, items: sorted }]

  const row = p => (
    <button
      key={p.id}
      onClick={() => onOpenPartner(p)}
      className="w-full flex items-center justify-between gap-3 px-3 py-1.5 text-sm text-left hover:bg-gray-50 rounded-md"
    >
      <span className="truncate text-gray-800">
        {p.company}
        {isBarter(p) && <span className="ml-2 text-xs text-gray-400">(ruilwaarde)</span>}
        {!grouped && <span className="ml-2 text-xs text-gray-400">{p.status}</span>}
      </span>
      <span className="flex-shrink-0 tabular-nums text-gray-600">
        {showDate ? p.followUpDate : `€ ${fmt(Number(p.financialValue) || 0)}`}
      </span>
    </button>
  )

  return (
    <div className="mx-4 md:mx-6 mb-3 bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="flex items-start justify-between gap-3 px-4 pt-3">
        <div>
          <div className="font-semibold text-gray-900 text-sm">{label}</div>
          <div className="text-xs text-gray-500 mt-0.5">{explain}</div>
        </div>
        <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700 rounded">
          <X size={16} />
        </button>
      </div>

      <div className="px-2 py-2 max-h-72 overflow-y-auto">
        {list.length === 0 && <div className="px-3 py-2 text-sm text-gray-400">Geen partners.</div>}
        {groups.map(g => (
          <div key={g.st || 'all'} className="mb-1">
            {g.st && (
              <div className="flex justify-between px-3 pt-2 pb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <span>{g.st} ({g.items.length})</span>
                <span className="tabular-nums">€ {fmt(g.items.reduce((t, p) => t + (Number(p.financialValue) || 0), 0))}</span>
              </div>
            )}
            {g.items.map(row)}
          </div>
        ))}
      </div>

      {total !== null && (
        <div className="px-4 py-2 border-t border-gray-100 text-xs text-gray-500">
          <div className="flex justify-between font-semibold text-gray-900 text-sm">
            <span>Totaal</span>
            <span className="tabular-nums">€ {fmt(total)}</span>
          </div>
          {sorted.filter(p => (Number(p.financialValue) || 0) > 0).length > 0 && (
            <div className="mt-1 break-words">
              {sorted.filter(p => (Number(p.financialValue) || 0) > 0).map(p => fmt(Number(p.financialValue))).join(' + ')} = {fmt(total)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
