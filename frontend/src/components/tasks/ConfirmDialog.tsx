import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Spinner from 'react-bootstrap/Spinner'

interface ConfirmDialogProps {
  show: boolean
  title: string
  message: string
  isLoading: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  show,
  title,
  message,
  isLoading,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal show={show} onHide={isLoading ? undefined : onCancel} centered>
      <Modal.Header closeButton={!isLoading}>
        <Modal.Title as="h2" className="h5">
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner as="span" animation="border" size="sm" className="me-2" aria-hidden="true" />
              Eliminando…
            </>
          ) : (
            <>
              <i className="bi bi-trash me-1" aria-hidden="true" />
              Eliminar
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
