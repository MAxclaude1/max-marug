import { useState } from 'react'
import { ChevronUp, ChevronDown, Plus, CalendarClock } from 'lucide-react'
import { STATUS_CONFIG, PRIORITY_CONFIG, SECTOR_COLORS } from '../data/constants'

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

function fmtDate(iso) {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  return `${d}-${m}-${y}`
}

function fmt(n) {
  if (!n) return '—'
  return '€ ' + new Intl.NumberFormat('nl-NL').format(n)
}

const COLUMNS = [
  { key: 'company',         label: 'Bedrijf',      sortable: true },
  { key: 'contactName',     label: 'Contact',      sortable: true },
  { key: 'sector',          label: 'Sector',       sortable: true },
  { key: 'partnershipTier', label: 'Tier',         sortable: true },
  { key: 'status',          label: 'Status',       sortable: true },
  { key: 'events',          label: 'Events',       sortable: false },
  { key: 'financialValue',  label: '€',            sortable: true },
  { key: 'followUpDate',    label: 'Follow-up',    sortable: true },
  { key: 'priority',        label: 'Prioriteit',   sortable: true },
]

export default function TableView({ partners, onOpenPartner, onNewPartner }) {
  const [sortKey, setSortKey] = useState('followUpDate')
  const [sortDir, setSortDir] = useState('asc')
  const today = todayStr()

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sorted = [...partners].sort((a, b) => {
    let av = a[sortKey] ?? ''
    let bv = b[sortKey] ?? ''
    if (sortKey === 'financialValue') {
      av = Number(av) || 0
      bv = Number(bv) || 0
      return sortDir === 'asc' ? av - bv : bv - av
    }
    av = String(av).toLowerCase()
    bv = String(bv).toLowerCase()
    if (av < bv) return sortDir === 'asc' ? -1 : 1
    if (av > bv) return sortDir === 'asc' ? 1 : -1
    return 0
  })

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {COLUMNS.map(col => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap ${
                    col.sortable ? 'cursor-pointer hover:text-gray-700 select-none' : ''
                  }`}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && (
                      <span className="inline-flex flex-col">
                        <ChevronUp
                          size={10}
                          className={sortKey === col.key && sortDir === 'asc' ? 'text-red-500' : 'text-gray-300'}
                        />
                        <ChevronDown
                          size={10}
                          className={sortKey === col.key && sortDir === 'desc' ? 'text-red-500' : 'text-gray-300'}
                          style={{ marginTop: '-3px' }}
                        />
                      </span>
                    )}
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Acties
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sorted.map(partner => {
              const isAfgewezen = partner.status === 'Afgewezen'
              const isOverdue = partner.followUpDate && partner.followUpDate <= today
              const statusCfg = STATUS_CONFIG[partner.status] || {}
              const priorityCfg = PRIORITY_CONFIG[partner.priority] || {}
              const sectorCfg = SECTOR_COLORS[partner.sector] || SECTOR_COLORS['Overig']

              return (
                <tr
                  key={partner.id}
                  className={`partner-row cursor-pointer transition-colors ${isAfgewezen ? 'opacity-50' : ''}`}
                  onClick={() => onOpenPartner(partner)}
                >
                  {/* Bedrijf */}
                  <td className="px-4 py-3">
                    <span className="font-semibold text-gray-900">{partner.company}</span>
                  </td>

                  {/* Contact */}
                  <td className="px-4 py-3 text-gray-600">
                    {partner.contactName || <span className="text-gray-300">—</span>}
                  </td>

                  {/* Sector */}
                  <td className="px-4 py-3">
                    {partner.sector ? (
                      <span
                        className="inline-block text-xs font-medium px-2 py-0.5 rounded-full border"
                        style={{ background: sectorCfg.bg, color: sectorCfg.text, borderColor: sectorCfg.border }}
                      >
                        {partner.sector}
                      </span>
                    ) : <span className="text-gray-300">—</span>}
                  </td>

                  {/* Tier */}
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap text-xs">
                    {partner.partnershipTier || <span className="text-gray-300">—</span>}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span
                      className="status-badge inline-block text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: statusCfg.bg, color: statusCfg.color }}
                    >
                      {partner.status}
                    </span>
                  </td>

                  {/* Events */}
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {(partner.events || []).slice(0, 2).map(e => (
                        <span key={e} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                          {e}
                        </span>
                      ))}
                      {(partner.events || []).length > 2 && (
                        <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                          +{partner.events.length - 2}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Value */}
                  <td className="px-4 py-3 text-gray-700 font-medium whitespace-nowrap">
                    {fmt(partner.financialValue)}
                  </td>

                  {/* Follow-up */}
                  <td className="px-4 py-3">
                    {partner.followUpDate ? (
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                        isOverdue ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {isOverdue && <CalendarClock size={11} />}
                        {isOverdue ? 'Follow-up!' : fmtDate(partner.followUpDate)}
                      </span>
                    ) : <span className="text-gray-300">—</span>}
                  </td>

                  {/* Priority */}
                  <td className="px-4 py-3">
                    {partner.priority ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ background: priorityCfg.color }}
                        />
                        {partner.priority}
                      </span>
                    ) : <span className="text-gray-300">—</span>}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <button
                      onClick={e => { e.stopPropagation(); onOpenPartner(partner) }}
                      className="text-xs text-gray-400 hover:text-gray-700 font-medium px-2 py-1 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      Bewerken
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {sorted.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-gray-400 mb-3">Geen partners gevonden</p>
            <button
              onClick={onNewPartner}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-lg"
              style={{ background: '#C91E2D' }}
            >
              <Plus size={15} />
              Eerste partner toevoegen
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
