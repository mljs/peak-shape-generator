import { Gaussian } from '../Gaussian';

describe('Gaussian function', () => {
  it('Gaussian.fct', () => {
    const gaussian = new Gaussian({fwhm: 0.2});
    expect(gaussian.fct(0)).toBeCloseTo(1);
    expect(gaussian.fct(0.1)).toBeCloseTo(0.5);
  });

  it('new Gaussian() gaussian.fct', () => {
    const gaussian = new Gaussian({ fwhm: 0.2 });
    expect(gaussian.fct(0)).toBeCloseTo(1);
    expect(gaussian.fct(0.1)).toBeCloseTo(0.5);
  });
});
