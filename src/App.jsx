import { useState, useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { SAMPLE_PARTNERS } from './data/sampleData'
import Header from './components/Header'
import KanbanBoard from './components/KanbanBoard'
import TableView from './components/TableView'
import PartnerDrawer from './components/PartnerDrawer'
import FilterBar from './components/FilterBar'
import Toast from './components/Toast'
import DeleteModal from './components/DeleteModal'

const STORAGE_KEY = 'marug_crm_partners'

function loadPartners() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return SAMPLE_PARTNERS
}

function savePartners(partners) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(partners))
}

export default function App() {
  const [partners, setPartners] = useState(loadPartners)
  const [view, setView] = useState(() => window.innerWidth < 768 ? 'table' : 'kanban')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingPartner, setEditingPartner] = useState(null)
  const [defaultStatus, setDefaultStatus] = useState('Lead')
  const [toast, setToast] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState([])
  const [filterSector, setFilterSector] = useState('')
  const [filterPriority, setFilterPriority] = useState('')
  const [filterTier, setFilterTier] = useState('')
  const [showAfgewezen, setShowAfgewezen] = useState(false)

  useEffect(() => {
    savePartners(partners)
  }, [partners])

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 768) setView('table')
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') {
        setDrawerOpen(false)
        setDeleteConfirm(null)
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 2800)
  }, [])

  const openNewPartner = useCallback((status = 'Lead') => {
    setEditingPartner(null)
    setDefaultStatus(status)
    setDrawerOpen(true)
  }, [])

  const openEditPartner = useCallback((partner) => {
    setEditingPartner(partner)
    setDrawerOpen(true)
  }, [])

  const savePartner = useCallback((formData) => {
    const now = new Date().toISOString()
    if (formData.id) {
      setPartners(prev =>
        prev.map(p => p.id === formData.id ? { ...formData, updatedAt: now } : p)
      )
    } else {
      const newPartner = {
        ...formData,
        id: uuidv4(),
        createdAt: now,
        updatedAt: now,
      }
      setPartners(prev => [newPartner, ...prev])
    }
    setDrawerOpen(false)
    showToast('Opgeslagen ✓')
  }, [showToast])

  const deletePartner = useCallback((id) => {
    setDeleteConfirm(id)
  }, [])

  const confirmDelete = useCallback(() => {
    setPartners(prev => prev.filter(p => p.id !== deleteConfirm))
    setDeleteConfirm(null)
    setDrawerOpen(false)
    showToast('Partner verwijderd', 'info')
  }, [deleteConfirm, showToast])

  const movePartner = useCallback((id, newStatus) => {
    const now = new Date().toISOString()
    setPartners(prev =>
      prev.map(p => p.id === id ? { ...p, status: newStatus, updatedAt: now } : p)
    )
  }, [])

  const filteredPartners = partners.filter(p => {
    if (!showAfgewezen && p.status === 'Afgewezen') return false
    if (filterStatus.length && !filterStatus.includes(p.status)) return false
    if (filterSector && p.sector !== filterSector) return false
    if (filterPriority && p.priority !== filterPriority) return false
    if (filterTier && p.partnershipTier !== filterTier) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        p.company.toLowerCase().includes(q) ||
        (p.contactName || '').toLowerCase().includes(q) ||
        (p.notes || '').toLowerCase().includes(q)
      )
    }
    return true
  })

  const activeFilterCount = [
    filterStatus.length > 0,
    !!filterSector,
    !!filterPriority,
    !!filterTier,
    showAfgewezen,
  ].filter(Boolean).length

  const exportCSV = useCallback(() => {
    const headers = [
      'Bedrijf','Sector','Contactpersoon','E-mail','Telefoon','LinkedIn',
      'Partnership Tier','Status','Events','Financiële waarde (€)','Bron',
      'Prioriteit','Follow-up datum','Laatste contact','Notities','Aangemaakt','Bijgewerkt'
    ]
    const rows = partners.map(p => [
      p.company, p.sector, p.contactName, p.contactEmail, p.contactPhone,
      p.contactLinkedIn, p.partnershipTier, p.status,
      (p.events || []).join('; '), p.financialValue, p.source, p.priority,
      p.followUpDate, p.lastContactDate, p.notes, p.createdAt, p.updatedAt,
    ])
    const csv = [headers, ...rows]
      .map(row => row.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `marug-partners-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    showToast('CSV geëxporteerd ✓')
  }, [partners, showToast])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        partners={partners}
        view={view}
        setView={setView}
        onExport={exportCSV}
        onNewPartner={() => openNewPartner('Lead')}
      />

      <main className="px-4 md:px-6 pb-8">
        <FilterBar
          search={search} setSearch={setSearch}
          filterStatus={filterStatus} setFilterStatus={setFilterStatus}
          filterSector={filterSector} setFilterSector={setFilterSector}
          filterPriority={filterPriority} setFilterPriority={setFilterPriority}
          filterTier={filterTier} setFilterTier={setFilterTier}
          showAfgewezen={showAfgewezen} setShowAfgewezen={setShowAfgewezen}
          activeFilterCount={activeFilterCount}
        />

        {view === 'kanban' ? (
          <KanbanBoard
            partners={filteredPartners}
            onMovePartner={movePartner}
            onOpenPartner={openEditPartner}
            onNewPartner={openNewPartner}
          />
        ) : (
          <TableView
            partners={filteredPartners}
            onOpenPartner={openEditPartner}
            onNewPartner={() => openNewPartner('Lead')}
          />
        )}
      </main>

      <PartnerDrawer
        open={drawerOpen}
        partner={editingPartner}
        defaultStatus={defaultStatus}
        onClose={() => setDrawerOpen(false)}
        onSave={savePartner}
        onDelete={deletePartner}
      />

      {deleteConfirm && (
        <DeleteModal
          onConfirm={confirmDelete}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}
