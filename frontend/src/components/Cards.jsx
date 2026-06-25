function StatCard({ title, value, icon, color = 'primary', subtitle }) {
  return (
    <div className="col-md-3 mb-4">
      <div className={`card border-0 shadow-sm bg-${color} text-white h-100`} style={{ borderRadius: '8px' }}>
        <div className="card-body" style={{ padding: '1.5rem' }}>
          <div className="d-flex justify-content-between align-items-start">
            <div className="flex-grow-1">
              <h6 className="card-subtitle mb-2 text-white-50" style={{ fontSize: '0.875rem', fontWeight: 500, opacity: 0.9 }}>
                {title}
              </h6>
              <h2 className="card-title mb-1 fw-bold" style={{ fontSize: '2rem', fontFamily: "'Source Serif 4', serif" }}>
                {value}
              </h2>
              {subtitle && (
                <small className="text-white-50 d-block mt-2" style={{ fontSize: '0.75rem', opacity: 0.85 }}>
                  {subtitle}
                </small>
              )}
            </div>
            <div className="fs-1 opacity-75" style={{ fontSize: '3rem', opacity: 0.7 }}>
              {icon}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoCard({ title, children, className = '' }) {
  return (
    <div className={`card border-0 shadow-sm ${className}`} style={{ borderRadius: '8px' }}>
      <div className="card-header bg-white border-bottom" style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.08)', padding: '1.25rem 1.5rem' }}>
        <h5 className="card-title mb-0" style={{ fontFamily: "'Source Serif 4', serif", color: '#2F3C7E', fontWeight: 600, fontSize: '1.125rem' }}>{title}</h5>
      </div>
      <div className="card-body" style={{ padding: '1.5rem' }}>{children}</div>
    </div>
  )
}

export { StatCard, InfoCard }

