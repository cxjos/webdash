/**
 * useMockWeather — returns realistic mock weather data for a given city.
 * Signature matches future real API hook for drop-in replacement.
 *
 * @param {string} city — city name (accepted for API compatibility, ignored for mock data)
 * @returns {{ data: { city: string, daily: Array<{date: string, temp: number, tempMin: number, tempMax: number}> }, loading: false, error: null }}
 */
function useMockWeather(city = 'Москва') {
  const today = new Date();
  const daily = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    // Plausible Moscow temperatures: -5°C to 25°C
    const temp = Math.round((Math.random() * 30 - 5) * 10) / 10;
    const tempMin = Math.round((temp - Math.random() * 5 - 1) * 10) / 10;
    const tempMax = Math.round((temp + Math.random() * 5 + 1) * 10) / 10;

    daily.push({
      date: date.toISOString().split('T')[0],
      temp,
      tempMin,
      tempMax,
    });
  }

  return {
    data: { city, daily },
    loading: false,
    error: null,
  };
}

export default useMockWeather;
