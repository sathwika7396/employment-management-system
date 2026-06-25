import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

function MainLayout() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F7F8FC' }}>
      <Sidebar />
      <div className="d-flex flex-column" style={{ marginLeft: '250px' }}>
        <Navbar />
        <main className="flex-grow-1" style={{ backgroundColor: '#F7F8FC', minHeight: 'calc(100vh - 56px)', padding: '2rem' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout

