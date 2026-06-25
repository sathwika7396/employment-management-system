import { useState, useEffect } from 'react'
import { departmentService, designationService } from '../services/api'

function EmployeeModal({ show, onClose, onSave, employee = null }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    designation: '',
    basicSalary: '',
    status: 'ACTIVE',
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [departments, setDepartments] = useState([])
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false)
  const [designations, setDesignations] = useState([])
  const [isLoadingDesignations, setIsLoadingDesignations] = useState(false)

  useEffect(() => {
    if (show) {
      fetchDepartments()
      fetchDesignations()
    }
  }, [show])

  useEffect(() => {
    if (employee) {
      
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        department: employee.department || '',
        designation: employee.designation || '',
        basicSalary: employee.basicSalary || '',
        status: employee.status || 'ACTIVE',
      })
    } else {
      
      setFormData({
        name: '',
        email: '',
        department: '',
        designation: '',
        basicSalary: '',
        status: 'ACTIVE',
      })
    }
    setErrors({})
  }, [employee, show])

  const fetchDepartments = async () => {
    try {
      setIsLoadingDepartments(true)
      const response = await departmentService.getAll()
      if (response.data.success) {
        setDepartments(response.data.data || [])
      }
    } catch (error) {
      console.error('Error fetching departments:', error)
      setDepartments([])
    } finally {
      setIsLoadingDepartments(false)
    }
  }

  const fetchDesignations = async () => {
    try {
      setIsLoadingDesignations(true)
      const response = await designationService.getAll()
      if (response.data.success) {
        setDesignations(response.data.data || [])
      }
    } catch (error) {
      console.error('Error fetching designations:', error)
      setDesignations([])
    } finally {
      setIsLoadingDesignations(false)
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

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required'
    }

    if (!formData.designation.trim()) {
      newErrors.designation = 'Designation is required'
    }

    if (!formData.basicSalary || parseFloat(formData.basicSalary) < 0) {
      newErrors.basicSalary = 'Basic salary is required and must be non-negative'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const employeeData = {
        ...formData,
        basicSalary: parseFloat(formData.basicSalary),
      }

      await onSave(employeeData)
      onClose()
    } catch (error) {
      console.error('Error saving employee:', error)
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
            <h5 className="modal-title" style={{ fontFamily: "'Source Serif 4', serif", color: '#2F3C7E', fontWeight: 600 }}>
              {employee ? 'Edit Employee' : 'Add New Employee'}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="name" className="form-label">
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="email" className="form-label">
                    Email <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={!!employee}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  {employee && (
                    <small className="form-text text-muted">Email cannot be changed</small>
                  )}
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="department" className="form-label">
                    Department <span className="text-danger">*</span>
                  </label>
                  {isLoadingDepartments ? (
                    <div className="form-control">
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Loading departments...
                    </div>
                  ) : (
                    <select
                      className={`form-select ${errors.department ? 'is-invalid' : ''}`}
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.departmentName}>
                          {dept.departmentName}
                        </option>
                      ))}
                    </select>
                  )}
                  {errors.department && (
                    <div className="invalid-feedback">{errors.department}</div>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="designation" className="form-label">
                    Designation <span className="text-danger">*</span>
                  </label>
                  {isLoadingDesignations ? (
                    <div className="form-control">
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Loading designations...
                    </div>
                  ) : (
                    <select
                      className={`form-select ${errors.designation ? 'is-invalid' : ''}`}
                      id="designation"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Designation</option>
                      {designations.map((desig) => (
                        <option key={desig.id} value={desig.title}>
                          {desig.title} ({desig.level})
                        </option>
                      ))}
                    </select>
                  )}
                  {errors.designation && (
                    <div className="invalid-feedback">{errors.designation}</div>
                  )}
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="basicSalary" className="form-label">
                    Basic Salary <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className={`form-control ${errors.basicSalary ? 'is-invalid' : ''}`}
                      id="basicSalary"
                      name="basicSalary"
                      value={formData.basicSalary}
                      onChange={handleChange}
                      required
                    />
                    {errors.basicSalary && (
                      <div className="invalid-feedback">{errors.basicSalary}</div>
                    )}
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="status" className="form-label">
                    Status <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Saving...
                  </>
                ) : (
                  employee ? 'Update Employee' : 'Add Employee'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EmployeeModal

