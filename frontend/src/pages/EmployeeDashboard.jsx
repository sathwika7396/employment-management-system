import { StatCard, InfoCard } from '../components/Cards'

function EmployeeDashboard() {
  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
      <h2 className="mb-4" style={{ fontFamily: "'Source Serif 4', serif", color: '#2F3C7E' }}>Employee Dashboard</h2>
      
      <div className="row mb-4">
        <StatCard
          title="My Leave Balance"
          value="15"
          icon="📅"
          color="info"
          subtitle="Days remaining"
        />
        <StatCard
          title="Pending Requests"
          value="2"
          icon="⏳"
          color="warning"
          subtitle="Awaiting approval"
        />
        <StatCard
          title="This Month Salary"
          value="₹5,000"
          icon="💰"
          color="success"
          subtitle="Net amount"
        />
        <StatCard
          title="Total Leaves Taken"
          value="5"
          icon="✅"
          color="primary"
          subtitle="This year"
        />
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <InfoCard title="My Leave Requests">
            <p className="text-muted mb-0">No leave requests found</p>
          </InfoCard>
        </div>
        <div className="col-md-6 mb-4">
          <InfoCard title="Recent Payroll">
            <p className="text-muted mb-0">No payroll records found</p>
          </InfoCard>
        </div>
      </div>
    </div>
  )
}

export default EmployeeDashboard

