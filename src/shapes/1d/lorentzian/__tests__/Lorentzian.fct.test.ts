import * as lorentzian from '../Lorentzian';

describe('Lorentzian function', () => {
  it('Lorentzian.fct', () => {
    expect(lorentzian.fct(0, 0.2)).toBeCloseTo(1);
    expect(lorentzian.fct(0.1, 0.2)).toBeCloseTo(0.5);
  });
});
