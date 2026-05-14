import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import { STATUSES, STATUS_CONFIG } from '../data/constants'
import KanbanColumn from './KanbanColumn'
import KanbanCard from './KanbanCard'

export default function KanbanBoard({ partners, onMovePartner, onOpenPartner, onNewPartner }) {
  const [activeId, setActiveId] = useState(null)

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
    // over.id can be a column id (status string) or a card id
    const targetStatus = STATUSES.includes(over.id) ? over.id : null
    if (targetStatus && active.id) {
      const partner = partners.find(p => p.id === active.id)
      if (partner && partner.status !== targetStatus) {
        onMovePartner(active.id, targetStatus)
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="kanban-board">
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
