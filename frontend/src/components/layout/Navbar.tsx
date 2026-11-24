import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import BsNavbar from 'react-bootstrap/Navbar'
import { Link } from 'react-router-dom'

interface NavbarProps {
  onNewTask: () => void
}

export default function Navbar({ onNewTask }: NavbarProps) {
  return (
    <BsNavbar bg="dark" data-bs-theme="dark" className="shadow-sm">
      <Container className="d-flex justify-content-between">
        <BsNavbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
          <i className="bi bi-check2-square" aria-hidden="true" />
          TaskManager
        </BsNavbar.Brand>
        <Button variant="primary" onClick={onNewTask}>
          <i className="bi bi-plus-lg me-1" aria-hidden="true" />
          Nueva tarea
        </Button>
      </Container>
    </BsNavbar>
  )
}
