import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import KanbanCard from './KanbanCard'

export default function KanbanColumn({ status, config, partners, onOpenPartner, onNewPartner, draggingId }) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div className="kanban-column flex flex-col">
      {/* Column header */}
      <div
        className="flex items-center justify-between mb-3 px-1"
      >
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ background: config.border }}
          />
          <span className="font-semibold text-sm text-gray-700">{status}</span>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: config.bg, color: config.color }}
          >
            {partners.length}
          </span>
        </div>
        <button
          onClick={() => onNewPartner(status)}
          className="w-6 h-6 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          title={`Toevoegen aan ${status}`}
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Top border accent */}
      <div
        className="h-0.5 rounded-full mb-3 opacity-60"
        style={{ background: config.border }}
      />

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`flex-1 flex flex-col gap-2.5 rounded-xl min-h-[120px] transition-colors ${
          isOver ? 'bg-gray-100' : 'bg-transparent'
        }`}
      >
        <SortableContext
          items={partners.map(p => p.id)}
          strategy={verticalListSortingStrategy}
        >
          {partners.map(partner => (
            <KanbanCard
              key={partner.id}
              partner={partner}
              onOpen={onOpenPartner}
              isDragging={draggingId === partner.id}
            />
          ))}
        </SortableContext>

        {/* Empty state */}
        {partners.length === 0 && (
          <div
            className={`flex-1 flex flex-col items-center justify-center py-8 rounded-xl border-2 border-dashed transition-colors ${
              isOver ? 'border-gray-400 bg-gray-50' : 'border-gray-200'
            }`}
          >
            <span className="text-gray-300 text-sm">Geen leads</span>
            <button
              onClick={() => onNewPartner(status)}
              className="mt-2 text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2"
            >
              + Toevoegen
            </button>
          </div>
        )}

        {/* Add button at bottom of non-empty column */}
        {partners.length > 0 && (
          <button
            onClick={() => onNewPartner(status)}
            className="w-full py-2 rounded-lg border-2 border-dashed border-gray-200 text-sm text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors flex items-center justify-center gap-1"
          >
            <Plus size={13} />
            Toevoegen
          </button>
        )}
      </div>
    </div>
  )
}
