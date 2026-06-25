function PayslipCard({ payroll }) {
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
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <div className="card shadow-sm mb-4" style={{ borderRadius: '8px' }}>
      <div className="card-header text-white" style={{ background: 'linear-gradient(135deg, #2F3C7E 0%, #253061 100%)', borderRadius: '8px 8px 0 0' }}>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0" style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 600 }}>Payslip</h5>
            <small style={{ opacity: 0.9 }}>{formatMonth(payroll.month)}</small>
          </div>
          <div className="text-end">
            <small>Generated: {formatDate(payroll.generatedDate)}</small>
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="row mb-3">
          <div className="col-md-6">
            <h6 className="text-muted mb-1">Employee</h6>
            <p className="mb-0">
              <strong>{payroll.employeeName || 'N/A'}</strong>
            </p>
            <small className="text-muted">ID: {payroll.employeeId}</small>
          </div>
          <div className="col-md-6 text-md-end">
            <h6 className="text-muted mb-1">Pay Period</h6>
            <p className="mb-0">
              <strong>{formatMonth(payroll.month)}</strong>
            </p>
          </div>
        </div>

        <hr />

        <div className="row mb-3">
          <div className="col-12">
            <h6 className="text-muted mb-3">Earnings</h6>
            <div className="d-flex justify-content-between mb-2">
              <span>Basic Salary</span>
              <strong>{formatCurrency(payroll.basicSalary)}</strong>
            </div>
          </div>
        </div>

        <hr />

        <div className="row mb-3">
          <div className="col-12">
            <h6 className="text-muted mb-3">Deductions</h6>
            <div className="d-flex justify-content-between mb-2">
              <span>Tax (10%)</span>
              <span className="text-danger">-{formatCurrency(payroll.taxAmount)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Leave Deduction</span>
              <span className="text-danger">-{formatCurrency(payroll.leaveDeduction)}</span>
            </div>
          </div>
        </div>

        <hr className="border-2 border-primary" />

        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
              <h5 className="mb-0">Net Salary</h5>
              <h4 className="mb-0 text-success fw-bold">{formatCurrency(payroll.netSalary)}</h4>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <small className="text-muted">
            <strong>Breakdown:</strong> {formatCurrency(payroll.basicSalary)} - {formatCurrency(payroll.taxAmount)} - {formatCurrency(payroll.leaveDeduction)} = {formatCurrency(payroll.netSalary)}
          </small>
        </div>
      </div>
    </div>
  )
}

export default PayslipCard

