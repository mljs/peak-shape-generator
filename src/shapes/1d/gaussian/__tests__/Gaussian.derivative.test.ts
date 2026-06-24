import { expect, test } from 'vitest';

import { Gaussian, gaussianDerivative, gaussianFct } from '../Gaussian.ts';

const fwhm = 0.3;
const h = 1e-6;

test('gaussianDerivative matches numerical derivatives', () => {
  for (const x of [-0.4, -0.1, 0, 0.05, 0.25]) {
    const { fct, dx, dFwhm } = gaussianDerivative(x, fwhm);

    expect(fct).toBeCloseTo(gaussianFct(x, fwhm), 12);

    const numericalDx =
      (gaussianFct(x + h, fwhm) - gaussianFct(x - h, fwhm)) / (2 * h);

    expect(dx).toBeCloseTo(numericalDx, 6);

    const numericalDFwhm =
      (gaussianFct(x, fwhm + h) - gaussianFct(x, fwhm - h)) / (2 * h);

    expect(dFwhm).toBeCloseTo(numericalDFwhm, 6);
  }
});

test('Gaussian.derivative returns parameters in getParameters() order', () => {
  const gaussian = new Gaussian({ fwhm });
  const { fct, dx, parameters } = gaussian.derivative(0.05);
  const expected = gaussianDerivative(0.05, fwhm);

  expect(gaussian.getParameters()).toStrictEqual(['fwhm']);
  expect(fct).toBeCloseTo(expected.fct, 12);
  expect(dx).toBeCloseTo(expected.dx, 12);
  expect(parameters).toHaveLength(1);
  expect(parameters[0]).toBeCloseTo(expected.dFwhm, 12);
});
