import { useState, useEffect } from 'react'
import { employeeService } from '../services/api'
import EmployeeModal from '../components/EmployeeModal'
import { InfoCard } from '../components/Cards'

function Employees() {
  const [employees, setEmployees] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      setIsLoading(true)
      const response = await employeeService.getAll()
      if (response.data.success) {
        setEmployees(response.data.data || [])
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Failed to fetch employees' })
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch employees'
      setMessage({ type: 'error', text: errorMessage })
      setEmployees([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingEmployee(null)
    setShowModal(true)
  }

  const handleEdit = (employee) => {
    setEditingEmployee(employee)
    setShowModal(true)
  }

  const handleSave = async (employeeData) => {
    try {
      let response
      if (editingEmployee) {
        
        response = await employeeService.update(editingEmployee.id, employeeData)
      } else {
        
        response = await employeeService.create(employeeData)
      }

      if (response.data.success) {
        setMessage({
          type: 'success',
          text: editingEmployee
            ? 'Employee updated successfully'
            : 'Employee added successfully',
        })
        
        await fetchEmployees()
        
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Operation failed' })
        throw new Error(response.data.message)
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Operation failed'
      setMessage({ type: 'error', text: errorMessage })
      throw error
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}? This will set their status to INACTIVE.`)) {
      return
    }

    try {
      const response = await employeeService.delete(id)
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Employee deleted successfully' })
        
        await fetchEmployees()
        
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Failed to delete employee' })
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to delete employee'
      setMessage({ type: 'error', text: errorMessage })
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0" style={{ fontFamily: "'Source Serif 4', serif", color: '#2F3C7E' }}>Employee Management</h2>
          <p className="text-muted mb-0" style={{ fontSize: '0.9375rem' }}>Manage your organization's employees</p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd} style={{ borderRadius: '8px' }}>
          <i className="bi bi-plus-circle me-2"></i>
          Add Employee
        </button>
      </div>

      {/* Success/Error Messages */}
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
            <p className="mt-3 text-muted">Loading employees...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Department</th>
                  <th scope="col">Designation</th>
                  <th scope="col">Basic Salary</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center text-muted py-5">
                      <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                      No employees found. Click 'Add Employee' to get started.
                    </td>
                  </tr>
                ) : (
                  employees.map((employee) => (
                    <tr key={employee.id}>
                      <td>{employee.id}</td>
                      <td>
                        <strong>{employee.name}</strong>
                      </td>
                      <td>{employee.email}</td>
                      <td>
                        <span className="badge bg-info text-dark">{employee.department}</span>
                      </td>
                      <td>{employee.designation}</td>
                      <td>
                        <strong className="text-success">{formatCurrency(employee.basicSalary)}</strong>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            employee.status === 'ACTIVE' ? 'bg-success' : 'bg-secondary'
                          }`}
                        >
                          {employee.status}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEdit(employee)}
                            title="Edit Employee"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(employee.id, employee.name)}
                            title="Delete Employee"
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

      {/* Employee Modal */}
      <EmployeeModal
        show={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingEmployee(null)
        }}
        onSave={handleSave}
        employee={editingEmployee}
      />
    </div>
  )
}

export default Employees
