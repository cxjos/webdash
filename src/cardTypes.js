/**
 * Card type registry — defines display labels, icons, minimum sizes,
 * and default configurations for each card type.
 * Pure data module, no UI, no React.
 */

export const CARD_TYPES = {
  weather: {
    id: 'weather',
    label: 'Погода',
    icon: '⛅',
    minCols: 4,
    minRows: 2,
    defaultConfig: {
      city: 'Москва',
    },
  },
  currency: {
    id: 'currency',
    label: 'Курсы валют',
    icon: '💱',
    minCols: 3,
    minRows: 2,
    defaultConfig: {
      pairs: ['USD/RUB', 'EUR/RUB', 'CNY/RUB'],
    },
  },
  time: {
    id: 'time',
    label: 'Время',
    icon: '🕐',
    minCols: 3,
    minRows: 2,
    defaultConfig: {
      zones: ['Europe/Moscow'],
    },
  },
};

/**
 * Returns the type definition for a given typeId, or null if not found.
 * @param {string} typeId
 * @returns {object|null}
 */
export function getCardType(typeId) {
  return CARD_TYPES[typeId] ?? null;
}

/**
 * Returns a deep copy of the default config for a given typeId,
 * or an empty object if the type is not found.
 * @param {string} typeId
 * @returns {object}
 */
export function getDefaultConfig(typeId) {
  const type = CARD_TYPES[typeId];
  if (!type) return {};
  return JSON.parse(JSON.stringify(type.defaultConfig));
}