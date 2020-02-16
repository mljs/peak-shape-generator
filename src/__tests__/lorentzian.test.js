import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { lorentzian } from '..';

expect.extend({ toBeDeepCloseTo });

describe('Normalization', () => {
  it('lorentzian', () => {
    let vector = lorentzian({ factor: 500 });
    let area = vector.reduce((a, b) => a + b, 0);
    expect(area).toBeDeepCloseTo(1, 2);
  });
});
