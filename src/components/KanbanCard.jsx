import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CalendarClock, Euro } from 'lucide-react'
import { PRIORITY_CONFIG, SECTOR_COLORS, STATUS_CONFIG } from '../data/constants'

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

function fmtDate(iso) {
  if (!iso) return null
  const [y, m, d] = iso.split('-')
  return `${d}-${m}-${y}`
}

function fmt(n) {
  return new Intl.NumberFormat('nl-NL').format(n)
}

export default function KanbanCard({ partner, onOpen, isDragging }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: partner.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.3 : 1,
  }

  const today = todayStr()
  const isOverdue = partner.followUpDate && partner.followUpDate <= today
  const priorityCfg = PRIORITY_CONFIG[partner.priority]
  const sectorCfg = SECTOR_COLORS[partner.sector] || SECTOR_COLORS['Overig']
  const statusCfg = STATUS_CONFIG[partner.status]

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onOpen(partner)}
      className={`kanban-card bg-white rounded-xl border border-gray-200 p-3.5 cursor-pointer select-none ${
        isDragging ? 'shadow-2xl rotate-1' : 'shadow-sm'
      }`}
    >
      {/* Top row: company + priority dot */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 flex-1">
          {partner.company}
        </span>
        {partner.priority && priorityCfg && (
          <div
            className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-0.5"
            style={{ background: priorityCfg.color }}
            title={partner.priority}
          />
        )}
      </div>

      {/* Sector badge */}
      {partner.sector && (
        <span
          className="inline-block text-xs font-medium px-2 py-0.5 rounded-full border mb-2"
          style={{
            background: sectorCfg.bg,
            color: sectorCfg.text,
            borderColor: sectorCfg.border,
          }}
        >
          {partner.sector}
        </span>
      )}

      {/* Contact name */}
      {partner.contactName && (
        <div className="text-xs text-gray-500 mb-2 truncate">{partner.contactName}</div>
      )}

      {/* Bottom row: value + follow-up */}
      <div className="flex items-center justify-between mt-1 gap-2">
        {partner.financialValue ? (
          <span className="flex items-center gap-1 text-xs font-semibold text-gray-700">
            <Euro size={11} className="text-gray-400" />
            {fmt(partner.financialValue)}
          </span>
        ) : (
          <span />
        )}

        {partner.followUpDate && (
          <span
            className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
              isOverdue
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            <CalendarClock size={11} />
            {isOverdue ? 'Follow-up!' : fmtDate(partner.followUpDate)}
          </span>
        )}
      </div>

      {/* Tier badge (small) */}
      {partner.partnershipTier && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-400">{partner.partnershipTier}</span>
        </div>
      )}
    </div>
  )
}
