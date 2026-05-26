import { useState } from 'react';

const AVAILABLE_PAIRS = ['USD/RUB', 'EUR/RUB', 'CNY/RUB', 'GBP/RUB', 'JPY/RUB'];
const DEFAULT_PAIRS = ['USD/RUB', 'EUR/RUB', 'CNY/RUB'];

export default function CurrencyConfig({ config, onChange }) {
  const [selectedPairs, setSelectedPairs] = useState(
    config.pairs && config.pairs.length > 0 ? [...config.pairs] : [...DEFAULT_PAIRS]
  );

  function togglePair(pair) {
    let newPairs;
    if (selectedPairs.includes(pair)) {
      if (selectedPairs.length === 1) return;
      newPairs = selectedPairs.filter((p) => p !== pair);
    } else {
      newPairs = [...selectedPairs, pair];
    }
    setSelectedPairs(newPairs);
    onChange({ pairs: newPairs });
  }

  return (
    <div style={{ padding: '8px 0' }}>
      <div
        style={{
          fontSize: '11px',
          color: 'rgba(255,255,255,0.5)',
          marginBottom: '10px'
        }}
      >
        Валютные пары
      </div>
      {AVAILABLE_PAIRS.map((pair) => {
        const isChecked = selectedPairs.includes(pair);
        return (
          <div
            key={pair}
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '10px',
              alignItems: 'center',
              padding: '6px 0'
            }}
          >
            <div
              onClick={() => togglePair(pair)}
              style={{
                width: '14px',
                height: '14px',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '3px',
                background: isChecked ? 'rgba(255,255,255,0.7)' : 'transparent',
                cursor: 'pointer',
                flexShrink: 0
              }}
            />
            <span
              style={{
                fontSize: '12px',
                color: 'rgba(255,255,255,0.8)',
                cursor: 'pointer',
                userSelect: 'none'
              }}
              onClick={() => togglePair(pair)}
            >
              {pair}
            </span>
          </div>
        );
      })}
      {selectedPairs.length === 0 && (
        <div
          style={{
            fontSize: '10px',
            color: 'rgba(255,100,100,0.7)',
            marginTop: '8px'
          }}
        >
          Выберите хотя бы одну пару
        </div>
      )}
    </div>
  );
}
