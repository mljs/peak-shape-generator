import { Gaussian, fct as gaussianFct } from '../Gaussian';

describe('Gaussian function', () => {
  it('Gaussian.fct', () => {
    expect(gaussianFct(0, 0.2)).toBeCloseTo(1);
    expect(gaussianFct(0.1, 0.2)).toBeCloseTo(0.5);
  });

  it('new Gaussian() gaussian.fct', () => {
    let gaussian = new Gaussian({ fwhm: 0.2 });
    expect(gaussian.fct(0)).toBeCloseTo(1);
    expect(gaussian.fct(0.1)).toBeCloseTo(0.5);
  });
});
