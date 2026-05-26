import { useState } from 'react';

export default function WeatherConfig({ config, onChange }) {
  const [city, setCity] = useState(config.city || 'Москва');

  function handleChange(e) {
    const value = e.target.value;
    setCity(value);
    onChange({ city: value });
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }

  return (
    <div style={{ padding: '8px 0' }}>
      <label
        style={{
          display: 'block',
          fontSize: '11px',
          color: 'rgba(255,255,255,0.5)',
          marginBottom: '6px'
        }}
      >
        Город
      </label>
      <input
        type="text"
        value={city}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        style={{
          width: '100%',
          padding: '8px 12px',
          fontSize: '12px',
          fontFamily: 'JetBrains Mono, monospace',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '4px',
          color: 'rgba(255,255,255,0.9)',
          outline: 'none',
          boxSizing: 'border-box'
        }}
      />
    </div>
  );
}