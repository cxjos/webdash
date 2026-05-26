/**
 * useMockCurrency — returns realistic mock currency exchange rates.
 * Signature matches future real API hook for drop-in replacement.
 *
 * @returns {{ data: { pairs: Array<{from: string, to: string, rate: number, change: number}> }, loading: false, error: null }}
 */
function useMockCurrency() {
  const baseRates = {
    'USD/RUB': 90.5,
    'EUR/RUB': 95.2,
    'CNY/RUB': 12.3,
    'GBP/RUB': 112.8,
    'JPY/RUB': 0.58,
  };

  const pairs = Object.entries(baseRates).map(([pair, baseRate]) => {
    const [from, to] = pair.split('/');
    // Random fluctuation within ±2%
    const fluctuation = (Math.random() * 4 - 2); // -2% to +2%
    const rate = Math.round(baseRate * (1 + fluctuation / 100) * 100) / 100;
    const change = Math.round(fluctuation * 10) / 10;

    return { from, to, rate, change };
  });

  return {
    data: { pairs },
    loading: false,
    error: null,
  };
}

export default useMockCurrency;
