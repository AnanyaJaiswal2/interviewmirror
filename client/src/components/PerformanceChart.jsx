import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-900 border border-white/20 rounded-lg p-3 text-xs">
      <div className="text-white/60 mb-2">Session {label}</div>
      {payload.map(p => (
        <div key={p.name} className="flex justify-between gap-4">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="text-white font-medium">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function PerformanceChart({ data }) {
  if (!data || data.length < 2) {
    return (
      <div className="flex items-center justify-center h-40
                      text-gray-500 text-sm">
        Complete at least 2 sessions to see your progress chart
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
        <XAxis
          dataKey="session"
          tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          label={{ value: 'Session', position: 'insideBottom', offset: -2,
                   fill: 'rgba(255,255,255,0.2)', fontSize: 11 }}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}
        />
        <Line
          type="monotone"
          dataKey="score"
          name="Overall"
          stroke="#7F77DD"
          strokeWidth={2}
          dot={{ fill: '#7F77DD', r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="confidence"
          name="Confidence"
          stroke="#1D9E75"
          strokeWidth={2}
          dot={{ fill: '#1D9E75', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}