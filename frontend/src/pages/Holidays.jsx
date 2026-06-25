import { useState, useEffect } from 'react'
import { holidayService } from '../services/api'
import { InfoCard } from '../components/Cards'

function Holidays() {
  const [holidays, setHolidays] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    holidayName: '',
    holidayDate: '',
    description: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchHolidays()
  }, [])

  const fetchHolidays = async () => {
    try {
      setIsLoading(true)
      const response = await holidayService.getAll()
      if (response.data.success) {
        setHolidays(response.data.data || [])
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Failed to fetch holidays' })
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch holidays'
      setMessage({ type: 'error', text: errorMessage })
      setHolidays([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdd = () => {
    setFormData({
      holidayName: '',
      holidayDate: '',
      description: '',
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.holidayName.trim()) {
      setMessage({ type: 'error', text: 'Holiday name is required' })
      return
    }

    if (!formData.holidayDate) {
      setMessage({ type: 'error', text: 'Holiday date is required' })
      return
    }

    setIsSubmitting(true)
    setMessage({ type: '', text: '' })

    try {
      const response = await holidayService.create({
        holidayName: formData.holidayName.trim(),
        holidayDate: formData.holidayDate,
        description: formData.description.trim() || null,
      })

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Holiday added successfully' })
        setShowModal(false)
        await fetchHolidays()
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Failed to add holiday' })
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to add holiday'
      setMessage({ type: 'error', text: errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id, holidayName) => {
    if (!window.confirm(`Are you sure you want to delete "${holidayName}"?`)) {
      return
    }

    try {
      const response = await holidayService.delete(id)
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Holiday deleted successfully' })
        await fetchHolidays()
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Failed to delete holiday' })
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to delete holiday'
      setMessage({ type: 'error', text: errorMessage })
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    })
  }

  const formatDateShort = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0" style={{ fontFamily: "'Source Serif 4', serif", color: '#2F3C7E' }}>
            Holiday Management
          </h2>
          <p className="text-muted mb-0" style={{ fontSize: '0.9375rem' }}>
            Manage company holidays
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleAdd}
          style={{ borderRadius: '8px' }}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Add Holiday
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
                <h5 className="modal-title" style={{ fontFamily: "'Source Serif 4', serif", color: '#2F3C7E' }}>
                  Add Holiday
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
                    <label htmlFor="holidayName" className="form-label" style={{ fontWeight: 500, color: '#2F3C7E' }}>
                      Holiday Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="holidayName"
                      value={formData.holidayName}
                      onChange={(e) => setFormData({ ...formData, holidayName: e.target.value })}
                      required
                      placeholder="e.g., Republic Day"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="holidayDate" className="form-label" style={{ fontWeight: 500, color: '#2F3C7E' }}>
                      Holiday Date <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="holidayDate"
                      value={formData.holidayDate}
                      onChange={(e) => setFormData({ ...formData, holidayDate: e.target.value })}
                      required
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
                        Adding...
                      </>
                    ) : (
                      'Add Holiday'
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
            <p className="mt-3 text-muted">Loading holidays...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th scope="col" style={{ width: '5%' }}>ID</th>
                  <th scope="col" style={{ width: '25%' }}>Holiday Name</th>
                  <th scope="col" style={{ width: '25%' }}>Date</th>
                  <th scope="col" style={{ width: '35%' }}>Description</th>
                  <th scope="col" style={{ width: '10%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {holidays.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-5">
                      <i className="bi bi-calendar-x fs-1 d-block mb-2"></i>
                      No holidays found. Add a holiday to get started.
                    </td>
                  </tr>
                ) : (
                  holidays.map((holiday) => (
                    <tr key={holiday.id}>
                      <td>{holiday.id}</td>
                      <td>
                        <strong style={{ color: '#2F3C7E', fontSize: '1rem' }}>
                          {holiday.holidayName}
                        </strong>
                      </td>
                      <td>
                        <strong style={{ color: '#E36414', fontSize: '1rem' }}>
                          {formatDateShort(holiday.holidayDate)}
                        </strong>
                        <br />
                        <small className="text-muted">{formatDate(holiday.holidayDate)}</small>
                      </td>
                      <td>
                        <span className="text-muted">
                          {holiday.description || <em>No description</em>}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(holiday.id, holiday.holidayName)}
                          style={{ borderRadius: '6px' }}
                          title="Delete holiday"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
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

export default Holidays

