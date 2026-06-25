import { NavLink } from 'react-router-dom'

function EmployeeSidebar() {
  return (
    <aside
      className="text-white"
      style={{ width: '250px', minHeight: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 1000 }}
    >
      <div className="p-4">
        <h5 className="text-white mb-4" style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 600 }}>Employee Menu</h5>
        <nav className="nav flex-column">
          <NavLink
            to="/employee-dashboard"
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? 'active' : ''}`
            }
          >
            <i className="bi bi-speedometer2 me-2"></i>
            Dashboard
          </NavLink>
          <NavLink
            to="/employee-leaves"
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? 'active' : ''}`
            }
          >
            <i className="bi bi-calendar-check me-2"></i>
            My Leaves
          </NavLink>
          <NavLink
            to="/employee-payroll"
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? 'active' : ''}`
            }
          >
            <i className="bi bi-cash-coin me-2"></i>
            My Payroll
          </NavLink>
          <NavLink
            to="/employee-attendance"
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? 'active' : ''}`
            }
          >
            <i className="bi bi-calendar-event me-2"></i>
            My Attendance
          </NavLink>
          <NavLink
            to="/employee-holidays"
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? 'active' : ''}`
            }
          >
            <i className="bi bi-calendar-heart me-2"></i>
            Holidays
          </NavLink>
        </nav>
      </div>
    </aside>
  )
}

export default EmployeeSidebar

