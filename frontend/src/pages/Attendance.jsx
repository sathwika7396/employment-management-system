import { useState, useEffect } from 'react'
import { attendanceService } from '../services/api'
import { InfoCard } from '../components/Cards'

function Attendance() {
  const [attendances, setAttendances] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [selectedDate, setSelectedDate] = useState('')

  useEffect(() => {
    fetchAttendances()
  }, [])

  useEffect(() => {
    if (selectedDate) {
      const filtered = attendances.filter((att) => att.date === selectedDate)
      setAttendances(filtered)
    } else {
      fetchAttendances()
    }
  }, [selectedDate])

  const fetchAttendances = async () => {
    try {
      setIsLoading(true)
      const response = await attendanceService.getAll()
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

  const handleDateFilter = (date) => {
    setSelectedDate(date)
    if (!date) {
      fetchAttendances()
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
          <h2 className="mb-0" style={{ fontFamily: "'Source Serif 4', serif", color: '#2F3C7E' }}>Attendance Management</h2>
          <p className="text-muted mb-0" style={{ fontSize: '0.9375rem' }}>View and manage employee attendance records</p>
        </div>
        <div>
          <input
            type="date"
            className="form-control"
            value={selectedDate}
            onChange={(e) => handleDateFilter(e.target.value)}
            style={{ width: 'auto', display: 'inline-block' }}
          />
          {selectedDate && (
            <button
              className="btn btn-sm btn-outline-secondary ms-2"
              onClick={() => {
                setSelectedDate('')
                fetchAttendances()
              }}
            >
              Clear Filter
            </button>
          )}
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

      <InfoCard>
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
                  <th scope="col">Employee</th>
                  <th scope="col">Date</th>
                  <th scope="col">Status</th>
                  <th scope="col">Marked On</th>
                </tr>
              </thead>
              <tbody>
                {attendances.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-5">
                      <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                      No attendance records found.
                    </td>
                  </tr>
                ) : (
                  attendances.map((attendance) => (
                    <tr key={attendance.id}>
                      <td>{attendance.id}</td>
                      <td>
                        <strong>{attendance.employeeName || 'N/A'}</strong>
                        <br />
                        <small className="text-muted">ID: {attendance.employeeId}</small>
                      </td>
                      <td>{formatDate(attendance.date)}</td>
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

export default Attendance

