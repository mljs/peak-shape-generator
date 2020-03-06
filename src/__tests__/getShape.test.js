import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { getShape, GAUSSIAN } from '..';

expect.extend({ toBeDeepCloseTo });

describe('getShape', () => {
  it('fwhm fixed', () => {
    let shape = getShape(GAUSSIAN, { fwhm: 500 });
    expect(shape.fwhm).toBe(500);
    let area = shape.data.reduce((a, b) => a + b, 0);
    expect(area).toBeDeepCloseTo(1, 2);
  });
});
