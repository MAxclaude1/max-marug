import { useMemo, useState } from 'react'

const FUNNEL_STAGES = [
  { key: 'Lead',               color: '#94a3b8', label: 'Lead' },
  { key: 'Benaderd',           color: '#3b82f6', label: 'Benaderd' },
  { key: 'In gesprek',         color: '#f59e0b', label: 'In gesprek' },
  { key: 'Voorstel verstuurd', color: '#8b5cf6', label: 'Voorstel verstuurd' },
  { key: 'Deal gesloten',      color: '#10b981', label: 'Deal gesloten' },
]

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2 leading-none">
      {children}
    </p>
  )
}

export default function PipelineFunnel({ partners }) {
  const [tooltip, setTooltip] = useState(null)

  const stages = useMemo(() => {
    const rejected = partners.filter(p => p.status === 'Afgewezen')
    const active = partners.filter(p => p.status !== 'Afgewezen')
    const total = partners.length

    return {
      stages: FUNNEL_STAGES.map(stage => {
        const items = partners.filter(p => p.status === stage.key)
        const avgValue =
          items.length > 0
            ? Math.round(items.reduce((s, p) => s + (Number(p.financialValue) || 0), 0) / items.length)
            : 0
        return {
          ...stage,
          count: items.length,
          percent: total > 0 ? Math.round((items.length / total) * 100) : 0,
          companies: items.map(p => p.company),
          avgValue,
        }
      }),
      maxCount: Math.max(...FUNNEL_STAGES.map(s => partners.filter(p => p.status === s.key).length), 1),
      rejected: rejected.length,
      rejectedPct: total > 0 ? Math.round((rejected.length / total) * 100) : 0,
      activeCount: active.length,
    }
  }, [partners])

  function handleBarHover(e, stage) {
    setTooltip({ stage, x: e.clientX, y: e.clientY })
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <SectionLabel>Pipeline overzicht</SectionLabel>

      {partners.length === 0 ? (
        <div className="h-36 flex items-center justify-center text-sm text-gray-400">
          Nog geen data
        </div>
      ) : (
        <div className="space-y-2">
          {stages.stages.map(stage => {
            const widthPct = stages.maxCount > 0 ? (stage.count / stages.maxCount) * 100 : 0
            return (
              <div key={stage.key} className="flex items-center gap-2 group">
                {/* Stage label */}
                <div className="w-36 shrink-0 text-right">
                  <span className="text-xs font-medium text-gray-600 truncate block">
                    {stage.label}
                  </span>
                </div>

                {/* Bar */}
                <div
                  className="flex-1 h-6 bg-gray-50 rounded-md overflow-hidden cursor-default relative"
                  onMouseMove={e => handleBarHover(e, stage)}
                  onMouseLeave={() => setTooltip(null)}
                >
                  <div
                    className="h-full rounded-md funnel-bar transition-all duration-500"
                    style={{
                      width: `${widthPct}%`,
                      backgroundColor: stage.color,
                      minWidth: stage.count > 0 ? '8px' : '0',
                    }}
                  />
                </div>

                {/* Count + pct */}
                <div className="w-16 shrink-0 text-right">
                  <span className="text-xs font-semibold text-gray-700 tabular-nums">
                    {stage.count}
                  </span>
                  <span className="text-[10px] text-gray-400 ml-1">
                    ({stage.percent}%)
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Rejected stat */}
      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-red-300 shrink-0" />
        <span className="text-xs text-gray-500">
          Afgewezen:{' '}
          <span className="font-semibold text-gray-700">{stages.rejected}</span>
          <span className="text-gray-400"> ({stages.rejectedPct}%)</span>
        </span>
      </div>

      {/* Floating tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{ left: tooltip.x + 12, top: tooltip.y - 8 }}
        >
          <div className="bg-gray-900 text-white text-xs rounded-lg shadow-xl p-3 max-w-[200px]">
            <p className="font-semibold mb-1" style={{ color: tooltip.stage.color }}>
              {tooltip.stage.label}
            </p>
            <p className="text-gray-300 mb-1">
              {tooltip.stage.count} bedrijven · gem. € {tooltip.stage.avgValue.toLocaleString('nl-NL')}
            </p>
            {tooltip.stage.companies.length > 0 && (
              <ul className="text-gray-400 space-y-0.5">
                {tooltip.stage.companies.slice(0, 5).map(c => (
                  <li key={c} className="truncate">· {c}</li>
                ))}
                {tooltip.stage.companies.length > 5 && (
                  <li className="text-gray-500">+{tooltip.stage.companies.length - 5} meer</li>
                )}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
