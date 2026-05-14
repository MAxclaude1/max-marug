import { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts'

const SECTORS = ['Consultancy', 'Tech', 'Finance', 'Retail', 'Media', 'Overig']

// MARUG red gradient shades
const SECTOR_COLORS = [
  '#C91E2D', '#D94050', '#E56070', '#9B1522', '#7A1019', '#B03040',
]

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2 leading-none">
      {children}
    </p>
  )
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-gray-900 text-white text-xs rounded-lg shadow-xl px-3 py-2">
      <p className="font-semibold mb-1">{label}</p>
      <p className="text-gray-300">
        {d.count} deal{d.count !== 1 ? 's' : ''} gesloten
      </p>
      {d.totalValue > 0 && (
        <p className="text-gray-400">€ {d.totalValue.toLocaleString('nl-NL')} totaal</p>
      )}
    </div>
  )
}

export default function SectorBars({ partners, selectedSector, onSectorClick }) {
  const data = useMemo(() => {
    const closed = partners.filter(p => p.status === 'Deal gesloten')
    return SECTORS.map((sector, i) => {
      const items = closed.filter(p => p.sector === sector)
      return {
        sector,
        count: items.length,
        totalValue: items.reduce((s, p) => s + (Number(p.financialValue) || 0), 0),
        colorIndex: i,
      }
    })
  }, [partners])

  const hasClosed = data.some(d => d.count > 0)

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <SectionLabel>Deals per sector</SectionLabel>

      {!hasClosed ? (
        <div className="h-36 flex items-center justify-center text-sm text-gray-400">
          Nog geen deals gesloten
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={160}>
          <BarChart
            data={data}
            barCategoryGap="30%"
            margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
          >
            <XAxis
              dataKey="sector"
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
            <Bar
              dataKey="count"
              radius={[4, 4, 0, 0]}
              isAnimationActive
              animationDuration={500}
              cursor="pointer"
              onClick={d => onSectorClick(d.sector)}
            >
              {data.map(d => (
                <Cell
                  key={d.sector}
                  fill={SECTOR_COLORS[d.colorIndex % SECTOR_COLORS.length]}
                  opacity={selectedSector && selectedSector !== d.sector ? 0.35 : 1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {selectedSector && (
        <button
          onClick={() => onSectorClick(selectedSector)}
          className="mt-2 text-[10px] text-gray-400 hover:text-gray-600 underline"
        >
          Wis filter: {selectedSector}
        </button>
      )}
    </div>
  )
}
