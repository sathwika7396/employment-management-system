import { useState, useEffect } from 'react'
import { leaveService } from '../services/api'
import { InfoCard } from '../components/Cards'

function Leaves() {
  const [leaves, setLeaves] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    fetchLeaves()
  }, [])

  const fetchLeaves = async () => {
    try {
      setIsLoading(true)
      const response = await leaveService.getAll()
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

  const handleApprove = async (id) => {
    if (!window.confirm('Are you sure you want to approve this leave request?')) {
      return
    }

    try {
      const response = await leaveService.approve(id)
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Leave request approved successfully' })
        await fetchLeaves()
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Failed to approve leave request' })
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to approve leave request'
      setMessage({ type: 'error', text: errorMessage })
    }
  }

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this leave request?')) {
      return
    }

    try {
      const response = await leaveService.reject(id)
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Leave request rejected successfully' })
        await fetchLeaves()
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Failed to reject leave request' })
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to reject leave request'
      setMessage({ type: 'error', text: errorMessage })
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
          <h2 className="mb-0" style={{ fontFamily: "'Source Serif 4', serif", color: '#2F3C7E' }}>Leave Management</h2>
          <p className="text-muted mb-0" style={{ fontSize: '0.9375rem' }}>Review and manage employee leave requests</p>
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
            <p className="mt-3 text-muted">Loading leave requests...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Employee</th>
                  <th scope="col">Leave Type</th>
                  <th scope="col">Start Date</th>
                  <th scope="col">End Date</th>
                  <th scope="col">Days</th>
                  <th scope="col">Reason</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaves.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center text-muted py-5">
                      <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                      No leave requests found.
                    </td>
                  </tr>
                ) : (
                  leaves.map((leave) => (
                    <tr key={leave.id}>
                      <td>{leave.id}</td>
                      <td>
                        <strong>{leave.employeeName || 'N/A'}</strong>
                        <br />
                        <small className="text-muted">ID: {leave.employeeId}</small>
                      </td>
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
                        <div className="d-flex justify-content-center gap-2">
                          {leave.status === 'PENDING' && (
                            <>
                              <button
                                className="btn btn-sm btn-outline-success"
                                onClick={() => handleApprove(leave.id)}
                                title="Approve Leave"
                              >
                                <i className="bi bi-check-circle"></i> Approve
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleReject(leave.id)}
                                title="Reject Leave"
                              >
                                <i className="bi bi-x-circle"></i> Reject
                              </button>
                            </>
                          )}
                          {leave.status !== 'PENDING' && (
                            <span className="text-muted small">No action available</span>
                          )}
                        </div>
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

export default Leaves
