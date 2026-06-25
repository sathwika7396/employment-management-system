import { useState, useEffect } from 'react'
import { designationService } from '../services/api'
import { InfoCard } from '../components/Cards'

function Designations() {
  const [designations, setDesignations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [showModal, setShowModal] = useState(false)
  const [editingDesignation, setEditingDesignation] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    level: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchDesignations()
  }, [])

  const fetchDesignations = async () => {
    try {
      setIsLoading(true)
      const response = await designationService.getAll()
      if (response.data.success) {
        setDesignations(response.data.data || [])
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Failed to fetch designations' })
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch designations'
      setMessage({ type: 'error', text: errorMessage })
      setDesignations([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingDesignation(null)
    setFormData({
      title: '',
      level: '',
    })
    setShowModal(true)
  }

  const handleEdit = (designation) => {
    setEditingDesignation(designation)
    setFormData({
      title: designation.title || '',
      level: designation.level || '',
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      setMessage({ type: 'error', text: 'Designation title is required' })
      return
    }

    if (!formData.level.trim()) {
      setMessage({ type: 'error', text: 'Designation level is required' })
      return
    }

    setIsSubmitting(true)
    setMessage({ type: '', text: '' })

    try {
      let response
      if (editingDesignation) {
        
        response = await designationService.update(editingDesignation.id, {
          title: formData.title.trim(),
          level: formData.level.trim(),
        })
      } else {
        
        response = await designationService.create({
          title: formData.title.trim(),
          level: formData.level.trim(),
        })
      }

      if (response.data.success) {
        setMessage({
          type: 'success',
          text: editingDesignation
            ? 'Designation updated successfully'
            : 'Designation added successfully',
        })
        setShowModal(false)
        await fetchDesignations()
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      } else {
        setMessage({
          type: 'error',
          text: response.data.message || (editingDesignation ? 'Failed to update designation' : 'Failed to add designation'),
        })
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        (editingDesignation ? 'Failed to update designation' : 'Failed to add designation')
      setMessage({ type: 'error', text: errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return
    }

    try {
      const response = await designationService.delete(id)
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Designation deleted successfully' })
        await fetchDesignations()
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Failed to delete designation' })
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to delete designation'
      setMessage({ type: 'error', text: errorMessage })
    }
  }

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0" style={{ fontFamily: "'Source Serif 4', serif", color: '#2F3C7E' }}>
            Designation Management
          </h2>
          <p className="text-muted mb-0" style={{ fontSize: '0.9375rem' }}>
            Manage employee designations
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleAdd}
          style={{ borderRadius: '8px' }}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Add Designation
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
                  {editingDesignation ? 'Edit Designation' : 'Add Designation'}
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
                    <label htmlFor="title" className="form-label" style={{ fontWeight: 500, color: '#2F3C7E' }}>
                      Designation Title <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      placeholder="e.g., Software Engineer"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="level" className="form-label" style={{ fontWeight: 500, color: '#2F3C7E' }}>
                      Level <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="level"
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      required
                      placeholder="e.g., L1, L2, L3, Senior, Junior"
                    />
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
                        {editingDesignation ? 'Updating...' : 'Adding...'}
                      </>
                    ) : editingDesignation ? (
                      'Update Designation'
                    ) : (
                      'Add Designation'
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
            <p className="mt-3 text-muted">Loading designations...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th scope="col" style={{ width: '5%' }}>ID</th>
                  <th scope="col" style={{ width: '40%' }}>Title</th>
                  <th scope="col" style={{ width: '30%' }}>Level</th>
                  <th scope="col" style={{ width: '25%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {designations.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-5">
                      <i className="bi bi-briefcase fs-1 d-block mb-2"></i>
                      No designations found. Add a designation to get started.
                    </td>
                  </tr>
                ) : (
                  designations.map((designation) => (
                    <tr key={designation.id}>
                      <td>{designation.id}</td>
                      <td>
                        <strong style={{ color: '#2F3C7E', fontSize: '1rem' }}>
                          {designation.title}
                        </strong>
                      </td>
                      <td>
                        <span className="badge bg-secondary">{designation.level}</span>
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEdit(designation)}
                            style={{ borderRadius: '6px', marginRight: '0.25rem' }}
                            title="Edit designation"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(designation.id, designation.title)}
                            style={{ borderRadius: '6px' }}
                            title="Delete designation"
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

export default Designations

