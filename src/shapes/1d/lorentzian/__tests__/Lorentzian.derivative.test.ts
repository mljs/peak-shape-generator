import { expect, test } from 'vitest';

import {
  Lorentzian,
  lorentzianDerivative,
  lorentzianFct,
} from '../Lorentzian.ts';

const fwhm = 0.3;
const h = 1e-6;

test('lorentzianDerivative matches numerical derivatives', () => {
  for (const x of [-0.4, -0.1, 0, 0.05, 0.25]) {
    const { fct, dx, dFwhm } = lorentzianDerivative(x, fwhm);

    expect(fct).toBeCloseTo(lorentzianFct(x, fwhm), 12);

    const numericalDx =
      (lorentzianFct(x + h, fwhm) - lorentzianFct(x - h, fwhm)) / (2 * h);

    expect(dx).toBeCloseTo(numericalDx, 6);

    const numericalDFwhm =
      (lorentzianFct(x, fwhm + h) - lorentzianFct(x, fwhm - h)) / (2 * h);

    expect(dFwhm).toBeCloseTo(numericalDFwhm, 6);
  }
});

test('Lorentzian.derivative returns parameters in getParameters() order', () => {
  const lorentzian = new Lorentzian({ fwhm });
  const { fct, dx, parameters } = lorentzian.derivative(0.05);
  const expected = lorentzianDerivative(0.05, fwhm);

  expect(lorentzian.getParameters()).toStrictEqual(['fwhm']);
  expect(fct).toBeCloseTo(expected.fct, 12);
  expect(dx).toBeCloseTo(expected.dx, 12);
  expect(parameters).toHaveLength(1);
  expect(parameters[0]).toBeCloseTo(expected.dFwhm, 12);
});
