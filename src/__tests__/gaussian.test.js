import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { gaussian } from '..';

expect.extend({ toBeDeepCloseTo });

describe('gaussan', () => {
  it('fwhm fixed', () => {
    let shape = gaussian({ fwhm: 5000, length: 15000 });
    expect(shape.fwhm).toBe(5000);
    expect(shape.data).toHaveLength(15000);
    let area = shape.data.reduce((a, b) => a + b, 0);
    expect(area).toBeDeepCloseTo(0.9995, 4);
  });

  it('sd fixed', () => {
    const sd = 2500;
    let data = gaussian({ sd }).data;
    let start = (data.length - sd * 6) / 2;
    let end = data.length - start;
    let area = 0;
    for (let i = start; i < end - 1; i++) {
      area += data[i];
    }
    expect(area).toBeDeepCloseTo(0.9973, 5);
  });

  it('odd fwhm', () => {
    let data = gaussian({ fwhm: 101, length: 101 }).data;
    expect(data).toHaveLength(101);
    let lenG = data.length;
    let center = parseInt((lenG - 1) / 2, 10);
    expect(data[center - 1]).toBeDeepCloseTo(data[center + 1], 4);
    expect(data[center]).toBeGreaterThan(data[center + 1]);
  });
  it('even fwhm', () => {
    let data = gaussian({ fwhm: 100, length: 100 }).data;
    expect(data).toHaveLength(100);
    let lenG = data.length;
    let center = parseInt((lenG - 1) / 2, 10);
    expect(data[center]).toBeDeepCloseTo(data[center + 1], 4);
    expect(data[0]).toBeDeepCloseTo(data[data.length - 1], 4);
  });
});
