import { useState, useEffect } from 'react';
import useMockTime from '../hooks/useMockTime';

export default function TimeRenderer({ config }) {
  const [now, setNow] = useState(new Date());
  const { data } = useMockTime(config.zones);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!data || !data.zones || data.zones.length === 0) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>—</span>
      </div>
    );
  }

  const zones = data.zones.slice(0, 4);
  const timeFontSize = zones.length === 1 ? 28 : zones.length === 2 ? 22 : 16;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '6px' }}>
      {zones.map((zone) => (
        <div key={zone.id} style={{ display: 'flex', flexDirection: 'column', marginBottom: 4 }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: '-0.02em' }}>
            {zone.name}
          </span>
          <span style={{ fontSize: timeFontSize, color: 'rgba(255,255,255,0.9)', fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            {new Intl.DateTimeFormat('ru-RU', {
              timeZone: zone.id,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,
            }).format(now)}
          </span>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '-0.02em' }}>
            {new Intl.DateTimeFormat('ru-RU', {
              timeZone: zone.id,
              day: '2-digit',
              month: '2-digit',
              year: '2-digit',
            }).format(now)}
          </span>
        </div>
      ))}
    </div>
  );
}
