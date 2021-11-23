import { Gaussian2D } from '../Gaussian2D';

describe('Gaussian2D function', () => {
  it('gaussian2D.fct', () => {
    const gaussian2D = new Gaussian2D({ fwhm: { x: 0.2, y: 0.4 } });
    expect(gaussian2D.fct(0, 0)).toBeCloseTo(1);
    expect(gaussian2D.fct(0.1, 0)).toBeCloseTo(0.5);
    expect(gaussian2D.fct(0, 0.2)).toBeCloseTo(0.5);
  });
});
