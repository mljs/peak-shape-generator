import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { Gaussian } from '../Gaussian';

expect.extend({ toBeDeepCloseTo });

describe('Gaussian function', () => {
  it('Gaussian.fct', () => {
    expect(Gaussian.fct(0, 0.2)).toBeDeepCloseTo(1);
    expect(Gaussian.fct(0.1, 0.2)).toBeDeepCloseTo(0.5);
  });

  it('new Gaussian() gaussian.fct', () => {
    let gaussian = new Gaussian({ fwhm: 0.2 });
    expect(gaussian.fct(0)).toBeDeepCloseTo(1);
    expect(gaussian.fct(0.1)).toBeDeepCloseTo(0.5);
  });
});
