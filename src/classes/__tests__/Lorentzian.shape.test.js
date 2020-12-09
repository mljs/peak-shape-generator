import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { Lorentzian } from '../Lorentzian';

expect.extend({ toBeDeepCloseTo });

describe('lorentzian', () => {
  it('default factor area', () => {
    let lorentzian = new Lorentzian({});
    let data = lorentzian.shape();
    expect(data.length).toHaveLength(3183099);
    let area = data.reduce((a, b) => a + b, 0);
    expect(area).toBeDeepCloseTo(0.9999, 5);
  });
  it('default factor', () => {
    let lorentzian = new Lorentzian({ fwhm: 10, height: 1 });
    let data = lorentzian.shape();
    expect(data).toHaveLength(63663);
    const center = (data.length - 1) / 2;
    expect(data[center]).toBe(1);
    let area = data.reduce((a, b) => a + b, 0);
    expect(area).toBeDeepCloseTo((0.9999 * Math.PI * 10) / 2, 3);
  });
  it('fwhm 10, factor 500', () => {
    let lorentzian = new Lorentzian({ fwhm: 10 });
    let data = lorentzian.shape({ length: 5000 });
    expect(data).toHaveLength(5000);
    let area = data.reduce((a, b) => a + b, 0);
    expect(area).toBeDeepCloseTo(1, 2);
  });
  it('odd fwhm', () => {
    let lorentzian = new Lorentzian({ fwhm: 11, height: 2 });
    let data = lorentzian.shape({ length: 11 });
    let lenG = data.length;
    let center = parseInt((lenG - 1) / 2, 10);
    expect(data[center]).toBeDeepCloseTo(2, 4);
    expect(data[center - 1]).toBeDeepCloseTo(data[center + 1], 4);
    expect(data[center]).toBeGreaterThan(data[center + 1]);
  });
  it('even fwhm', () => {
    let lorentzian = new Lorentzian({ fwhm: 10, height: 1 });
    let data = lorentzian.shape({ length: 10 });
    let lenG = data.length;
    let center = parseInt((lenG - 1) / 2, 10);
    expect(data[center]).toBeDeepCloseTo(data[center + 1], 4);
    expect(data[0]).toBeDeepCloseTo(data[data.length - 1], 4);
  });
});
