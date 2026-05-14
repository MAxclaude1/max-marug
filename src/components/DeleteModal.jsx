import { AlertTriangle } from 'lucide-react'

export default function DeleteModal({ onConfirm, onCancel }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" onClick={onCancel} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Partner verwijderen</h3>
              <p className="text-sm text-gray-500 mt-0.5">Dit kan niet ongedaan worden gemaakt.</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Weet je het zeker? Dit kan niet ongedaan worden gemaakt.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Annuleren
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Verwijderen
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
