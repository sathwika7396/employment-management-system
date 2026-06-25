import { useState, useEffect } from 'react'
import { leaveService, employeeService } from '../services/api'
import LeaveApplicationModal from '../components/LeaveApplicationModal'
import { InfoCard } from '../components/Cards'

function EmployeeLeaves() {
  const [leaves, setLeaves] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
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
      fetchLeaves()
    }
  }, [employeeId])

  const fetchLeaves = async () => {
    if (!employeeId) {
      return
    }

    try {
      setIsLoading(true)
      const response = await leaveService.getByEmployee(employeeId)
      if (response.data.success) {
        setLeaves(response.data.data || [])
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Failed to fetch leave requests' })
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch leave requests'
      setMessage({ type: 'error', text: errorMessage })
      setLeaves([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (leaveData) => {
    try {
      const response = await leaveService.create(leaveData)
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Leave request submitted successfully' })
        await fetchLeaves()
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Failed to submit leave request' })
        throw new Error(response.data.message)
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to submit leave request'
      setMessage({ type: 'error', text: errorMessage })
      throw error
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 'N/A'
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }

  const getStatusBadge = (status) => {
    const statusClass =
      status === 'APPROVED'
        ? 'bg-success'
        : status === 'PENDING'
        ? 'bg-warning text-dark'
        : 'bg-danger'
    return <span className={`badge ${statusClass}`}>{status}</span>
  }

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0" style={{ fontFamily: "'Source Serif 4', serif", color: '#2F3C7E' }}>My Leave Requests</h2>
          <p className="text-muted mb-0" style={{ fontSize: '0.9375rem' }}>View and manage your leave applications</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            if (employeeId) {
              setShowModal(true)
            } else {
              setMessage({
                type: 'error',
                text: 'Employee record not found. Please ensure your employee record exists in the system with the same email as your login. Contact admin to add your record, then log out and log in again.',
              })
            }
          }}
          style={{ borderRadius: '8px' }}
          disabled={!employeeId && !isLoading}
          title={!employeeId ? 'Employee record required. Contact admin.' : ''}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Request Leave
        </button>
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
            <p className="mt-3 text-muted">Loading leave requests...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Leave Type</th>
                  <th scope="col">Start Date</th>
                  <th scope="col">End Date</th>
                  <th scope="col">Days</th>
                  <th scope="col">Reason</th>
                  <th scope="col">Status</th>
                  <th scope="col">Applied On</th>
                </tr>
              </thead>
              <tbody>
                {leaves.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center text-muted py-5">
                      <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                      No leave requests found. Click 'Request Leave' to apply for leave.
                    </td>
                  </tr>
                ) : (
                  leaves.map((leave) => (
                    <tr key={leave.id}>
                      <td>{leave.id}</td>
                      <td>
                        <span className="badge bg-info text-dark">{leave.leaveType}</span>
                      </td>
                      <td>{formatDate(leave.startDate)}</td>
                      <td>{formatDate(leave.endDate)}</td>
                      <td>
                        <strong>{calculateDays(leave.startDate, leave.endDate)} days</strong>
                      </td>
                      <td>
                        <span className="text-truncate d-inline-block" style={{ maxWidth: '200px' }} title={leave.reason || 'No reason provided'}>
                          {leave.reason || 'N/A'}
                        </span>
                      </td>
                      <td>{getStatusBadge(leave.status)}</td>
                      <td>
                        <small className="text-muted">
                          {leave.createdAt
                            ? formatDate(leave.createdAt.split('T')[0])
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

      <LeaveApplicationModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        employeeId={employeeId}
      />
    </div>
  )
}

export default EmployeeLeaves
