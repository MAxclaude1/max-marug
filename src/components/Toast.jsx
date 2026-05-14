import { CheckCircle2, Info } from 'lucide-react'

export default function Toast({ message, type = 'success' }) {
  const isSuccess = type === 'success'
  return (
    <div className="fixed bottom-6 right-6 z-50 toast-enter">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium ${
        isSuccess
          ? 'bg-white border-green-200 text-green-800'
          : 'bg-white border-gray-200 text-gray-700'
      }`}>
        {isSuccess
          ? <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
          : <Info size={16} className="text-gray-400 flex-shrink-0" />
        }
        {message}
      </div>
    </div>
  )
}
