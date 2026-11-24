import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'
import type { ToastMessage } from '../../types/toast'

interface ToastNotificationsProps {
  toasts: ToastMessage[]
  onClose: (id: number) => void
}

const AUTO_HIDE_MS = 4000

export default function ToastNotifications({ toasts, onClose }: ToastNotificationsProps) {
  return (
    <ToastContainer position="bottom-end" className="p-3 position-fixed">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          bg={toast.variant}
          autohide
          delay={AUTO_HIDE_MS}
          onClose={() => onClose(toast.id)}
          role={toast.variant === 'danger' ? 'alert' : 'status'}
        >
          <Toast.Body className="d-flex align-items-center gap-2 text-white">
            <i
              className={`bi ${toast.variant === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-octagon-fill'}`}
              aria-hidden="true"
            />
            <span className="flex-grow-1">{toast.message}</span>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Cerrar notificación"
              onClick={() => onClose(toast.id)}
            />
          </Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  )
}
