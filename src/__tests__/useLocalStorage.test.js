import { describe, it, expect } from 'vitest';

describe('useLocalStorage', () => {
  it('hook file exists and exports default', async () => {
    const module = await import('../hooks/useLocalStorage.js');
    expect(module.default).toBeDefined();
    expect(typeof module.default).toBe('function');
  });
});
