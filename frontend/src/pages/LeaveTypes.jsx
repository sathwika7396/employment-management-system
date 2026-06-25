import { useState, useEffect } from 'react'
import { leaveTypeService } from '../services/api'
import { InfoCard } from '../components/Cards'

function LeaveTypes() {
  const [leaveTypes, setLeaveTypes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [showModal, setShowModal] = useState(false)
  const [editingLeaveType, setEditingLeaveType] = useState(null)
  const [formData, setFormData] = useState({
    typeName: '',
    description: '',
    maxDays: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchLeaveTypes()
  }, [])

  const fetchLeaveTypes = async () => {
    try {
      setIsLoading(true)
      const response = await leaveTypeService.getAll()
      if (response.data.success) {
        setLeaveTypes(response.data.data || [])
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Failed to fetch leave types' })
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch leave types'
      setMessage({ type: 'error', text: errorMessage })
      setLeaveTypes([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingLeaveType(null)
    setFormData({
      typeName: '',
      description: '',
      maxDays: '',
    })
    setShowModal(true)
  }

  const handleEdit = (leaveType) => {
    setEditingLeaveType(leaveType)
    setFormData({
      typeName: leaveType.typeName || '',
      description: leaveType.description || '',
      maxDays: leaveType.maxDays || '',
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.typeName.trim()) {
      setMessage({ type: 'error', text: 'Leave type name is required' })
      return
    }

    if (!formData.maxDays || parseInt(formData.maxDays) < 0) {
      setMessage({ type: 'error', text: 'Max days is required and must be non-negative' })
      return
    }

    setIsSubmitting(true)
    setMessage({ type: '', text: '' })

    try {
      let response
      if (editingLeaveType) {
        
        response = await leaveTypeService.update(editingLeaveType.id, {
          typeName: formData.typeName.trim(),
          description: formData.description.trim() || null,
          maxDays: parseInt(formData.maxDays),
        })
      } else {
        
        response = await leaveTypeService.create({
          typeName: formData.typeName.trim(),
          description: formData.description.trim() || null,
          maxDays: parseInt(formData.maxDays),
        })
      }

      if (response.data.success) {
        setMessage({
          type: 'success',
          text: editingLeaveType
            ? 'Leave type updated successfully'
            : 'Leave type added successfully',
        })
        setShowModal(false)
        await fetchLeaveTypes()
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      } else {
        setMessage({
          type: 'error',
          text: response.data.message || (editingLeaveType ? 'Failed to update leave type' : 'Failed to add leave type'),
        })
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        (editingLeaveType ? 'Failed to update leave type' : 'Failed to add leave type')
      setMessage({ type: 'error', text: errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id, typeName) => {
    if (!window.confirm(`Are you sure you want to delete "${typeName}"?`)) {
      return
    }

    try {
      const response = await leaveTypeService.delete(id)
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Leave type deleted successfully' })
        await fetchLeaveTypes()
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Failed to delete leave type' })
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to delete leave type'
      setMessage({ type: 'error', text: errorMessage })
    }
  }

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0" style={{ fontFamily: "'Source Serif 4', serif", color: '#2F3C7E' }}>
            Leave Type Management
          </h2>
          <p className="text-muted mb-0" style={{ fontSize: '0.9375rem' }}>
            Manage leave types and their maximum days
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleAdd}
          style={{ borderRadius: '8px' }}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Add Leave Type
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

      {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: '8px' }}>
              <div className="modal-header" style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
                <h5
                  className="modal-title"
                  style={{ fontFamily: "'Source Serif 4', serif", color: '#2F3C7E' }}
                >
                  {editingLeaveType ? 'Edit Leave Type' : 'Add Leave Type'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body" style={{ padding: '1.5rem' }}>
                  <div className="mb-3">
                    <label htmlFor="typeName" className="form-label" style={{ fontWeight: 500, color: '#2F3C7E' }}>
                      Leave Type Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="typeName"
                      value={formData.typeName}
                      onChange={(e) => setFormData({ ...formData, typeName: e.target.value })}
                      required
                      placeholder="e.g., Casual Leave"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="maxDays" className="form-label" style={{ fontWeight: 500, color: '#2F3C7E' }}>
                      Max Days <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="maxDays"
                      min="0"
                      value={formData.maxDays}
                      onChange={(e) => setFormData({ ...formData, maxDays: e.target.value })}
                      required
                      placeholder="e.g., 12"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label" style={{ fontWeight: 500, color: '#2F3C7E' }}>
                      Description
                    </label>
                    <textarea
                      className="form-control"
                      id="description"
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Optional description"
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer" style={{ borderTop: '1px solid rgba(0, 0, 0, 0.08)' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                    style={{ borderRadius: '8px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                    style={{ borderRadius: '8px' }}
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        {editingLeaveType ? 'Updating...' : 'Adding...'}
                      </>
                    ) : editingLeaveType ? (
                      'Update Leave Type'
                    ) : (
                      'Add Leave Type'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <InfoCard>
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading leave types...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th scope="col" style={{ width: '5%' }}>ID</th>
                  <th scope="col" style={{ width: '30%' }}>Type Name</th>
                  <th scope="col" style={{ width: '15%' }}>Max Days</th>
                  <th scope="col" style={{ width: '35%' }}>Description</th>
                  <th scope="col" style={{ width: '15%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaveTypes.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-5">
                      <i className="bi bi-calendar-x fs-1 d-block mb-2"></i>
                      No leave types found. Add a leave type to get started.
                    </td>
                  </tr>
                ) : (
                  leaveTypes.map((leaveType) => (
                    <tr key={leaveType.id}>
                      <td>{leaveType.id}</td>
                      <td>
                        <strong style={{ color: '#2F3C7E', fontSize: '1rem' }}>
                          {leaveType.typeName}
                        </strong>
                      </td>
                      <td>
                        <span className="badge bg-info text-dark" style={{ fontSize: '0.9rem' }}>
                          {leaveType.maxDays} days
                        </span>
                      </td>
                      <td>
                        <span className="text-muted">
                          {leaveType.description || <em>No description</em>}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEdit(leaveType)}
                            style={{ borderRadius: '6px', marginRight: '0.25rem' }}
                            title="Edit leave type"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(leaveType.id, leaveType.typeName)}
                            style={{ borderRadius: '6px' }}
                            title="Delete leave type"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
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

export default LeaveTypes

