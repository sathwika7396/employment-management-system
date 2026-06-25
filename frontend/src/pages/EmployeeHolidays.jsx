import { useState, useEffect } from 'react'
import { holidayService } from '../services/api'
import { InfoCard } from '../components/Cards'

function EmployeeHolidays() {
  const [holidays, setHolidays] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState({ type: '', text: '' })

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

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const upcomingHolidays = holidays.filter((holiday) => {
    const holidayDate = new Date(holiday.holidayDate)
    holidayDate.setHours(0, 0, 0, 0)
    return holidayDate >= today
  })

  const pastHolidays = holidays.filter((holiday) => {
    const holidayDate = new Date(holiday.holidayDate)
    holidayDate.setHours(0, 0, 0, 0)
    return holidayDate < today
  })

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
      <div className="mb-4">
        <h2 className="mb-0" style={{ fontFamily: "'Source Serif 4', serif", color: '#2F3C7E' }}>
          Company Holidays
        </h2>
        <p className="text-muted mb-0" style={{ fontSize: '0.9375rem' }}>
          View all company holidays
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

      {upcomingHolidays.length > 0 && (
        <InfoCard title="Upcoming Holidays" className="mb-4">
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
                    <th scope="col" style={{ width: '30%' }}>Holiday Name</th>
                    <th scope="col" style={{ width: '30%' }}>Date</th>
                    <th scope="col" style={{ width: '40%' }}>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingHolidays.map((holiday) => (
                    <tr key={holiday.id}>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </InfoCard>
      )}

      <InfoCard title="All Holidays">
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
                  <th scope="col" style={{ width: '30%' }}>Holiday Name</th>
                  <th scope="col" style={{ width: '30%' }}>Date</th>
                  <th scope="col" style={{ width: '35%' }}>Description</th>
                </tr>
              </thead>
              <tbody>
                {holidays.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-5">
                      <i className="bi bi-calendar-x fs-1 d-block mb-2"></i>
                      No holidays found.
                    </td>
                  </tr>
                ) : (
                  holidays.map((holiday) => {
                    const holidayDate = new Date(holiday.holidayDate)
                    holidayDate.setHours(0, 0, 0, 0)
                    const isPast = holidayDate < today

                    return (
                      <tr key={holiday.id} style={{ opacity: isPast ? 0.7 : 1 }}>
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
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </InfoCard>
    </div>
  )
}

export default EmployeeHolidays

