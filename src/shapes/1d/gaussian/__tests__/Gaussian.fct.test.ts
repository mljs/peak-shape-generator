import { Gaussian, getGaussianFactor } from '../Gaussian';

describe('Gaussian function', () => {
  it('Gaussian.fct', () => {
    const gaussian = new Gaussian({ fwhm: 0.2 });
    expect(gaussian.fct(0)).toBeCloseTo(1);
    expect(gaussian.fct(0.1)).toBeCloseTo(0.5);
  });

  it('new Gaussian() gaussian.fct', () => {
    const gaussian = new Gaussian({ fwhm: 0.2 });
    expect(gaussian.fct(0)).toBeCloseTo(1);
    expect(gaussian.fct(0.1)).toBeCloseTo(0.5);
  });

  it('Guassian functions', () => {
    expect(getGaussianFactor()).toBeCloseTo(3.8833175701198104);
  });
});
