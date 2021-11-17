import { Gaussian } from '../Gaussian';

describe('Gaussian function', () => {
  it('Gaussian.fct', () => {
    expect(Gaussian.fct(0, 0.2)).toBeCloseTo(1);
    expect(Gaussian.fct(0.1, 0.2)).toBeCloseTo(0.5);
  });

  it('new Gaussian() gaussian.fct', () => {
    const gaussian = new Gaussian({ fwhm: 0.2 });
    expect(gaussian.fct(0)).toBeCloseTo(1);
    expect(gaussian.fct(0.1)).toBeCloseTo(0.5);
  });
});
