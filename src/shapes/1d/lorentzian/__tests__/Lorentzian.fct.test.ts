import { Lorentzian } from '../Lorentzian';

describe('Lorentzian function', () => {
  it('Lorentzian.fct', () => {
    expect(Lorentzian.fct(0, 0.2)).toBeCloseTo(1);
    expect(Lorentzian.fct(0.1, 0.2)).toBeCloseTo(0.5);
  });
});
