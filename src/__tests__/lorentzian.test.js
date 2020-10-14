import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { lorentzian } from '../lorentzian';

expect.extend({ toBeDeepCloseTo });

describe('lorentzian', () => {
  it('fwhm 10, factor 500', () => {
    let shape = lorentzian({ fwhm: 10, length: 5000 });
    let area = shape.data.reduce((a, b) => a + b, 0);
    expect(area).toBeDeepCloseTo(1, 2);
    expect(shape.shapeID).toBe('lorentzian-10-5000');
  });
  it('odd fwhm', () => {
    let shape = lorentzian({ fwhm: 11, length: 11 });
    expect(shape.fwhm).toBe(11);
    let data = shape.data;
    let lenG = data.length;
    let center = parseInt((lenG - 1) / 2, 10);
    expect(data[center - 1]).toBeDeepCloseTo(data[center + 1], 4);
    expect(data[center]).toBeGreaterThan(data[center + 1]);
  });
  it('even fwhm', () => {
    let data = lorentzian({ fwhm: 10, length: 10 }).data;
    let lenG = data.length;
    let center = parseInt((lenG - 1) / 2, 10);
    expect(data[center]).toBeDeepCloseTo(data[center + 1], 4);
    expect(data[0]).toBeDeepCloseTo(data[data.length - 1], 4);
  });
});
