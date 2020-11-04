import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { lorentzianFct } from '../lorentzianFct';

expect.extend({ toBeDeepCloseTo });

describe('lorentzianFct', () => {
  it('unit test', () => {
    expect(lorentzianFct(0, 2, 0.2, 0)).toBeDeepCloseTo(2, 2);
    expect(lorentzianFct(0, 2, 0.2, 0.1)).toBeDeepCloseTo(1, 2);
    expect(lorentzianFct(0, 2, 0.2, 0.1)).toBeDeepCloseTo(
      lorentzianFct(0, 2, 0.2, -0.1),
      2,
    );
  });
});
