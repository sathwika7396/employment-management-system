import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import EmployeeSidebar from '../components/EmployeeSidebar'

function EmployeeLayout() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F7F8FC' }}>
      <EmployeeSidebar />
      <div className="d-flex flex-column" style={{ marginLeft: '250px' }}>
        <Navbar />
        <main className="flex-grow-1" style={{ backgroundColor: '#F7F8FC', minHeight: 'calc(100vh - 56px)', padding: '2rem' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default EmployeeLayout

