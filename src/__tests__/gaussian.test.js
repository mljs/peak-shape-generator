import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { gaussian } from '..';

expect.extend({ toBeDeepCloseTo });

describe('Normalization', () => {
  it('gaussian FWHM fixed', () => {
    let vector = gaussian({ FWHM: 500 });
    let area = vector.reduce((a, b) => a + b, 0);
    expect(area).toBeDeepCloseTo(1, 2);
  });
  it('gaussian SD fixed', () => {
    let vector = gaussian({ SD: 250 });
    let area = vector.reduce((a, b) => a + b, 0);
    expect(area).toBeDeepCloseTo(1, 2);
  });
});
