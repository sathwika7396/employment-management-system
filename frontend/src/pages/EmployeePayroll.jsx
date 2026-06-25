import { useState, useEffect } from 'react'
import { payrollService, employeeService } from '../services/api'
import { InfoCard } from '../components/Cards'

function EmployeePayroll() {
  const [payrolls, setPayrolls] = useState([])
  const [filteredPayrolls, setFilteredPayrolls] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState('')
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
      fetchPayrollHistory()
    }
  }, [employeeId])

  useEffect(() => {
    if (selectedMonth) {
      const filtered = payrolls.filter((p) => p.month === selectedMonth)
      setFilteredPayrolls(filtered)
    } else {
      setFilteredPayrolls(payrolls)
    }
  }, [selectedMonth, payrolls])

  const fetchPayrollHistory = async () => {
    if (!employeeId) {
      return
    }

    try {
      setIsLoading(true)
      const response = await payrollService.getHistoryByEmployee(employeeId)
      if (response.data.success) {
        setPayrolls(response.data.data || [])
        setFilteredPayrolls(response.data.data || [])
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Failed to fetch payroll history' })
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch payroll history'
      setMessage({ type: 'error', text: errorMessage })
      setPayrolls([])
      setFilteredPayrolls([])
    } finally {
      setIsLoading(false)
    }
  }

  const formatMonth = (monthString) => {
    if (!monthString) return 'N/A'
    const [year, month] = monthString.split('-')
    const date = new Date(year, parseInt(month) - 1)
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const formatMonthShort = (monthString) => {
    if (!monthString) return 'N/A'
    const [year, month] = monthString.split('-')
    const date = new Date(year, parseInt(month) - 1)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const getAvailableMonths = () => {
    return [...new Set(payrolls.map((p) => p.month))].sort().reverse()
  }

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0" style={{ fontFamily: "'Source Serif 4', serif", color: '#2F3C7E' }}>
            Payroll History
          </h2>
          <p className="text-muted mb-0" style={{ fontSize: '0.9375rem' }}>
            View your salary payslip history
          </p>
        </div>
        {payrolls.length > 0 && (
          <div>
            <select
              className="form-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{ width: 'auto', display: 'inline-block', borderRadius: '8px' }}
            >
              <option value="">All Months</option>
              {getAvailableMonths().map((month) => (
                <option key={month} value={month}>
                  {formatMonth(month)}
                </option>
              ))}
            </select>
          </div>
        )}
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
            <p className="mt-3 text-muted">Loading payroll history...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th scope="col" style={{ width: '15%' }}>Pay Period</th>
                  <th scope="col" style={{ width: '20%' }}>Basic Salary</th>
                  <th scope="col" style={{ width: '15%' }}>Tax</th>
                  <th scope="col" style={{ width: '15%' }}>Leave Deduction</th>
                  <th scope="col" style={{ width: '20%' }}>Net Salary</th>
                  <th scope="col" style={{ width: '15%' }}>Generated Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayrolls.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-5">
                      <i className="bi bi-receipt fs-1 d-block mb-2"></i>
                      No payroll records found. Your payroll history will appear here once payrolls are generated.
                    </td>
                  </tr>
                ) : (
                  filteredPayrolls.map((payroll) => (
                    <tr key={payroll.id}>
                      <td>
                        <strong style={{ color: '#2F3C7E', fontSize: '1rem' }}>
                          {formatMonthShort(payroll.month)}
                        </strong>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.95rem' }}>
                          {formatCurrency(payroll.basicSalary)}
                        </span>
                      </td>
                      <td>
                        <span className="text-danger" style={{ fontSize: '0.95rem' }}>
                          -{formatCurrency(payroll.taxAmount)}
                        </span>
                      </td>
                      <td>
                        <span className="text-danger" style={{ fontSize: '0.95rem' }}>
                          -{formatCurrency(payroll.leaveDeduction)}
                        </span>
                      </td>
                      <td>
                        <strong
                          style={{
                            color: '#28a745',
                            fontSize: '1.1rem',
                            fontWeight: 600,
                          }}
                        >
                          {formatCurrency(payroll.netSalary)}
                        </strong>
                      </td>
                      <td>
                        <small className="text-muted">
                          {payroll.generatedDate
                            ? new Date(payroll.generatedDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })
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
    </div>
  )
}

export default EmployeePayroll
