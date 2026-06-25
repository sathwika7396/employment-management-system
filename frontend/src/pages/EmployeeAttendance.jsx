import { useState, useEffect } from 'react'
import { attendanceService, employeeService } from '../services/api'
import { InfoCard } from '../components/Cards'

function EmployeeAttendance() {
  const [attendances, setAttendances] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [markAttendanceData, setMarkAttendanceData] = useState({
    date: new Date().toISOString().split('T')[0],
    status: 'PRESENT',
  })
  const [isMarking, setIsMarking] = useState(false)
  const [employeeId, setEmployeeId] = useState(null)

  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null

  useEffect(() => {
    const resolveEmployeeId = async () => {
      if (!user) {
        setMessage({ type: 'error', text: 'Please login to access this page.' })
        setIsLoading(false)
        return
      }
      
      if (user.employeeId) {
        setEmployeeId(user.employeeId)
        return
      }
      
      if (user.role === 'EMPLOYEE' && user.email) {
        try {
          const response = await employeeService.getByEmail(user.email)
          if (response.data.success && response.data.data) {
            setEmployeeId(response.data.data.id)
            return
          }
        } catch (err) {
          console.error('Failed to fetch employee by email:', err)
        }
      }
      setMessage({ type: 'error', text: 'Employee not found. Please ensure your employee record exists and matches your login email. Contact admin.' })
      setIsLoading(false)
    }
    resolveEmployeeId()
  }, [user?.email, user?.role, user?.employeeId])

  useEffect(() => {
    if (employeeId) {
      fetchAttendances()
    }
  }, [employeeId])

  const fetchAttendances = async () => {
    if (!employeeId) {
      return
    }

    try {
      setIsLoading(true)
      const response = await attendanceService.getByEmployee(employeeId)
      if (response.data.success) {
        setAttendances(response.data.data || [])
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Failed to fetch attendance records' })
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch attendance records'
      setMessage({ type: 'error', text: errorMessage })
      setAttendances([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAttendance = async (e) => {
    e.preventDefault()

    if (!employeeId) {
      setMessage({ type: 'error', text: 'Employee ID not found. Please login again.' })
      return
    }

    setIsMarking(true)
    setMessage({ type: '', text: '' })

    try {
      const response = await attendanceService.markAttendance({
        employeeId: employeeId,
        date: markAttendanceData.date,
        status: markAttendanceData.status,
      })

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Attendance marked successfully' })
        await fetchAttendances()
        
        setMarkAttendanceData({
          date: new Date().toISOString().split('T')[0],
          status: 'PRESENT',
        })
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Failed to mark attendance' })
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to mark attendance'
      setMessage({ type: 'error', text: errorMessage })
    } finally {
      setIsMarking(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' })
  }

  const getStatusBadge = (status) => {
    const statusClass = status === 'PRESENT' ? 'bg-success' : 'bg-danger'
    return <span className={`badge ${statusClass}`}>{status}</span>
  }

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0" style={{ fontFamily: "'Source Serif 4', serif", color: '#2F3C7E' }}>My Attendance</h2>
          <p className="text-muted mb-0" style={{ fontSize: '0.9375rem' }}>Mark your attendance and view history</p>
        </div>
      </div>

      {message.text && (
        <div
          className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`}
          role="alert"
        >
          {message.text}
          <button
            type="button"
            className="btn-close"
            onClick={() => setMessage({ type: '', text: '' })}
            aria-label="Close"
          ></button>
        </div>
      )}

      <div className="card shadow-sm mb-4" style={{ borderRadius: '8px' }}>
        <div className="card-header" style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.08)', backgroundColor: '#F7F8FC', padding: '1.25rem 1.5rem' }}>
          <h5 className="mb-0" style={{ fontFamily: "'Source Serif 4', serif", color: '#2F3C7E', fontWeight: 600 }}>Mark Attendance</h5>
        </div>
        <div className="card-body" style={{ padding: '1.5rem' }}>
          <form onSubmit={handleMarkAttendance}>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label htmlFor="date" className="form-label" style={{ fontWeight: 500, color: '#2F3C7E' }}>
                  Date <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="date"
                  name="date"
                  value={markAttendanceData.date}
                  onChange={(e) =>
                    setMarkAttendanceData({ ...markAttendanceData, date: e.target.value })
                  }
                  required
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="col-md-4 mb-3">
                <label htmlFor="status" className="form-label" style={{ fontWeight: 500, color: '#2F3C7E' }}>
                  Status <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  id="status"
                  name="status"
                  value={markAttendanceData.status}
                  onChange={(e) =>
                    setMarkAttendanceData({ ...markAttendanceData, status: e.target.value })
                  }
                  required
                >
                  <option value="PRESENT">Present</option>
                  <option value="ABSENT">Absent</option>
                </select>
              </div>
              <div className="col-md-4 mb-3 d-flex align-items-end">
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={isMarking}
                  style={{ borderRadius: '8px' }}
                >
                  {isMarking ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Marking...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>
                      Mark Attendance
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <InfoCard title="Attendance History">
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading attendance records...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Date</th>
                  <th scope="col">Status</th>
                  <th scope="col">Marked On</th>
                </tr>
              </thead>
              <tbody>
                {attendances.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-5">
                      <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                      No attendance records found. Mark your attendance to get started.
                    </td>
                  </tr>
                ) : (
                  attendances
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((attendance) => (
                      <tr key={attendance.id}>
                        <td>{attendance.id}</td>
                        <td>
                          <strong>{formatDate(attendance.date)}</strong>
                        </td>
                        <td>{getStatusBadge(attendance.status)}</td>
                        <td>
                          <small className="text-muted">
                            {attendance.createdAt
                              ? formatDate(attendance.createdAt.split('T')[0])
                              : 'N/A'}
                          </small>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </InfoCard>
    </div>
  )
}

export default EmployeeAttendance

