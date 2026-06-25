function SimpleLineChart({ data, maxValue, height = 200 }) {
  const maxChartValue = maxValue || Math.max(...data.map((item) => item.value), 1)
  const chartHeight = height - 50 

  const getYPosition = (value) => {
    return chartHeight - (value / maxChartValue) * chartHeight
  }

  return (
    <div className="simple-line-chart position-relative" style={{ paddingLeft: '4px', paddingRight: '4px' }}>
      <svg width="100%" height={chartHeight} style={{ overflow: 'visible', display: 'block' }}>
        {[0, 25, 50, 75, 100].map((percent) => {
          const y = (percent / 100) * chartHeight
          return (
            <line
              key={percent}
              x1="0"
              y1={y}
              x2="100%"
              y2={y}
              stroke="#e9ecef"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          )
        })}
        <polyline
          points={data
            .map(
              (item, index) =>
                `${(index / (data.length - 1 || 1)) * 100}%,${getYPosition(item.value)}`
            )
            .join(' ')}
          fill="none"
          stroke="#2F3C7E"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {data.map((item, index) => {
          const x = (index / (data.length - 1 || 1)) * 100
          const y = getYPosition(item.value)
          return (
            <g key={index}>
              <circle
                cx={`${x}%`}
                cy={y}
                r="5"
                fill="#2F3C7E"
                stroke="white"
                strokeWidth="2"
              />
              <text
                x={`${x}%`}
                y={y - 10}
                textAnchor="middle"
                fontSize="10"
                fill="#2F3C7E"
                fontWeight="bold"
              >
                {item.value}
              </text>
            </g>
          )
        })}
      </svg>
      <div
        className="mt-2 px-1"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${data.length}, 1fr)`,
          gap: '4px',
          marginTop: '12px',
        }}
      >
        {data.map((item, index) => (
          <small
            key={index}
            className="text-muted text-center"
            style={{ fontSize: '0.75rem', minWidth: 0 }}
          >
            {item.label}
          </small>
        ))}
      </div>
    </div>
  )
}

export default SimpleLineChart

