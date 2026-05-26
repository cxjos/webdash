import useMockWeather from '../hooks/useMockWeather';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

export default function WeatherRenderer({ config }) {
  const { data } = useMockWeather(config.city);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <span style={{
        fontSize: 10,
        color: 'rgba(255,255,255,0.35)',
        letterSpacing: '-0.02em',
        padding: '6px 0 0 6px',
      }}>
        {data.city}
      </span>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.daily} margin={{ top: 4, right: 8, left: -20, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="date"
              stroke="rgba(255,255,255,0.3)"
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
              tickFormatter={(date) => new Date(date).toLocaleDateString('ru-RU', { weekday: 'short' })}
            />
            <YAxis
              stroke="rgba(255,255,255,0.3)"
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
              tickFormatter={(val) => `${val}°`}
            />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="rgba(255,255,255,0.7)"
              strokeWidth={2}
              dot={false}
              activeDot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}