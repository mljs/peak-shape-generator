import { Lorentzian, getLorentzianFactor } from '../Lorentzian';

describe('Lorentzian function', () => {
  it('Lorentzian.fct', () => {
    const lorentzian = new Lorentzian({ fwhm: 0.2 });
    expect(lorentzian.fct(0)).toBeCloseTo(1);
    expect(lorentzian.fct(0.1)).toBeCloseTo(0.5);
  });

  it('Lorentzian functions', () => {
    expect(getLorentzianFactor(0.9)).toBeLessThan(5);
    expect(getLorentzianFactor(0.99)).toBeLessThan(77);
  });
});
