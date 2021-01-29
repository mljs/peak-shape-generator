import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { Gaussian2D } from '../Gaussian2D';

expect.extend({ toBeDeepCloseTo });

describe('Gaussian2D function', () => {
  it('Gaussian2D.fct', () => {
    expect(Gaussian2D.fct(0, 0, 0.2, 0.2)).toBeDeepCloseTo(1);
    expect(Gaussian2D.fct(0.1, 0, 0.2, 0.2)).toBeDeepCloseTo(0.5);
  });

  it('new Gaussian2D() gaussian2D.fct', () => {
    let gaussian2D = new Gaussian2D({ x: { fwhm: 0.2 }, y: { fwhm: 0.4 } });
    expect(gaussian2D.fct(0, 0)).toBeDeepCloseTo(1);
    expect(gaussian2D.fct(0.1, 0)).toBeDeepCloseTo(0.5);
    expect(gaussian2D.fct(0, 0.2)).toBeDeepCloseTo(0.5);
  });
});
