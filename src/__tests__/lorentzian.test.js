import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { lorentzian } from '..';

expect.extend({ toBeDeepCloseTo });

describe('Normalization', () => {
  it('lorentzian', () => {
    let vector = lorentzian({ fwhm: 10, factor: 500 });
    let area = vector.reduce((a, b) => a + b, 0);
    expect(area).toBeDeepCloseTo(1, 2);
  });
  it('odd fwhm', () => {
    let vector = lorentzian({ fwhm: 11, factor: 1 });
    let lenG = vector.length;
    let center = parseInt((lenG - 1) / 2, 10);
    expect(vector[center - 1]).toBeDeepCloseTo(vector[center + 1], 4);
    expect(vector[center]).toBeGreaterThan(vector[center + 1]);
  });
  it('even fwhm', () => {
    let vector = lorentzian({ fwhm: 10, factor: 1 });
    let lenG = vector.length;
    let center = parseInt((lenG - 1) / 2, 10);
    expect(vector[center]).toBeDeepCloseTo(vector[center + 1], 4);
    expect(vector[0]).toBeDeepCloseTo(vector[vector.length - 1], 4);
  });
});
