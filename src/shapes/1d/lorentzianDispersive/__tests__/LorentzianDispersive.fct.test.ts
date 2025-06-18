import { LorentzianDispersive } from '../LorentzianDispersive';

describe('Lorentzian function', () => {
  it('Lorentzian.fct', () => {
    const lorentzian = new LorentzianDispersive({ fwhm: 0.2 });
    expect(lorentzian.fct(0)).toBeCloseTo(0);
    expect(lorentzian.fct(0.1)).toBeCloseTo(0.5);
    expect(lorentzian.fct(-0.1)).toBeCloseTo(-0.5);
  });
});
