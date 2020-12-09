import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { PseudoVoigt } from '../PseudoVoigt';

expect.extend({ toBeDeepCloseTo });

describe('PseudoVoigt', () => {
  it('height of 5', () => {
    let data = new PseudoVoigt({ fwhm: 10, height: 5 }).shape();
    let center = Math.floor((data.length - 1) / 2);
    expect(data[center]).toBeDeepCloseTo(5, 4);
  });
  it('area with fix fwhm', () => {
    let data = new PseudoVoigt({ fwhm: 50, mu: 0.5 }).shape();
    let area = data.reduce((a, b) => a + b, 0);
    expect(area).toBeDeepCloseTo(0.99, 2);
  });
  it('odd fwhm', () => {
    let data = new PseudoVoigt({ fwhm: 11, height: 1 }).shape({ length: 11 });
    let center = Math.floor((data.length - 1) / 2);
    expect(data[center]).toBeDeepCloseTo(1, 4);
    expect(data[center - 1]).toBeDeepCloseTo(data[center + 1], 4);
    expect(data[center]).toBeGreaterThan(data[center + 1]);
  });
  it('even fwhm', () => {
    let data = new PseudoVoigt({ fwhm: 10 }).shape({ length: 10 });
    let center = Math.floor((data.length - 1) / 2);
    expect(data[center]).toBeDeepCloseTo(data[center + 1], 4);
    expect(data[0]).toBeDeepCloseTo(data[data.length - 1], 4);
  });
});
