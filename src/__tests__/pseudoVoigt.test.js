import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { pseudoVoigt } from '../pseudoVoigt';

expect.extend({ toBeDeepCloseTo });

describe('pseudoVoigt', () => {
  it('height of 5', () => {
    let data = pseudoVoigt({ fwhm: 10, height: 5 }).data;
    let center = Math.floor((data.length - 1) / 2);
    expect(data[center]).toBeDeepCloseTo(5, 4);
  });
  it('height of 5, different fwhm', () => {
    let data = pseudoVoigt({ fwhm: { gaussian: 10, lorentzian: 3 }, height: 5 })
      .data;
    let center = Math.floor((data.length - 1) / 2);
    expect(data[center]).toBeDeepCloseTo(5, 4);
  });
  it('area with fix fwhm', () => {
    let data = pseudoVoigt({ fwhm: 50, normalized: true, mu: 0.5 }).data;
    let area = data.reduce((a, b) => a + b, 0);
    expect(area).toBeDeepCloseTo(0.99, 2);
  });
  it('area with different fwhm', () => {
    let data = pseudoVoigt({
      fwhm: { gaussian: 50, lorentzian: 40 },
      normalized: true,
      mu: 0.5,
    }).data;
    let area = data.reduce((a, b) => a + b, 0);
    expect(area).toBeDeepCloseTo(0.99, 2);
  });
  it('odd fwhm', () => {
    let data = pseudoVoigt({ fwhm: 11, length: 11 }).data;
    let center = Math.floor((data.length - 1) / 2);
    expect(data[center]).toBeDeepCloseTo(1, 4);
    expect(data[center - 1]).toBeDeepCloseTo(data[center + 1], 4);
    expect(data[center]).toBeGreaterThan(data[center + 1]);
  });
  it('even fwhm', () => {
    let data = pseudoVoigt({ fwhm: 10, length: 10 }).data;
    let center = Math.floor((data.length - 1) / 2);
    expect(data[center]).toBeDeepCloseTo(data[center + 1], 4);
    expect(data[0]).toBeDeepCloseTo(data[data.length - 1], 4);
  });
});
