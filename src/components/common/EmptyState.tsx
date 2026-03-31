import { type ReactNode } from 'react'

interface EmptyStateProps {
  message: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
}

export default function EmptyState({ message, description, icon, action }: EmptyStateProps) {
  return (
    <div className="bg-app-surface border border-app-border rounded-2xl p-6 text-center">
      {icon && <div className="mb-3">{icon}</div>}
      <p className="text-sm text-app-text-secondary">{message}</p>
      {description && <p className="text-xs text-app-muted mt-1">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}
