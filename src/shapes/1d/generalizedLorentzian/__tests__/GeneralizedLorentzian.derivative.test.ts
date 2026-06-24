import { expect, test } from 'vitest';

import {
  GeneralizedLorentzian,
  generalizedLorentzianDerivative,
  generalizedLorentzianFct,
} from '../GeneralizedLorentzian.ts';

const fwhm = 0.3;
const gamma = 0.6;
const h = 1e-6;

test('generalizedLorentzianDerivative matches numerical derivatives', () => {
  for (const x of [-0.4, -0.1, 0, 0.05, 0.25]) {
    const { fct, dx, dFwhm, dGamma } = generalizedLorentzianDerivative(
      x,
      fwhm,
      gamma,
    );

    expect(fct).toBeCloseTo(generalizedLorentzianFct(x, fwhm, gamma), 12);

    const numericalDx =
      (generalizedLorentzianFct(x + h, fwhm, gamma) -
        generalizedLorentzianFct(x - h, fwhm, gamma)) /
      (2 * h);

    expect(dx).toBeCloseTo(numericalDx, 6);

    const numericalDFwhm =
      (generalizedLorentzianFct(x, fwhm + h, gamma) -
        generalizedLorentzianFct(x, fwhm - h, gamma)) /
      (2 * h);

    expect(dFwhm).toBeCloseTo(numericalDFwhm, 6);

    const numericalDGamma =
      (generalizedLorentzianFct(x, fwhm, gamma + h) -
        generalizedLorentzianFct(x, fwhm, gamma - h)) /
      (2 * h);

    expect(dGamma).toBeCloseTo(numericalDGamma, 6);
  }
});

test('GeneralizedLorentzian.derivative returns parameters in getParameters() order', () => {
  const shape = new GeneralizedLorentzian({ fwhm, gamma });
  const { fct, dx, parameters } = shape.derivative(0.05);
  const expected = generalizedLorentzianDerivative(0.05, fwhm, gamma);

  expect(shape.getParameters()).toStrictEqual(['fwhm', 'gamma']);
  expect(fct).toBeCloseTo(expected.fct, 12);
  expect(dx).toBeCloseTo(expected.dx, 12);
  expect(parameters).toHaveLength(2);
  expect(parameters[0]).toBeCloseTo(expected.dFwhm, 12);
  expect(parameters[1]).toBeCloseTo(expected.dGamma, 12);
});
