import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { halfPseudoVoigt } from '..';

expect.extend({ toBeDeepCloseTo });

describe('Normalization', () => {
  it('half lorentzian', () => {
    let vector = halfPseudoVoigt({ factor: 50 });
    let area = vector.reduce((a, b) => a + b, 0);
    expect(area).toBeDeepCloseTo(0.5, 2);
    expect(vector[vector.length - 1]).toBeLessThan(vector[0], 2);
  });
  it('half lorentzian, ascending', () => {
    let vector = halfPseudoVoigt({ factor: 50, ascending: true });
    let area = vector.reduce((a, b) => a + b, 0);
    expect(area).toBeDeepCloseTo(0.5, 2);
    expect(vector[0]).toBeLessThan(vector[vector.length - 1], 2);
  });
});
