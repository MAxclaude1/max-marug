import { useState, useRef } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { STATUSES, STATUS_CONFIG } from '../data/constants'
import KanbanColumn from './KanbanColumn'
import KanbanCard from './KanbanCard'

export default function KanbanBoard({ partners, onMovePartner, onOpenPartner, onNewPartner }) {
  const [activeId, setActiveId] = useState(null)
  const boardRef = useRef(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const activePartner = activeId ? partners.find(p => p.id === activeId) : null

  function handleDragStart({ active }) {
    setActiveId(active.id)
  }

  function handleDragEnd({ active, over }) {
    setActiveId(null)
    if (!over) return
    const targetStatus = STATUSES.includes(over.id) ? over.id : null
    if (targetStatus && active.id) {
      const partner = partners.find(p => p.id === active.id)
      if (partner && partner.status !== targetStatus) {
        onMovePartner(active.id, targetStatus)
      }
    }
  }

  function scroll(dir) {
    boardRef.current?.scrollBy({ left: dir * 300, behavior: 'smooth' })
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div ref={boardRef} className="kanban-board">
        {STATUSES.map(status => {
          const columnPartners = partners.filter(p => p.status === status)
          return (
            <KanbanColumn
              key={status}
              status={status}
              config={STATUS_CONFIG[status]}
              partners={columnPartners}
              onOpenPartner={onOpenPartner}
              onNewPartner={onNewPartner}
              draggingId={activeId}
            />
          )
        })}
      </div>

      {/* Scroll nav */}
      <div className="flex items-center gap-2 mt-3">
        <button
          onClick={() => scroll(-1)}
          className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition-colors"
        >
          <ChevronLeft size={14} /> Links
        </button>
        <button
          onClick={() => scroll(1)}
          className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition-colors"
        >
          Rechts <ChevronRight size={14} />
        </button>
      </div>

      <DragOverlay>
        {activePartner ? (
          <div className="rotate-2 opacity-95 shadow-2xl">
            <KanbanCard partner={activePartner} onOpen={() => {}} isDragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
