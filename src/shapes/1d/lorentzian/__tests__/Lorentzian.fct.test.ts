import { Lorentzian } from '../Lorentzian';

describe('Lorentzian function', () => {
  it('Lorentzian.fct', () => {
    const lorentzian = new Lorentzian({ fwhm: 0.2 });
    expect(lorentzian.fct(0)).toBeCloseTo(1);
    expect(lorentzian.fct(0.1)).toBeCloseTo(0.5);
  });
});
