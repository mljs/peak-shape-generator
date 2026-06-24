import { expect, test } from 'vitest';

import {
  LorentzianDispersive,
  lorentzianDispersiveDerivative,
  lorentzianDispersiveFct,
} from '../LorentzianDispersive.ts';

const fwhm = 0.3;
const h = 1e-6;

test('lorentzianDispersiveDerivative matches numerical derivatives', () => {
  for (const x of [-0.4, -0.1, 0, 0.05, 0.25]) {
    const { fct, dx, dFwhm } = lorentzianDispersiveDerivative(x, fwhm);

    expect(fct).toBeCloseTo(lorentzianDispersiveFct(x, fwhm), 12);

    const numericalDx =
      (lorentzianDispersiveFct(x + h, fwhm) -
        lorentzianDispersiveFct(x - h, fwhm)) /
      (2 * h);

    expect(dx).toBeCloseTo(numericalDx, 6);

    const numericalDFwhm =
      (lorentzianDispersiveFct(x, fwhm + h) -
        lorentzianDispersiveFct(x, fwhm - h)) /
      (2 * h);

    expect(dFwhm).toBeCloseTo(numericalDFwhm, 6);
  }
});

test('LorentzianDispersive.derivative returns parameters in getParameters() order', () => {
  const shape = new LorentzianDispersive({ fwhm });
  const { fct, dx, parameters } = shape.derivative(0.05);
  const expected = lorentzianDispersiveDerivative(0.05, fwhm);

  expect(shape.getParameters()).toStrictEqual(['fwhm']);
  expect(fct).toBeCloseTo(expected.fct, 12);
  expect(dx).toBeCloseTo(expected.dx, 12);
  expect(parameters).toHaveLength(1);
  expect(parameters[0]).toBeCloseTo(expected.dFwhm, 12);
});
