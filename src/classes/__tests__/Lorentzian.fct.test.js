import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { Lorentzian } from '../Lorentzian';

expect.extend({ toBeDeepCloseTo });

describe('Lorentzian function', () => {
  it('Lorentzian.fct', () => {
    expect(Lorentzian.fct(0, 0.2)).toBeDeepCloseTo(1);
    expect(Lorentzian.fct(0.1, 0.2)).toBeDeepCloseTo(0.5);
  });

  it('new Lorentzian() lorentzian.fct', () => {
    let lorentzian = new Lorentzian({ fwhm: 0.2 });
    expect(lorentzian.fct(0)).toBeDeepCloseTo(1);
    expect(lorentzian.fct(0.1)).toBeDeepCloseTo(0.5);
  });
});
