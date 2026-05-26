import { describe, it, expect } from 'vitest';
import { CARD_TYPES, getCardType, getDefaultConfig } from '../cardTypes.js';

describe('cardTypes', () => {
  it('has 3 types', () => {
    expect(Object.keys(CARD_TYPES)).toHaveLength(3);
  });

  it('each type has required fields', () => {
    Object.values(CARD_TYPES).forEach((type) => {
      expect(type).toHaveProperty('id');
      expect(type).toHaveProperty('label');
      expect(type).toHaveProperty('icon');
      expect(type).toHaveProperty('minCols');
      expect(type).toHaveProperty('minRows');
      expect(type).toHaveProperty('defaultConfig');
    });
  });

  it('getCardType returns correct type', () => {
    expect(getCardType('weather').label).toBe('Погода');
    expect(getCardType('nonexistent')).toBeNull();
  });

  it('getDefaultConfig returns deep copy', () => {
    const config1 = getDefaultConfig('weather');
    const config2 = getDefaultConfig('weather');
    expect(config1).toEqual(config2);
    expect(config1).not.toBe(config2); // different object reference
  });
});
