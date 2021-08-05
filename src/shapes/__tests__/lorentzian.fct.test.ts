import * as lorentzian from '../lorentzian';

describe('Lorentzian function', () => {
  it('Lorentzian.fct', () => {
    expect(lorentzian.fct(0.2, 0)).toBeCloseTo(1);
    expect(lorentzian.fct(0.2, 0.1)).toBeCloseTo(0.5);
  });

  it('curry', () => {
    let fct = lorentzian.curry({ fwhm: 50 });
    expect(lorentzian.fct(50, 1)).toBe(fct(1));
  });
});
