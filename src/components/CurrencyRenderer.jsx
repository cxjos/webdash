import useMockCurrency from '../hooks/useMockCurrency';

export default function CurrencyRenderer({ config }) {
  const { data } = useMockCurrency();

  const pairs = config?.pairs
    ? data.pairs.filter((p) => config.pairs.includes(`${p.from}/${p.to}`))
    : data.pairs;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '6px 8px',
        overflow: 'hidden',
      }}
    >
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {pairs.map((pair) => {
          const isPositive = pair.change >= 0;
          const changeColor = isPositive
            ? 'rgba(100, 255, 100, 0.6)'
            : 'rgba(255, 100, 100, 0.6)';
          const changeSign = isPositive ? '+' : '';

          return (
            <div
              key={`${pair.from}/${pair.to}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '4px 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                fontSize: 11,
                letterSpacing: '-0.01em',
                lineHeight: 1.2,
              }}
            >
              <span
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  minWidth: 70,
                  flexShrink: 0,
                }}
              >
                {pair.from}/{pair.to}
              </span>
              <span
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  textAlign: 'right',
                  minWidth: 60,
                  flexShrink: 0,
                }}
              >
                {pair.rate.toFixed(2)}
              </span>
              <span
                style={{
                  color: changeColor,
                  textAlign: 'right',
                  minWidth: 50,
                  flexShrink: 0,
                }}
              >
                {changeSign}
                {pair.change.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
