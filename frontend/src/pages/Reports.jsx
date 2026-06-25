import { useState, useEffect } from 'react'
import { reportService } from '../services/api'
import { InfoCard } from '../components/Cards'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Pie, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

function Reports() {
  const [payrollData, setPayrollData] = useState([])
  const [leaveData, setLeaveData] = useState([])
  const [attendanceData, setAttendanceData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    fetchAllReports()
  }, [])

  const fetchAllReports = async () => {
    try {
      setIsLoading(true)
      const [payrollRes, leaveRes, attendanceRes] = await Promise.all([
        reportService.getMonthlyPayrollSummary(),
        reportService.getLeaveSummary(),
        reportService.getAttendanceSummary(),
      ])

      if (payrollRes.data.success) {
        setPayrollData(payrollRes.data.data || [])
      }
      if (leaveRes.data.success) {
        setLeaveData(leaveRes.data.data || [])
      }
      if (attendanceRes.data.success) {
        setAttendanceData(attendanceRes.data.data || [])
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch reports'
      setMessage({ type: 'error', text: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  const formatMonth = (monthString) => {
    if (!monthString) return 'N/A'
    const [year, month] = monthString.split('-')
    const date = new Date(year, parseInt(month) - 1)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const payrollChartData = {
    labels: payrollData.map((item) => formatMonth(item.month)),
    datasets: [
      {
        label: 'Total Salary Paid',
        data: payrollData.map((item) => parseFloat(item.totalSalaryPaid)),
        backgroundColor: 'rgba(47, 60, 126, 0.8)',
        borderColor: 'rgba(47, 60, 126, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  }

  const payrollChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Monthly Payroll Summary',
        font: {
          family: "'Source Serif 4', serif",
          size: 18,
          weight: 600,
        },
        color: '#2F3C7E',
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          family: "'Inter', sans-serif",
          size: 14,
          weight: 600,
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 13,
        },
        callbacks: {
          label: function (context) {
            return `Total Salary: ${formatCurrency(context.parsed.y)}`
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return formatCurrency(value)
          },
          font: {
            family: "'Inter', sans-serif",
            size: 11,
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 11,
          },
        },
        grid: {
          display: false,
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    },
  }

  const leaveChartData = {
    labels: leaveData.map((item) => item.leaveType),
    datasets: [
      {
        data: leaveData.map((item) => item.count),
        backgroundColor: [
          'rgba(47, 60, 126, 0.8)',
          'rgba(251, 234, 235, 0.8)',
          'rgba(227, 100, 20, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderColor: [
          'rgba(47, 60, 126, 1)',
          'rgba(251, 234, 235, 1)',
          'rgba(227, 100, 20, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(139, 92, 246, 1)',
        ],
        borderWidth: 2,
      },
    ],
  }

  const leaveChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
          padding: 15,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: 'Leave Type Distribution',
        font: {
          family: "'Source Serif 4', serif",
          size: 18,
          weight: 600,
        },
        color: '#2F3C7E',
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          family: "'Inter', sans-serif",
          size: 14,
          weight: 600,
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 13,
        },
        callbacks: {
          label: function (context) {
            const label = context.label || ''
            const value = context.parsed || 0
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const percentage = ((value / total) * 100).toFixed(1)
            return `${label}: ${value} (${percentage}%)`
          },
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    },
  }

  const latestAttendance = attendanceData.length > 0 ? attendanceData[0] : null
  const attendanceChartData = latestAttendance
    ? {
        labels: ['Present', 'Absent'],
        datasets: [
          {
            label: formatMonth(latestAttendance.month),
            data: [latestAttendance.presentCount, latestAttendance.absentCount],
            backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(239, 68, 68, 0.8)'],
            borderColor: ['rgba(16, 185, 129, 1)', 'rgba(239, 68, 68, 1)'],
            borderWidth: 2,
          },
        ],
      }
    : null

  const attendanceChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
          padding: 15,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: 'Attendance Summary (Latest Month)',
        font: {
          family: "'Source Serif 4', serif",
          size: 18,
          weight: 600,
        },
        color: '#2F3C7E',
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          family: "'Inter', sans-serif",
          size: 14,
          weight: 600,
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 13,
        },
        callbacks: {
          label: function (context) {
            const label = context.label || ''
            const value = context.parsed || 0
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const percentage = ((value / total) * 100).toFixed(1)
            return `${label}: ${value} (${percentage}%)`
          },
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    },
  }

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
      <div className="mb-4">
        <h2 className="mb-0" style={{ fontFamily: "'Source Serif 4', serif", color: '#2F3C7E' }}>
          Reports & Analytics
        </h2>
        <p className="text-muted mb-0" style={{ fontSize: '0.9375rem' }}>
          Visual insights into payroll, leaves, and attendance
        </p>
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

      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading reports...</p>
        </div>
      ) : (
        <>
          <div className="row mb-4">
            <div className="col-lg-8 mb-4">
              <InfoCard>
                <div style={{ height: '400px', position: 'relative' }}>
                  {payrollData.length > 0 ? (
                    <Bar data={payrollChartData} options={payrollChartOptions} />
                  ) : (
                    <div className="text-center py-5">
                      <i className="bi bi-bar-chart fs-1 text-muted d-block mb-2"></i>
                      <p className="text-muted">No payroll data available</p>
                    </div>
                  )}
                </div>
              </InfoCard>
            </div>

            <div className="col-lg-4 mb-4">
              <InfoCard>
                <div style={{ height: '400px', position: 'relative' }}>
                  {leaveData.length > 0 ? (
                    <Pie data={leaveChartData} options={leaveChartOptions} />
                  ) : (
                    <div className="text-center py-5">
                      <i className="bi bi-pie-chart fs-1 text-muted d-block mb-2"></i>
                      <p className="text-muted">No leave data available</p>
                    </div>
                  )}
                </div>
              </InfoCard>
            </div>
          </div>

          {attendanceChartData && (
            <div className="row mb-4">
              <div className="col-lg-6 mb-4">
                <InfoCard>
                  <div style={{ height: '400px', position: 'relative' }}>
                    <Doughnut data={attendanceChartData} options={attendanceChartOptions} />
                  </div>
                </InfoCard>
              </div>
            </div>
          )}

          <div className="row">
            <div className="col-12 mb-4">
              <InfoCard>
                <h5
                  className="mb-3"
                  style={{ fontFamily: "'Source Serif 4', serif", color: '#2F3C7E' }}
                >
                  Monthly Payroll Summary
                </h5>
                <div className="table-responsive">
                  <table className="table table-striped table-hover align-middle">
                    <thead className="table-dark">
                      <tr>
                        <th scope="col">Month</th>
                        <th scope="col">Total Employees Paid</th>
                        <th scope="col">Total Salary Paid</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payrollData.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="text-center text-muted py-3">
                            No payroll data available
                          </td>
                        </tr>
                      ) : (
                        payrollData.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <strong style={{ color: '#2F3C7E' }}>{formatMonth(item.month)}</strong>
                            </td>
                            <td>
                              <span className="badge bg-info">{item.totalEmployeesPaid}</span>
                            </td>
                            <td>
                              <strong>{formatCurrency(item.totalSalaryPaid)}</strong>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </InfoCard>
            </div>

            <div className="col-lg-6 mb-4">
              <InfoCard>
                <h5
                  className="mb-3"
                  style={{ fontFamily: "'Source Serif 4', serif", color: '#2F3C7E' }}
                >
                  Leave Type Distribution
                </h5>
                <div className="table-responsive">
                  <table className="table table-striped table-hover align-middle">
                    <thead className="table-dark">
                      <tr>
                        <th scope="col">Leave Type</th>
                        <th scope="col">Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaveData.length === 0 ? (
                        <tr>
                          <td colSpan="2" className="text-center text-muted py-3">
                            No leave data available
                          </td>
                        </tr>
                      ) : (
                        leaveData.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <strong style={{ color: '#2F3C7E' }}>{item.leaveType}</strong>
                            </td>
                            <td>
                              <span className="badge bg-primary">{item.count}</span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </InfoCard>
            </div>

            <div className="col-lg-6 mb-4">
              <InfoCard>
                <h5
                  className="mb-3"
                  style={{ fontFamily: "'Source Serif 4', serif", color: '#2F3C7E' }}
                >
                  Attendance Summary
                </h5>
                <div className="table-responsive">
                  <table className="table table-striped table-hover align-middle">
                    <thead className="table-dark">
                      <tr>
                        <th scope="col">Month</th>
                        <th scope="col">Present</th>
                        <th scope="col">Absent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceData.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="text-center text-muted py-3">
                            No attendance data available
                          </td>
                        </tr>
                      ) : (
                        attendanceData.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <strong style={{ color: '#2F3C7E' }}>{formatMonth(item.month)}</strong>
                            </td>
                            <td>
                              <span className="badge bg-success">{item.presentCount}</span>
                            </td>
                            <td>
                              <span className="badge bg-danger">{item.absentCount}</span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </InfoCard>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Reports

