import { useState, useEffect } from 'react'
import { payrollService, employeeService } from '../services/api'
import PayslipCard from '../components/PayslipCard'
import { InfoCard } from '../components/Cards'

function Payroll() {
  const [payrolls, setPayrolls] = useState([])
  const [filteredPayrolls, setFilteredPayrolls] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState('')
  const [message, setMessage] = useState({ type: '', text: '' })
  const [selectedPayroll, setSelectedPayroll] = useState(null)
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [generateForm, setGenerateForm] = useState({ employeeId: '', month: '' })
  const [employees, setEmployees] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    fetchPayrolls()
  }, [])

  useEffect(() => {
    if (selectedMonth) {
      const filtered = payrolls.filter((p) => p.month === selectedMonth)
      setFilteredPayrolls(filtered)
    } else {
      setFilteredPayrolls(payrolls)
    }
  }, [selectedMonth, payrolls])

  const fetchPayrolls = async () => {
    try {
      setIsLoading(true)

      const currentMonth = new Date().toISOString().slice(0, 7) 
      const response = await payrollService.getByMonth(currentMonth)
      if (response.data.success) {
        setPayrolls(response.data.data || [])
        setFilteredPayrolls(response.data.data || [])
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Failed to fetch payrolls' })
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch payrolls'
      setMessage({ type: 'error', text: errorMessage })
      setPayrolls([])
      setFilteredPayrolls([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleMonthChange = async (month) => {
    if (!month) {
      setSelectedMonth('')
      setFilteredPayrolls(payrolls)
      return
    }

    try {
      setIsLoading(true)
      const response = await payrollService.getByMonth(month)
      if (response.data.success) {
        setFilteredPayrolls(response.data.data || [])
        setSelectedMonth(month)
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Failed to fetch payrolls' })
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch payrolls'
      setMessage({ type: 'error', text: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatMonth = (monthString) => {
    if (!monthString) return 'N/A'
    const [year, month] = monthString.split('-')
    const date = new Date(year, parseInt(month) - 1)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const getAvailableMonths = () => {
    const months = [...new Set(payrolls.map((p) => p.month))].sort().reverse()
    return months
  }

  useEffect(() => {
    if (showGenerateModal) {
      employeeService.getAll().then((res) => {
        if (res.data.success) {
          const active = (res.data.data || []).filter((e) => e.status === 'ACTIVE')
          setEmployees(active)
          if (active.length > 0 && !generateForm.employeeId) {
            setGenerateForm((prev) => ({ ...prev, employeeId: active[0].id }))
          }
        }
      })
      const now = new Date()
      const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
      setGenerateForm((prev) => ({ ...prev, month: prev.month || monthStr }))
    }
  }, [showGenerateModal])

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!generateForm.employeeId || !generateForm.month) {
      setMessage({ type: 'error', text: 'Please select employee and month' })
      return
    }
    setIsGenerating(true)
    setMessage({ type: '', text: '' })
    try {
      const response = await payrollService.create({
        employeeId: Number(generateForm.employeeId),
        month: generateForm.month,
      })
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Payroll generated successfully' })
        setShowGenerateModal(false)
        setGenerateForm({ employeeId: '', month: '' })
        await fetchPayrolls()
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Failed to generate payroll' })
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || error.message || 'Failed to generate payroll',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this payroll record? This action cannot be undone.')) {
      return
    }

    try {
      const response = await payrollService.delete(id)
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Payroll record deleted successfully' })
        setSelectedPayroll(null)
        
        if (selectedMonth) {
          const monthResponse = await payrollService.getByMonth(selectedMonth)
          if (monthResponse.data.success) {
            setFilteredPayrolls(monthResponse.data.data || [])
          }
        } else {
          await fetchPayrolls()
        }
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Failed to delete payroll record' })
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to delete payroll record'
      setMessage({ type: 'error', text: errorMessage })
    }
  }

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0" style={{ fontFamily: "'Source Serif 4', serif", color: '#2F3C7E' }}>Payroll Management</h2>
          <p className="text-muted mb-0" style={{ fontSize: '0.9375rem' }}>View and manage employee payrolls</p>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-success"
            onClick={() => setShowGenerateModal(true)}
            style={{ borderRadius: '8px' }}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Generate Payroll
          </button>
          <input
            type="month"
            className="form-control"
            value={selectedMonth}
            onChange={(e) => handleMonthChange(e.target.value)}
            style={{ width: 'auto' }}
          />
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

      {selectedPayroll ? (
        <div>
          <button
            className="btn btn-outline-secondary mb-3"
            onClick={() => setSelectedPayroll(null)}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Back to List
          </button>
          <PayslipCard payroll={selectedPayroll} />
        </div>
      ) : (
        <InfoCard>
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading payrolls...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Employee</th>
                    <th scope="col">Month</th>
                    <th scope="col">Basic Salary</th>
                    <th scope="col">Tax</th>
                    <th scope="col">Leave Deduction</th>
                    <th scope="col">Net Salary</th>
                    <th scope="col" className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayrolls.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center text-muted py-5">
                        <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                        No payroll records found.
                      </td>
                    </tr>
                  ) : (
                    filteredPayrolls.map((payroll) => (
                      <tr key={payroll.id}>
                        <td>{payroll.id}</td>
                        <td>
                          <strong>{payroll.employeeName || 'N/A'}</strong>
                          <br />
                          <small className="text-muted">ID: {payroll.employeeId}</small>
                        </td>
                        <td>{formatMonth(payroll.month)}</td>
                        <td>{formatCurrency(payroll.basicSalary)}</td>
                        <td className="text-danger">-{formatCurrency(payroll.taxAmount)}</td>
                        <td className="text-danger">-{formatCurrency(payroll.leaveDeduction)}</td>
                        <td>
                          <strong className="text-success fs-5">
                            {formatCurrency(payroll.netSalary)}
                          </strong>
                        </td>
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => setSelectedPayroll(payroll)}
                              title="View Payslip"
                            >
                              <i className="bi bi-eye"></i> View
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(payroll.id)}
                              title="Delete Payroll"
                            >
                              <i className="bi bi-trash"></i> Delete
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
      )}

      {showGenerateModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowGenerateModal(false)}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content" style={{ borderRadius: '8px' }}>
              <div className="modal-header" style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', backgroundColor: '#F7F8FC' }}>
                <h5 className="modal-title" style={{ fontFamily: "'Source Serif 4', serif", color: '#2F3C7E' }}>Generate Payroll</h5>
                <button type="button" className="btn-close" onClick={() => setShowGenerateModal(false)} aria-label="Close"></button>
              </div>
              <form onSubmit={handleGenerate}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Employee <span className="text-danger">*</span></label>
                    <select
                      className="form-select"
                      value={generateForm.employeeId}
                      onChange={(e) => setGenerateForm({ ...generateForm, employeeId: e.target.value })}
                      required
                    >
                      <option value="">Select Employee</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name} ({emp.email})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Month <span className="text-danger">*</span></label>
                    <input
                      type="month"
                      className="form-control"
                      value={generateForm.month}
                      onChange={(e) => setGenerateForm({ ...generateForm, month: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowGenerateModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success" disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Generating...
                      </>
                    ) : (
                      'Generate'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Payroll
