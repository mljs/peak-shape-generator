import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { gaussian } from '..';

expect.extend({ toBeDeepCloseTo });

describe('gaussan', () => {
  it('fwhm fixed', () => {
    let vector = gaussian({ fwhm: 500 });
    expect(vector).toHaveLength(1500);
    let area = vector.reduce((a, b) => a + b, 0);
    expect(area).toBeDeepCloseTo(1, 2);
  });
  it('sd fixed', () => {
    let vector = gaussian({ sd: 250 });
    let area = vector.reduce((a, b) => a + b, 0);
    expect(area).toBeDeepCloseTo(1, 2);
  });
  it('odd fwhm', () => {
    let vector = gaussian({ fwhm: 101, factor: 1 });
    expect(vector).toHaveLength(101);
    let lenG = vector.length;
    let center = parseInt((lenG - 1) / 2, 10);
    expect(vector[center - 1]).toBeDeepCloseTo(vector[center + 1], 4);
    expect(vector[center]).toBeGreaterThan(vector[center + 1]);
  });
  it('even fwhm', () => {
    let vector = gaussian({ fwhm: 100, factor: 1 });
    expect(vector).toHaveLength(100);
    let lenG = vector.length;
    let center = parseInt((lenG - 1) / 2, 10);
    expect(vector[center]).toBeDeepCloseTo(vector[center + 1], 4);
    expect(vector[0]).toBeDeepCloseTo(vector[vector.length - 1], 4);
  });
});
