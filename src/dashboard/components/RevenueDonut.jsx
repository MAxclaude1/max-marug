import { useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const TIERS = [
  { key: 'Main Partner',     color: '#C91E2D' },
  { key: 'Event Partner',    color: '#2563eb' },
  { key: 'Vacature Partner', color: '#d97706' },
  { key: 'Eenmalig',         color: '#94a3b8' },
]

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2 leading-none">
      {children}
    </p>
  )
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-gray-900 text-white text-xs rounded-lg shadow-xl px-3 py-2">
      <p className="font-semibold">{d.name}</p>
      <p className="text-gray-300">
        {d.count} deal{d.count !== 1 ? 's' : ''} · € {d.value.toLocaleString('nl-NL')}
      </p>
    </div>
  )
}

export default function RevenueDonut({ partners }) {
  const { data, total } = useMemo(() => {
    const closed = partners.filter(p => p.status === 'Deal gesloten')
    const total = closed.reduce((s, p) => s + (Number(p.financialValue) || 0), 0)
    const data = TIERS.map(tier => {
      const items = closed.filter(p => p.partnershipTier === tier.key)
      return {
        name: tier.key,
        value: items.reduce((s, p) => s + (Number(p.financialValue) || 0), 0),
        count: items.length,
        color: tier.color,
      }
    }).filter(d => d.value > 0)
    return { data, total }
  }, [partners])

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col">
      <SectionLabel>Bevestigde omzet per tier</SectionLabel>

      {data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-28 h-28 rounded-full border-[10px] border-gray-100 mx-auto mb-3" />
            <p className="text-sm text-gray-400">Nog geen deals gesloten</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-4 flex-1">
          {/* Donut */}
          <div className="relative shrink-0" style={{ width: 160, height: 160 }}>
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={76}
                  dataKey="value"
                  strokeWidth={2}
                  stroke="#fff"
                  paddingAngle={2}
                  isAnimationActive
                  animationDuration={600}
                >
                  {data.map(d => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-lg font-heading font-bold text-gray-900 leading-none">
                € {total.toLocaleString('nl-NL')}
              </span>
              <span className="text-[10px] text-gray-400 mt-0.5">totaal</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            {data.map(d => (
              <div key={d.name} className="flex items-center gap-2 min-w-0">
                <div
                  className="w-2.5 h-2.5 rounded-sm shrink-0"
                  style={{ backgroundColor: d.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-700 truncate leading-tight">
                    {d.name}
                  </p>
                  <p className="text-[10px] text-gray-400 leading-tight">
                    {d.count} deal{d.count !== 1 ? 's' : ''} · € {d.value.toLocaleString('nl-NL')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
