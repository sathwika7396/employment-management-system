import { useState, useEffect } from 'react'
import { employeeService, leaveService, payrollService } from '../services/api'
import { StatCard, InfoCard } from '../components/Cards'
import SimpleBarChart from '../components/SimpleBarChart'
import SimpleLineChart from '../components/SimpleLineChart'

function Dashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    pendingLeaves: 0,
    payrollThisMonth: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [recentLeaves, setRecentLeaves] = useState([])
  const [departmentData, setDepartmentData] = useState([])
  const [monthlyPayrollData, setMonthlyPayrollData] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)

      const employeesResponse = await employeeService.getAll()
      const employees = employeesResponse.data.success ? employeesResponse.data.data || [] : []
      const activeEmployees = employees.filter((emp) => emp.status === 'ACTIVE')

      const leavesResponse = await leaveService.getAll()
      const leaves = leavesResponse.data.success ? leavesResponse.data.data || [] : []
      const pendingLeaves = leaves.filter((leave) => leave.status === 'PENDING')
      const recentPendingLeaves = pendingLeaves
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)

      const currentMonth = new Date().toISOString().slice(0, 7) 
      let payrollThisMonth = 0
      try {
        const payrollResponse = await payrollService.getByMonth(currentMonth)
        if (payrollResponse.data.success) {
          const payrolls = payrollResponse.data.data || []
          payrollThisMonth = payrolls.reduce((sum, p) => sum + parseFloat(p.netSalary || 0), 0)
        }
      } catch (error) {
        
        console.log('No payroll data for current month')
      }

      const departmentCount = {}
      activeEmployees.forEach((emp) => {
        departmentCount[emp.department] = (departmentCount[emp.department] || 0) + 1
      })
      const departmentChartData = Object.entries(departmentCount).map(([dept, count]) => ({
        label: dept.length > 8 ? dept.substring(0, 8) + '...' : dept,
        value: count,
        fullLabel: dept,
      }))

      const monthlyData = []
      for (let i = 5; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const monthStr = date.toISOString().slice(0, 7)
        const monthLabel = date.toLocaleDateString('en-US', { month: 'short' })

        try {
          const monthPayrollResponse = await payrollService.getByMonth(monthStr)
          if (monthPayrollResponse.data.success) {
            const monthPayrolls = monthPayrollResponse.data.data || []
            const total = monthPayrolls.reduce((sum, p) => sum + parseFloat(p.netSalary || 0), 0)
            monthlyData.push({ label: monthLabel, value: Math.round(total / 1000) }) 
          } else {
            monthlyData.push({ label: monthLabel, value: 0 })
          }
        } catch (error) {
          monthlyData.push({ label: monthLabel, value: 0 })
        }
      }

      setStats({
        totalEmployees: employees.length,
        activeEmployees: activeEmployees.length,
        pendingLeaves: pendingLeaves.length,
        payrollThisMonth: payrollThisMonth,
      })
      setRecentLeaves(recentPendingLeaves)
      setDepartmentData(departmentChartData)
      setMonthlyPayrollData(monthlyData)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
      <div className="mb-4">
        <h2 className="mb-1" style={{ fontFamily: "'Source Serif 4', serif", color: '#2F3C7E' }}>Dashboard</h2>
        <p className="text-muted mb-0" style={{ fontSize: '0.9375rem' }}>Welcome back! Here's what's happening today.</p>
      </div>

      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading dashboard data...</p>
        </div>
      ) : (
        <>
          <div className="row mb-4">
            <StatCard
              title="Total Employees"
              value={stats.totalEmployees}
              icon={<i className="bi bi-people-fill"></i>}
              color="primary"
              subtitle={`${stats.activeEmployees} active`}
            />
            <StatCard
              title="Active Employees"
              value={stats.activeEmployees}
              icon={<i className="bi bi-person-check-fill"></i>}
              color="success"
              subtitle={`${stats.totalEmployees - stats.activeEmployees} inactive`}
            />
            <StatCard
              title="Pending Leaves"
              value={stats.pendingLeaves}
              icon={<i className="bi bi-calendar-x-fill"></i>}
              color="warning"
              subtitle="Requires approval"
            />
            <StatCard
              title="Payroll This Month"
              value={formatCurrency(stats.payrollThisMonth)}
              icon={<i className="bi bi-cash-stack"></i>}
              color="info"
              subtitle="Total processed"
            />
          </div>

          <div className="row mb-4">
            <div className="col-md-6 mb-4">
              <InfoCard title="Employees by Department">
                {departmentData.length > 0 ? (
                  <SimpleBarChart data={departmentData} height={250} />
                ) : (
                  <div className="text-center text-muted py-4">
                    <i className="bi bi-bar-chart fs-1 d-block mb-2"></i>
                    No department data available
                  </div>
                )}
              </InfoCard>
            </div>
            <div className="col-md-6 mb-4">
              <InfoCard title="Monthly Payroll Trend (Last 6 Months)">
                {monthlyPayrollData.length > 0 ? (
                  <div>
                    <SimpleLineChart data={monthlyPayrollData} height={220} />
                    <small className="text-muted d-block text-center mt-3 pt-2" style={{ borderTop: '1px solid #eee', marginTop: '1rem' }}>
                      Amount in thousands (₹)
                    </small>
                  </div>
                ) : (
                  <div className="text-center text-muted py-4">
                    <i className="bi bi-graph-up fs-1 d-block mb-2"></i>
                    No payroll data available
                  </div>
                )}
              </InfoCard>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-4">
              <InfoCard title="Recent Pending Leave Requests">
                {recentLeaves.length > 0 ? (
                  <div className="list-group list-group-flush">
                    {recentLeaves.map((leave) => (
                      <div
                        key={leave.id}
                        className="list-group-item d-flex justify-content-between align-items-start border-0 px-0"
                      >
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <h6 className="mb-0">{leave.employeeName}</h6>
                            <span className="badge bg-warning text-dark">{leave.leaveType}</span>
                          </div>
                          <small className="text-muted">
                            {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                          </small>
                          {leave.reason && (
                            <p className="mb-0 mt-1 small text-muted">{leave.reason}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted py-4">
                    <i className="bi bi-check-circle fs-1 d-block mb-2"></i>
                    No pending leave requests
                  </div>
                )}
              </InfoCard>
            </div>

            <div className="col-md-6 mb-4">
              <InfoCard title="Quick Stats">
                <div className="row g-3">
                  <div className="col-6">
                    <div className="text-center p-3 bg-light rounded">
                      <div className="fs-4 fw-bold text-primary">{stats.totalEmployees}</div>
                      <small className="text-muted">Total Employees</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-center p-3 bg-light rounded">
                      <div className="fs-4 fw-bold text-success">{stats.activeEmployees}</div>
                      <small className="text-muted">Active</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-center p-3 bg-light rounded">
                      <div className="fs-4 fw-bold text-warning">{stats.pendingLeaves}</div>
                      <small className="text-muted">Pending Leaves</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-center p-3 bg-light rounded">
                      <div className="fs-4 fw-bold text-info">
                        {formatCurrency(stats.payrollThisMonth)}
                      </div>
                      <small className="text-muted">This Month</small>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <small className="text-muted">Active Employees</small>
                      <small className="text-muted">
                        {stats.totalEmployees > 0
                          ? Math.round((stats.activeEmployees / stats.totalEmployees) * 100)
                          : 0}
                        %
                      </small>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{
                          width: `${
                            stats.totalEmployees > 0
                              ? (stats.activeEmployees / stats.totalEmployees) * 100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="d-flex justify-content-between mb-1">
                      <small className="text-muted">Leave Approval Rate</small>
                      <small className="text-muted">
                        {stats.pendingLeaves > 0 ? 'Action Required' : 'All Clear'}
                      </small>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div
                        className={`progress-bar ${stats.pendingLeaves > 0 ? 'bg-warning' : 'bg-success'}`}
                        role="progressbar"
                        style={{
                          width: `${stats.pendingLeaves > 0 ? 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard
