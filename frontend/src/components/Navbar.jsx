import { useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    navigate('/login')
  }

  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null
  const userName = user?.name || 'User'
  const userRole = user?.role || ''

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
      <div className="container-fluid px-4">
        <span className="navbar-brand mb-0" style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 600, fontSize: '1.25rem', color: '#2F3C7E' }}>HR Management System</span>
        <div className="d-flex align-items-center">
          <div className="dropdown">
            <button
              className="btn btn-outline-secondary dropdown-toggle"
              type="button"
              id="userDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ borderColor: 'rgba(0, 0, 0, 0.15)', color: '#2F3C7E', fontWeight: 500 }}
            >
              <i className="bi bi-person-circle me-2"></i>
              {userName} ({userRole})
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-sm" aria-labelledby="userDropdown" style={{ borderRadius: '8px', border: 'none', marginTop: '0.5rem' }}>
              <li><a className="dropdown-item" href="#profile" style={{ padding: '0.625rem 1rem' }}>Profile</a></li>
              <li><a className="dropdown-item" href="#settings" style={{ padding: '0.625rem 1rem' }}>Settings</a></li>
              <li><hr className="dropdown-divider" style={{ margin: '0.5rem 0' }} /></li>
              <li>
                <button className="dropdown-item" onClick={handleLogout} style={{ padding: '0.625rem 1rem' }}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

