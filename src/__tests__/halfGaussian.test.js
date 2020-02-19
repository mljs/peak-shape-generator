import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { halfGaussian } from '..';

expect.extend({ toBeDeepCloseTo });

describe('Normalization', () => {
  it('halfGaussian FWHM fixed', () => {
    let vector = halfGaussian({ FWHM: 500 });
    let area = vector.reduce((a, b) => a + b, 0);
    expect(area).toBeDeepCloseTo(0.5, 2);
    expect(vector[vector.length - 1]).toBeLessThan(vector[0], 2);
  });
  it('halfGaussian SD fixed, ascending', () => {
    let vector = halfGaussian({ SD: 250, ascending: true });
    let area = vector.reduce((a, b) => a + b, 0);
    expect(area).toBeDeepCloseTo(0.5, 2);
    expect(vector[0]).toBeLessThan(vector[vector.length - 1], 2);
  });
});
