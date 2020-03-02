import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { gaussian } from '..';

expect.extend({ toBeDeepCloseTo });

describe('gaussan', () => {
  it('fwhm fixed', () => {
    let vector = gaussian({ fwhm: 5000, length: 15000 });
    expect(vector).toHaveLength(15000);
    let area = vector.reduce((a, b) => a + b, 0);
    expect(area).toBeDeepCloseTo(0.9995, 4);
  });

  it('sd fixed', () => {
    let vector = gaussian({ sd: 2500 });
    let area = vector.reduce((a, b) => a + b, 0);
    expect(area).toBeDeepCloseTo(0.9973, 5);
  });

  it('odd fwhm', () => {
    let vector = gaussian({ fwhm: 101, length: 101 });
    expect(vector).toHaveLength(101);
    let lenG = vector.length;
    let center = parseInt((lenG - 1) / 2, 10);
    expect(vector[center - 1]).toBeDeepCloseTo(vector[center + 1], 4);
    expect(vector[center]).toBeGreaterThan(vector[center + 1]);
  });
  it('even fwhm', () => {
    let vector = gaussian({ fwhm: 100, length: 100 });
    expect(vector).toHaveLength(100);
    let lenG = vector.length;
    let center = parseInt((lenG - 1) / 2, 10);
    expect(vector[center]).toBeDeepCloseTo(vector[center + 1], 4);
    expect(vector[0]).toBeDeepCloseTo(vector[vector.length - 1], 4);
  });
});
