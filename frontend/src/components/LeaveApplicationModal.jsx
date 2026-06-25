import { useState, useEffect } from 'react'
import { leaveTypeService } from '../services/api'

function LeaveApplicationModal({ show, onClose, onSave, employeeId }) {
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [leaveTypes, setLeaveTypes] = useState([])
  const [isLoadingLeaveTypes, setIsLoadingLeaveTypes] = useState(false)

  useEffect(() => {
    if (show) {
      fetchLeaveTypes()
      
      setFormData({
        leaveType: '',
        startDate: '',
        endDate: '',
        reason: '',
      })
      setErrors({})
    }
  }, [show])

  const fetchLeaveTypes = async () => {
    try {
      setIsLoadingLeaveTypes(true)
      const response = await leaveTypeService.getAll()
      if (response.data.success) {
        setLeaveTypes(response.data.data || [])
        
        if (response.data.data && response.data.data.length > 0) {
          setFormData(prev => ({
            ...prev,
            leaveType: response.data.data[0].typeName || '',
          }))
        }
      }
    } catch (error) {
      console.error('Error fetching leave types:', error)
      setLeaveTypes([])
    } finally {
      setIsLoadingLeaveTypes(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.leaveType) {
      newErrors.leaveType = 'Leave type is required'
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required'
    } else {
      const startDate = new Date(formData.startDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (startDate < today) {
        newErrors.startDate = 'Start date cannot be in the past'
      }
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required'
    } else if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate)
      const endDate = new Date(formData.endDate)
      if (endDate < startDate) {
        newErrors.endDate = 'End date must be after or equal to start date'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!employeeId) {
      console.error('Cannot submit leave: employeeId is required')
      return
    }

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const leaveData = {
        employeeId: employeeId,
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason.trim() || null,
      }

      await onSave(leaveData)
      onClose()
    } catch (error) {
      console.error('Error applying for leave:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!show) return null

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content" style={{ borderRadius: '8px' }}>
          <div className="modal-header" style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.08)', backgroundColor: '#F7F8FC' }}>
            <h5 className="modal-title" style={{ fontFamily: "'Source Serif 4', serif", color: '#2F3C7E', fontWeight: 600 }}>Apply for Leave</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {!employeeId && (
                <div className="alert alert-warning mb-3" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Employee record not found. Please contact your administrator to add your employee record with the same email as your login, then log out and log in again.
                </div>
              )}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="leaveType" className="form-label">
                    Leave Type <span className="text-danger">*</span>
                  </label>
                  {isLoadingLeaveTypes ? (
                    <div className="form-control">
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Loading leave types...
                    </div>
                  ) : (
                    <select
                      className={`form-select ${errors.leaveType ? 'is-invalid' : ''}`}
                      id="leaveType"
                      name="leaveType"
                      value={formData.leaveType}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Leave Type</option>
                      {leaveTypes.map((lt) => (
                        <option key={lt.id} value={lt.typeName}>
                          {lt.typeName} {lt.maxDays ? `(Max: ${lt.maxDays} days)` : ''}
                        </option>
                      ))}
                    </select>
                  )}
                  {errors.leaveType && <div className="invalid-feedback">{errors.leaveType}</div>}
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="startDate" className="form-label">
                    Start Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className={`form-control ${errors.startDate ? 'is-invalid' : ''}`}
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                  {errors.startDate && <div className="invalid-feedback">{errors.startDate}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="endDate" className="form-label">
                    End Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className={`form-control ${errors.endDate ? 'is-invalid' : ''}`}
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                    min={formData.startDate}
                  />
                  {errors.endDate && <div className="invalid-feedback">{errors.endDate}</div>}
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="reason" className="form-label">
                  Reason (Optional)
                </label>
                <textarea
                  className="form-control"
                  id="reason"
                  name="reason"
                  rows="3"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Enter reason for leave..."
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isLoading || !employeeId}>
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Submitting...
                  </>
                ) : (
                  'Submit Leave Request'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LeaveApplicationModal

