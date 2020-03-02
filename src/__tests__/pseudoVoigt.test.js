import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { pseudoVoigt } from '..';

expect.extend({ toBeDeepCloseTo });

describe('pseudoVoigt', () => {
  it('factor 50', () => {
    let vector = pseudoVoigt({ factor: 50 });
    let area = vector.reduce((a, b) => a + b, 0);
    expect(area).toBeDeepCloseTo(1, 2);
  });
  it('odd fwhm', () => {
    let vector = pseudoVoigt({ fwhm: 11, factor: 1 });
    let lenG = vector.length;
    let center = parseInt((lenG - 1) / 2, 10);
    expect(vector[center - 1]).toBeDeepCloseTo(vector[center + 1], 4);
    expect(vector[center]).toBeGreaterThan(vector[center + 1]);
  });
  it('even fwhm', () => {
    let vector = pseudoVoigt({ fwhm: 10, factor: 1 });
    let lenG = vector.length;
    let center = parseInt((lenG - 1) / 2, 10);
    expect(vector[center]).toBeDeepCloseTo(vector[center + 1], 4);
    expect(vector[0]).toBeDeepCloseTo(vector[vector.length - 1], 4);
  });
});
