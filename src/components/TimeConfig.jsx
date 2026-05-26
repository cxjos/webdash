import { useState } from 'react';

const AVAILABLE_ZONES = [
  'Europe/Moscow',
  'Europe/London',
  'America/New_York',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Europe/Berlin',
  'Europe/Paris',
  'Asia/Dubai',
  'Australia/Sydney',
  'America/Los_Angeles',
];

const DEFAULT_ZONE = 'Europe/London';

export default function TimeConfig({ config, onChange }) {
  const [zones, setZones] = useState(config?.zones?.length ? config.zones : ['Europe/Moscow']);

  const handleZoneChange = (index, value) => {
    const updated = [...zones];
    updated[index] = value;
    setZones(updated);
    onChange({ zones: updated });
  };

  const handleRemove = (index) => {
    if (zones.length <= 1) return;
    const updated = zones.filter((_, i) => i !== index);
    setZones(updated);
    onChange({ zones: updated });
  };

  const handleAdd = () => {
    if (zones.length >= 4) return;
    const used = new Set(zones);
    const next = AVAILABLE_ZONES.find((z) => !used.has(z)) || DEFAULT_ZONE;
    const updated = [...zones, next];
    setZones(updated);
    onChange({ zones: updated });
  };

  return (
    <div className="timeConfig">
      {zones.map((zone, index) => (
        <div key={index} className="timeConfigRow">
          <select
            className="timeConfigSelect"
            value={zone}
            onChange={(e) => handleZoneChange(index, e.target.value)}
          >
            {AVAILABLE_ZONES.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
          {zones.length > 1 && (
            <button
              type="button"
              className="timeConfigRemove"
              onClick={() => handleRemove(index)}
            >
              Удалить
            </button>
          )}
        </div>
      ))}
      {zones.length < 4 && (
        <button type="button" className="timeConfigAdd" onClick={handleAdd}>
          + Добавить
        </button>
      )}
    </div>
  );
}
