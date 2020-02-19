import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { halfLorentzian } from '..';

expect.extend({ toBeDeepCloseTo });

describe('Normalization', () => {
  it('half lorentzian', () => {
    let vector = halfLorentzian({ factor: 500 });
    let area = vector.reduce((a, b) => a + b, 0);
    expect(area).toBeDeepCloseTo(0.5, 2);
    expect(vector[vector.length - 1]).toBeLessThan(vector[0], 2);
  });
  it('half lorentzian, ascending', () => {
    let vector = halfLorentzian({ factor: 500, ascending: true });
    let area = vector.reduce((a, b) => a + b, 0);
    expect(area).toBeDeepCloseTo(0.5, 2);
    expect(vector[0]).toBeLessThan(vector[vector.length - 1], 2);
  });
});
