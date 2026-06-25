import { useState, useEffect } from 'react'
import { departmentService } from '../services/api'
import { InfoCard } from '../components/Cards'

function Departments() {
  const [departments, setDepartments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [showModal, setShowModal] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState(null)
  const [formData, setFormData] = useState({
    departmentName: '',
    description: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    try {
      setIsLoading(true)
      const response = await departmentService.getAll()
      if (response.data.success) {
        setDepartments(response.data.data || [])
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Failed to fetch departments' })
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch departments'
      setMessage({ type: 'error', text: errorMessage })
      setDepartments([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingDepartment(null)
    setFormData({
      departmentName: '',
      description: '',
    })
    setShowModal(true)
  }

  const handleEdit = (department) => {
    setEditingDepartment(department)
    setFormData({
      departmentName: department.departmentName || '',
      description: department.description || '',
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.departmentName.trim()) {
      setMessage({ type: 'error', text: 'Department name is required' })
      return
    }

    setIsSubmitting(true)
    setMessage({ type: '', text: '' })

    try {
      let response
      if (editingDepartment) {
        
        response = await departmentService.update(editingDepartment.id, {
          departmentName: formData.departmentName.trim(),
          description: formData.description.trim() || null,
        })
      } else {
        
        response = await departmentService.create({
          departmentName: formData.departmentName.trim(),
          description: formData.description.trim() || null,
        })
      }

      if (response.data.success) {
        setMessage({
          type: 'success',
          text: editingDepartment
            ? 'Department updated successfully'
            : 'Department added successfully',
        })
        setShowModal(false)
        await fetchDepartments()
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      } else {
        setMessage({
          type: 'error',
          text: response.data.message || (editingDepartment ? 'Failed to update department' : 'Failed to add department'),
        })
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        (editingDepartment ? 'Failed to update department' : 'Failed to add department')
      setMessage({ type: 'error', text: errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id, departmentName) => {
    if (!window.confirm(`Are you sure you want to delete "${departmentName}"?`)) {
      return
    }

    try {
      const response = await departmentService.delete(id)
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Department deleted successfully' })
        await fetchDepartments()
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Failed to delete department' })
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to delete department'
      setMessage({ type: 'error', text: errorMessage })
    }
  }

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0" style={{ fontFamily: "'Source Serif 4', serif", color: '#2F3C7E' }}>
            Department Management
          </h2>
          <p className="text-muted mb-0" style={{ fontSize: '0.9375rem' }}>
            Manage company departments
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleAdd}
          style={{ borderRadius: '8px' }}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Add Department
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
                  {editingDepartment ? 'Edit Department' : 'Add Department'}
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
                    <label htmlFor="departmentName" className="form-label" style={{ fontWeight: 500, color: '#2F3C7E' }}>
                      Department Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="departmentName"
                      value={formData.departmentName}
                      onChange={(e) => setFormData({ ...formData, departmentName: e.target.value })}
                      required
                      placeholder="e.g., Human Resources"
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
                        {editingDepartment ? 'Updating...' : 'Adding...'}
                      </>
                    ) : editingDepartment ? (
                      'Update Department'
                    ) : (
                      'Add Department'
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
            <p className="mt-3 text-muted">Loading departments...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th scope="col" style={{ width: '5%' }}>ID</th>
                  <th scope="col" style={{ width: '30%' }}>Department Name</th>
                  <th scope="col" style={{ width: '50%' }}>Description</th>
                  <th scope="col" style={{ width: '15%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-5">
                      <i className="bi bi-building fs-1 d-block mb-2"></i>
                      No departments found. Add a department to get started.
                    </td>
                  </tr>
                ) : (
                  departments.map((department) => (
                    <tr key={department.id}>
                      <td>{department.id}</td>
                      <td>
                        <strong style={{ color: '#2F3C7E', fontSize: '1rem' }}>
                          {department.departmentName}
                        </strong>
                      </td>
                      <td>
                        <span className="text-muted">
                          {department.description || <em>No description</em>}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEdit(department)}
                            style={{ borderRadius: '6px', marginRight: '0.25rem' }}
                            title="Edit department"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(department.id, department.departmentName)}
                            style={{ borderRadius: '6px' }}
                            title="Delete department"
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

export default Departments

