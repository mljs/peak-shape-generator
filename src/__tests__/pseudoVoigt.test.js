import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { pseudoVoigt } from '..';

expect.extend({ toBeDeepCloseTo });

describe('pseudoVoigt', () => {
  it('factor 50', () => {
    let data = pseudoVoigt({ length: 50 * 1000 }).data;
    let area = data.reduce((a, b) => a + b, 0);
    expect(area).toBeDeepCloseTo(1, 2);
  });
  it('odd fwhm', () => {
    let data = pseudoVoigt({ fwhm: 11, length: 11 }).data;
    let lenG = data.length;
    let center = parseInt((lenG - 1) / 2, 10);
    expect(data[center - 1]).toBeDeepCloseTo(data[center + 1], 4);
    expect(data[center]).toBeGreaterThan(data[center + 1]);
  });
  it('even fwhm', () => {
    let data = pseudoVoigt({ fwhm: 10, length: 10 }).data;
    let lenG = data.length;
    let center = parseInt((lenG - 1) / 2, 10);
    expect(data[center]).toBeDeepCloseTo(data[center + 1], 4);
    expect(data[0]).toBeDeepCloseTo(data[data.length - 1], 4);
  });
});
