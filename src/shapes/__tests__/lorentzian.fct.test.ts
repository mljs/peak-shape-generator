import * as lorentzian from '../lorentzian';

describe('Lorentzian function', () => {
  it('Lorentzian.fct', () => {
    expect(lorentzian.fct(0.2, 0)).toBeCloseTo(1);
    expect(lorentzian.fct(0.2, 0.1)).toBeCloseTo(0.5);
  });
});
