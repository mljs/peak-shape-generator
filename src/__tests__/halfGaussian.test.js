import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { halfGaussian } from '..';

expect.extend({ toBeDeepCloseTo });

describe('Normalization', () => {
  it('halfGaussian fwhm fixed', () => {
    let vector = halfGaussian({ fwhm: 500 });
    let area = vector.reduce((a, b) => a + b, 0);
    expect(area).toBeDeepCloseTo(0.5, 2);
    expect(vector[vector.length - 1]).toBeLessThan(vector[0], 2);
  });
  it('halfGaussian sd fixed, ascending', () => {
    let vector = halfGaussian({ sd: 250, ascending: true });
    let area = vector.reduce((a, b) => a + b, 0);
    expect(area).toBeDeepCloseTo(0.5, 2);
    expect(vector[0]).toBeLessThan(vector[vector.length - 1], 2);
  });
});
