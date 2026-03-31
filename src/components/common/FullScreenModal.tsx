import { X } from 'lucide-react'
import { type ReactNode } from 'react'

interface FullScreenModalProps {
  title: string
  onClose: () => void
  /** Optional right-side header action (e.g. a + button) */
  headerRight?: ReactNode
  children: ReactNode
  footer?: ReactNode
}

export default function FullScreenModal({
  title,
  onClose,
  headerRight,
  children,
  footer,
}: FullScreenModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-app-bg overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-app-border">
        <button onClick={onClose} className="p-1 text-app-text-muted hover:text-app-text">
          <X size={20} />
        </button>
        <h2 className="text-sm font-semibold text-app-text">{title}</h2>
        <div className="flex items-center gap-2 min-w-[28px] justify-end">
          {headerRight}
        </div>
      </div>

      {/* Content */}
      {children}

      {/* Footer */}
      {footer && (
        <div className="px-4 py-3 border-t border-app-border bg-app-bg">
          {footer}
        </div>
      )}
    </div>
  )
}
