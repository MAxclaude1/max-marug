import { useState, useEffect } from 'react'
import {
  X, Trash2, Save, ExternalLink, Mail, Phone, Link,
  ChevronDown, CalendarClock, FileText, Edit3
} from 'lucide-react'
import {
  STATUSES, SECTORS, PARTNERSHIP_TIERS, EVENTS, SOURCES, PRIORITIES,
  STATUS_CONFIG, PRIORITY_CONFIG
} from '../data/constants'

const EMPTY_FORM = {
  id: '',
  company: '',
  sector: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  contactLinkedIn: '',
  partnershipTier: '',
  status: 'Lead',
  events: [],
  financialValue: '',
  source: '',
  priority: 'Gemiddeld',
  followUpDate: '',
  lastContactDate: '',
  notes: '',
}

export default function PartnerDrawer({ open, partner, defaultStatus, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('info')

  useEffect(() => {
    if (open) {
      if (partner) {
        setForm({ ...EMPTY_FORM, ...partner })
        setIsEditing(false)
      } else {
        setForm({ ...EMPTY_FORM, status: defaultStatus })
        setIsEditing(true)
      }
      setErrors({})
      setActiveTab('info')
    }
  }, [open, partner, defaultStatus])

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }))
  }

  function toggleEvent(ev) {
    setForm(f => ({
      ...f,
      events: f.events.includes(ev) ? f.events.filter(e => e !== ev) : [...f.events, ev]
    }))
  }

  function validate() {
    const e = {}
    if (!form.company.trim()) e.company = 'Bedrijfsnaam is verplicht'
    if (!form.status) e.status = 'Status is verplicht'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSave() {
    if (!validate()) return
    onSave({
      ...form,
      financialValue: Number(form.financialValue) || 0,
    })
  }

  function handleDelete() {
    if (form.id) onDelete(form.id)
  }

  if (!open) return null

  const isNew = !partner
  const statusCfg = STATUS_CONFIG[form.status] || {}

  return (
    <>
      {/* Backdrop */}
      <div
        className="drawer-overlay fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="drawer-panel fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {isNew ? (
              <h2 className="font-bold text-gray-900 text-lg">Nieuwe partner</h2>
            ) : (
              <div className="min-w-0">
                <h2 className="font-bold text-gray-900 text-lg truncate">{form.company}</h2>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: statusCfg.bg, color: statusCfg.color }}
                >
                  {form.status}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {!isNew && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Edit3 size={14} />
                Bewerken
              </button>
            )}
            {!isNew && (
              <button
                onClick={handleDelete}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Verwijderen"
              >
                <Trash2 size={15} />
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tabs (only in view mode for existing partners) */}
        {!isNew && !isEditing && (
          <div className="flex border-b border-gray-100 px-6 flex-shrink-0">
            {[
              { id: 'info', label: 'Info' },
              { id: 'notes', label: 'Notities' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {/* View mode: Info tab */}
          {!isEditing && !isNew && activeTab === 'info' && (
            <ViewInfo partner={form} />
          )}

          {/* View mode: Notes tab */}
          {!isEditing && !isNew && activeTab === 'notes' && (
            <ViewNotes partner={form} onEdit={() => setIsEditing(true)} />
          )}

          {/* Edit / New mode */}
          {(isEditing || isNew) && (
            <EditForm
              form={form}
              errors={errors}
              set={set}
              toggleEvent={toggleEvent}
            />
          )}
        </div>

        {/* Footer */}
        {(isEditing || isNew) && (
          <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0 bg-white">
            <button
              onClick={isNew ? onClose : () => setIsEditing(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Annuleren
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-lg transition-colors"
              style={{ background: '#C91E2D' }}
              onMouseEnter={e => e.currentTarget.style.background = '#A8171F'}
              onMouseLeave={e => e.currentTarget.style.background = '#C91E2D'}
            >
              <Save size={14} />
              Opslaan
            </button>
          </div>
        )}
      </div>
    </>
  )
}

function ViewInfo({ partner }) {
  const statusCfg = STATUS_CONFIG[partner.status] || {}
  const priorityCfg = PRIORITY_CONFIG[partner.priority] || {}
  const today = new Date().toISOString().split('T')[0]
  const isOverdue = partner.followUpDate && partner.followUpDate <= today

  function fmtDate(iso) {
    if (!iso) return '—'
    const [y, m, d] = iso.split('-')
    return `${d}-${m}-${y}`
  }

  return (
    <div className="p-6 space-y-6">
      {/* Status + Pipeline */}
      <div>
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</label>
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          {STATUSES.map((s, i) => {
            const cfg = STATUS_CONFIG[s]
            const isActive = s === partner.status
            const isPast = STATUSES.indexOf(partner.status) > i
            return (
              <div key={s} className="flex items-center gap-1">
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={isActive
                    ? { background: cfg.border, color: '#fff' }
                    : { background: cfg.bg, color: isPast ? cfg.color : '#9ca3af' }
                  }
                >
                  {s}
                </span>
                {i < STATUSES.length - 1 && <span className="text-gray-200 text-xs">›</span>}
              </div>
            )
          })}
        </div>
      </div>

      {/* Grid info */}
      <div className="grid grid-cols-2 gap-4">
        <InfoField label="Sector" value={partner.sector} />
        <InfoField label="Partnership Tier" value={partner.partnershipTier} />
        <InfoField label="Prioriteit">
          {partner.priority ? (
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: priorityCfg.color }} />
              {partner.priority}
            </span>
          ) : null}
        </InfoField>
        <InfoField label="Bron" value={partner.source} />
        <InfoField label="Financiële waarde">
          {partner.financialValue ? `€ ${new Intl.NumberFormat('nl-NL').format(partner.financialValue)}` : null}
        </InfoField>
        <InfoField label="Events">
          {(partner.events || []).length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {partner.events.map(e => (
                <span key={e} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{e}</span>
              ))}
            </div>
          ) : null}
        </InfoField>
      </div>

      {/* Contact */}
      <div>
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Contactpersoon</label>
        <div className="mt-2 space-y-2">
          {partner.contactName && (
            <div className="font-medium text-gray-900">{partner.contactName}</div>
          )}
          {partner.contactEmail && (
            <a href={`mailto:${partner.contactEmail}`} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800">
              <Mail size={14} />
              {partner.contactEmail}
            </a>
          )}
          {partner.contactPhone && (
            <a href={`tel:${partner.contactPhone}`} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800">
              <Phone size={14} />
              {partner.contactPhone}
            </a>
          )}
          {partner.contactLinkedIn && (
            <a href={partner.contactLinkedIn} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800">
              <Link size={14} />
              LinkedIn profiel
              <ExternalLink size={11} />
            </a>
          )}
          {!partner.contactName && !partner.contactEmail && !partner.contactPhone && !partner.contactLinkedIn && (
            <span className="text-sm text-gray-400">Geen contactgegevens ingevuld</span>
          )}
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <InfoField label="Follow-up datum">
          {partner.followUpDate ? (
            <span className={`inline-flex items-center gap-1 text-sm font-medium ${isOverdue ? 'text-red-600' : 'text-gray-700'}`}>
              <CalendarClock size={13} />
              {fmtDate(partner.followUpDate)}
              {isOverdue && <span className="text-xs bg-red-100 text-red-700 px-1.5 rounded-full ml-1">Verlopen</span>}
            </span>
          ) : null}
        </InfoField>
        <InfoField label="Laatste contact" value={fmtDate(partner.lastContactDate)} />
      </div>

      {/* Quick notes preview */}
      {partner.notes && (
        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Notities</label>
          <p className="mt-2 text-sm text-gray-600 whitespace-pre-wrap leading-relaxed line-clamp-4">{partner.notes}</p>
        </div>
      )}
    </div>
  )
}

function ViewNotes({ partner, onEdit }) {
  return (
    <div className="p-6">
      {partner.notes ? (
        <div>
          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{partner.notes}</p>
          <button
            onClick={onEdit}
            className="mt-4 flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600"
          >
            <Edit3 size={13} />
            Notitie bewerken
          </button>
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText size={32} className="mx-auto text-gray-200 mb-3" />
          <p className="text-gray-400 text-sm mb-4">Nog geen notities voor deze partner.</p>
          <button
            onClick={onEdit}
            className="text-sm font-medium text-red-600 hover:text-red-800"
          >
            Notitie toevoegen
          </button>
        </div>
      )}
    </div>
  )
}

function InfoField({ label, value, children }) {
  const content = children || (value ? <span className="text-sm text-gray-700">{value}</span> : null)
  return (
    <div>
      <label className="text-xs font-medium text-gray-400">{label}</label>
      <div className="mt-1">
        {content || <span className="text-sm text-gray-300">—</span>}
      </div>
    </div>
  )
}

function EditForm({ form, errors, set, toggleEvent }) {
  return (
    <div className="p-6 space-y-5">
      {/* Company */}
      <Field label="Bedrijfsnaam" required error={errors.company}>
        <input
          type="text"
          value={form.company}
          onChange={e => set('company', e.target.value)}
          placeholder="bijv. Tomorrowmen"
          className={`input-field ${errors.company ? 'border-red-400' : ''}`}
        />
      </Field>

      {/* Status */}
      <Field label="Status" required error={errors.status}>
        <div className="relative">
          <select
            value={form.status}
            onChange={e => set('status', e.target.value)}
            className="input-field appearance-none pr-8"
          >
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </Field>

      {/* Sector + Tier */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Sector">
          <div className="relative">
            <select value={form.sector} onChange={e => set('sector', e.target.value)} className="input-field appearance-none pr-8">
              <option value="">Kies sector</option>
              {SECTORS.map(s => <option key={s}>{s}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </Field>
        <Field label="Partnership Tier">
          <div className="relative">
            <select value={form.partnershipTier} onChange={e => set('partnershipTier', e.target.value)} className="input-field appearance-none pr-8">
              <option value="">Kies tier</option>
              {PARTNERSHIP_TIERS.map(t => <option key={t}>{t}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </Field>
      </div>

      {/* Priority + Source */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Prioriteit">
          <div className="relative">
            <select value={form.priority} onChange={e => set('priority', e.target.value)} className="input-field appearance-none pr-8">
              <option value="">Kies prioriteit</option>
              {PRIORITIES.map(p => <option key={p}>{p}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </Field>
        <Field label="Bron">
          <div className="relative">
            <select value={form.source} onChange={e => set('source', e.target.value)} className="input-field appearance-none pr-8">
              <option value="">Kies bron</option>
              {SOURCES.map(s => <option key={s}>{s}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </Field>
      </div>

      {/* Financial value */}
      <Field label="Financiële waarde (€)">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">€</span>
          <input
            type="number"
            value={form.financialValue}
            onChange={e => set('financialValue', e.target.value)}
            placeholder="0"
            min="0"
            className="input-field pl-7"
          />
        </div>
      </Field>

      {/* Events */}
      <Field label="Events">
        <div className="flex flex-wrap gap-2">
          {EVENTS.map(ev => {
            const active = (form.events || []).includes(ev)
            return (
              <button
                key={ev}
                type="button"
                onClick={() => toggleEvent(ev)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                  active
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                {ev}
              </button>
            )
          })}
        </div>
      </Field>

      {/* Contact name + email */}
      <div className="border-t border-gray-100 pt-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Contactpersoon</p>
        <div className="space-y-3">
          <Field label="Naam">
            <input
              type="text"
              value={form.contactName}
              onChange={e => set('contactName', e.target.value)}
              placeholder="Voor- en achternaam"
              className="input-field"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="E-mail">
              <input
                type="email"
                value={form.contactEmail}
                onChange={e => set('contactEmail', e.target.value)}
                placeholder="naam@bedrijf.nl"
                className="input-field"
              />
            </Field>
            <Field label="Telefoon">
              <input
                type="tel"
                value={form.contactPhone}
                onChange={e => set('contactPhone', e.target.value)}
                placeholder="06-12345678"
                className="input-field"
              />
            </Field>
          </div>
          <Field label="LinkedIn URL">
            <input
              type="url"
              value={form.contactLinkedIn}
              onChange={e => set('contactLinkedIn', e.target.value)}
              placeholder="https://linkedin.com/in/..."
              className="input-field"
            />
          </Field>
        </div>
      </div>

      {/* Dates */}
      <div className="border-t border-gray-100 pt-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Planning</p>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Follow-up datum">
            <input
              type="date"
              value={form.followUpDate}
              onChange={e => set('followUpDate', e.target.value)}
              className="input-field"
            />
          </Field>
          <Field label="Laatste contact">
            <input
              type="date"
              value={form.lastContactDate}
              onChange={e => set('lastContactDate', e.target.value)}
              className="input-field"
            />
          </Field>
        </div>
      </div>

      {/* Notes */}
      <div className="border-t border-gray-100 pt-5">
        <Field label="Notities">
          <textarea
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
            placeholder="Voeg notities toe over dit partnerschap, gesprekspunten, voorkeuren..."
            rows={5}
            className="input-field resize-none"
          />
        </Field>
      </div>
    </div>
  )
}

function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
