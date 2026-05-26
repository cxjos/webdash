import { describe, it, expect } from 'vitest';
import useMockWeather from '../hooks/useMockWeather.js';
import useMockCurrency from '../hooks/useMockCurrency.js';
import useMockTime from '../hooks/useMockTime.js';

describe('mock data hooks', () => {
  it('useMockWeather returns 7 days of data', () => {
    const result = useMockWeather('Москва');
    expect(result.data.daily).toHaveLength(7);
    expect(result.data.daily[0]).toHaveProperty('date');
    expect(result.data.daily[0]).toHaveProperty('temp');
    expect(result.loading).toBe(false);
    expect(result.error).toBeNull();
  });

  it('useMockCurrency returns 5 pairs', () => {
    const result = useMockCurrency();
    expect(result.data.pairs).toHaveLength(5);
    expect(result.data.pairs[0]).toHaveProperty('from');
    expect(result.data.pairs[0]).toHaveProperty('to');
    expect(result.data.pairs[0]).toHaveProperty('rate');
    expect(result.data.pairs[0]).toHaveProperty('change');
    expect(result.loading).toBe(false);
    expect(result.error).toBeNull();
  });

  it('useMockTime returns timezone data', () => {
    const result = useMockTime(['Europe/Moscow']);
    expect(result.data.zones).toHaveLength(1);
    expect(result.data.zones[0]).toHaveProperty('id');
    expect(result.data.zones[0]).toHaveProperty('name');
    expect(result.data.zones[0]).toHaveProperty('offset');
    expect(result.loading).toBe(false);
    expect(result.error).toBeNull();
  });
});
