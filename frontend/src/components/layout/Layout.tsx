import Container from 'react-bootstrap/Container'
import { Outlet, useNavigate } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  const navigate = useNavigate()

  return (
    <>
      <a href="#main-content" className="visually-hidden-focusable skip-link">
        Saltar al contenido
      </a>
      <Navbar onNewTask={() => navigate('/tasks/new')} />
      <Container as="main" id="main-content" className="py-4">
        <Outlet />
      </Container>
    </>
  )
}
