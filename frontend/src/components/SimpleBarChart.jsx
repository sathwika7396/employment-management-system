function SimpleBarChart({ data, maxValue, height = 200 }) {
  const maxBarValue = maxValue || Math.max(...data.map((item) => item.value), 1)

  return (
    <div className="simple-bar-chart" style={{ height: `${height}px`, position: 'relative' }}>
      <div className="d-flex align-items-end justify-content-between h-100 gap-2">
        {data.map((item, index) => {
          const percentage = (item.value / maxBarValue) * 100
          return (
            <div key={index} className="flex-fill d-flex flex-column align-items-center">
              <div
                className="w-100 rounded-top"
                style={{
                  height: `${percentage}%`,
                  minHeight: item.value > 0 ? '4px' : '0',
                  transition: 'height 0.3s ease',
                  background: 'linear-gradient(to top, #2F3C7E, #253061)',
                }}
                title={`${item.label}: ${item.value}`}
              ></div>
              <small className="mt-2 text-muted text-center" style={{ fontSize: '0.75rem' }}>
                {item.label}
              </small>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SimpleBarChart

