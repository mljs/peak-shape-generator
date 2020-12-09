import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { Lorentzian } from '../Lorentzian';

expect.extend({ toBeDeepCloseTo });

describe('Lorentzian.fct', () => {
  const lorentzianFct = new Lorentzian().fct;
  it('unit test', () => {
    expect(lorentzianFct(0, 2, 0.2, 0)).toBeDeepCloseTo(2, 2);
    expect(lorentzianFct(0, 2, 0.2, 0.1)).toBeDeepCloseTo(1, 2);
    expect(lorentzianFct(0, 2, 0.2, 0.1)).toBeDeepCloseTo(
      lorentzianFct(0, 2, 0.2, -0.1),
      2,
    );
  });
});
