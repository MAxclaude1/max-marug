import { useMemo } from 'react'
import { useCountUp } from '../hooks'

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1 leading-none">
      {children}
    </p>
  )
}

function KpiCard({ label, accentColor, value, subLabel, children }) {
  return (
    <div
      className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 relative overflow-hidden border-l-4 flex flex-col gap-1"
      style={{ borderLeftColor: accentColor }}
    >
      <SectionLabel>{label}</SectionLabel>
      <p className="text-3xl font-heading font-bold text-gray-900 kpi-value tabular-nums leading-none">
        {value}
      </p>
      <p className="text-[11px] text-gray-400 leading-snug">{subLabel}</p>
      {children}
    </div>
  )
}

export default function KpiCards({ partners, revenueTarget }) {
  const today = new Date().toISOString().split('T')[0]

  const stats = useMemo(() => {
    const active = partners.filter(p => p.status !== 'Afgewezen')
    const closed = partners.filter(p => p.status === 'Deal gesloten')
    const pipelineValue = active.reduce((sum, p) => sum + (Number(p.financialValue) || 0), 0)
    const confirmedRevenue = closed.reduce((sum, p) => sum + (Number(p.financialValue) || 0), 0)
    const followUpsToday = partners.filter(
      p =>
        p.followUpDate &&
        p.followUpDate <= today &&
        p.status !== 'Deal gesloten' &&
        p.status !== 'Afgewezen'
    ).length
    const conversionRate =
      partners.length > 0 ? Math.round((closed.length / partners.length) * 100) : 0

    return { active: active.length, closed: closed.length, pipelineValue, confirmedRevenue, followUpsToday, conversionRate }
  }, [partners, today])

  const revenueRatio = Math.min(stats.confirmedRevenue / revenueTarget, 1)
  const progressColor =
    revenueRatio >= 0.8 ? '#059669' : revenueRatio >= 0.5 ? '#d97706' : '#C91E2D'

  const activeCount    = useCountUp(stats.active)
  const closedCount    = useCountUp(stats.closed)
  const pipelineVal    = useCountUp(stats.pipelineValue)
  const confirmedVal   = useCountUp(stats.confirmedRevenue)
  const followUpsCount = useCountUp(stats.followUpsToday)

  function fmtEur(n) {
    return '€ ' + n.toLocaleString('nl-NL')
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      <KpiCard
        label="Actieve leads"
        accentColor="#6b7280"
        value={activeCount}
        subLabel="niet afgewezen"
      />

      <KpiCard
        label="Deals gesloten"
        accentColor="#059669"
        value={closedCount}
        subLabel={'Conversie: ' + stats.conversionRate + '%'}
      />

      <KpiCard
        label="Pipeline waarde"
        accentColor="#2563eb"
        value={fmtEur(pipelineVal)}
        subLabel="incl. lopende deals"
      />

      <KpiCard
        label="Bevestigde omzet"
        accentColor={progressColor}
        value={fmtEur(confirmedVal)}
        subLabel={'Doel: € ' + revenueTarget.toLocaleString('nl-NL')}
      >
        <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: (revenueRatio * 100) + '%', backgroundColor: progressColor }}
          />
        </div>
      </KpiCard>

      <KpiCard
        label="Follow-ups vandaag"
        accentColor={stats.followUpsToday > 0 ? '#C91E2D' : '#6b7280'}
        value={
          <span style={{ color: stats.followUpsToday > 0 ? '#C91E2D' : undefined }}>
            {followUpsCount}
          </span>
        }
        subLabel="openstaande follow-ups"
      />
    </div>
  )
}
