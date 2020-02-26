import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { gaussian } from '..';

expect.extend({ toBeDeepCloseTo });

describe('Normalization', () => {
  it('gaussian fwhm fixed', () => {
    let vector = gaussian({ fwhm: 500 });
    let area = vector.reduce((a, b) => a + b, 0);
    expect(area).toBeDeepCloseTo(1, 2);
  });
  it('gaussian sd fixed', () => {
    let vector = gaussian({ sd: 250 });
    let area = vector.reduce((a, b) => a + b, 0);
    expect(area).toBeDeepCloseTo(1, 2);
  });
});
