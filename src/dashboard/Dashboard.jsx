import { useState, useEffect, useMemo } from 'react'
import { MOCK_PARTNERS } from './mockData'
import { useLocalStorage } from './hooks'
import DashboardHeader from './components/DashboardHeader'
import KpiCards from './components/KpiCards'
import PipelineFunnel from './components/PipelineFunnel'
import RevenueDonut from './components/RevenueDonut'
import SectorBars from './components/SectorBars'
import EventsPopularity from './components/EventsPopularity'
import FollowUpList from './components/FollowUpList'
import ActivityFeed from './components/ActivityFeed'

const CONFIG = {
  REVENUE_TARGET: 8000,
  CRM_URL: '/',
  STORAGE_KEY: 'marug_crm_partners',
  ACADEMIC_YEAR: '2025-2026',
  REFRESH_INTERVAL: 30000,
}

function getYearRange(year) {
  const [startYear, endYear] = year.split('-').map(Number)
  return {
    from: new Date(`${startYear}-09-01T00:00:00`),
    to: new Date(`${endYear}-08-31T23:59:59`),
  }
}

export default function Dashboard() {
  const { partners: rawPartners, isMock, isError, refresh } = useLocalStorage(
    CONFIG.STORAGE_KEY,
    MOCK_PARTNERS
  )

  const [selectedYear, setSelectedYear] = useState(CONFIG.ACADEMIC_YEAR)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [selectedSector, setSelectedSector] = useState(null)

  // Auto-refresh
  useEffect(() => {
    const interval = setInterval(refresh, CONFIG.REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [refresh])

  const partners = useMemo(() => {
    if (!rawPartners?.length) return []
    if (isMock) return rawPartners
    const range = getYearRange(selectedYear)
    return rawPartners.filter(p => {
      const d = new Date(p.createdAt)
      return d >= range.from && d <= range.to
    })
  }, [rawPartners, selectedYear, isMock])

  const lastUpdated = useMemo(() => {
    if (!partners.length) return null
    return partners.reduce((max, p) => {
      const d = new Date(p.updatedAt)
      return d > max ? d : max
    }, new Date(0))
  }, [partners])

  function handleEventClick(event) {
    setSelectedEvent(prev => (prev === event ? null : event))
  }

  function handleSectorClick(sector) {
    setSelectedSector(prev => (prev === sector ? null : sector))
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-200 max-w-sm text-center">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-xl">⚠️</span>
          </div>
          <h2 className="text-base font-semibold font-heading text-gray-900 mb-2">Data kon niet worden geladen</h2>
          <p className="text-sm text-gray-500 mb-5">
            Controleer of de CRM tracker correct is geconfigureerd en probeer opnieuw.
          </p>
          <button
            onClick={refresh}
            className="px-5 py-2 bg-[#C91E2D] text-white rounded-lg text-sm font-medium hover:bg-[#A8171F] transition-colors"
          >
            Opnieuw proberen
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-body">
      {isMock && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-2 text-center text-xs font-medium text-amber-700">
          Demo-modus: open de CRM tracker om echte data toe te voegen.
        </div>
      )}

      <DashboardHeader
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        onRefresh={refresh}
        crmUrl={CONFIG.CRM_URL}
        lastUpdated={lastUpdated}
      />

      <main className="px-4 md:px-6 pb-4 pt-3 space-y-3">
        <KpiCards partners={partners} revenueTarget={CONFIG.REVENUE_TARGET} />

        <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-3">
          <PipelineFunnel partners={partners} crmUrl={CONFIG.CRM_URL} />
          <RevenueDonut partners={partners} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <SectorBars
            partners={partners}
            selectedSector={selectedSector}
            onSectorClick={handleSectorClick}
          />
          <EventsPopularity
            partners={partners}
            selectedEvent={selectedEvent}
            onEventClick={handleEventClick}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[40fr_60fr] gap-3">
          <FollowUpList
            partners={partners}
            selectedEvent={selectedEvent}
            crmUrl={CONFIG.CRM_URL}
          />
          <ActivityFeed partners={partners} crmUrl={CONFIG.CRM_URL} />
        </div>
      </main>
    </div>
  )
}
