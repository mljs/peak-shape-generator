import { expect, test } from 'vitest';

import {
  PseudoVoigt,
  pseudoVoigtDerivative,
  pseudoVoigtFct,
} from '../PseudoVoigt.ts';

const fwhm = 0.3;
const mu = 0.4;
const h = 1e-6;

test('pseudoVoigtDerivative matches numerical derivatives', () => {
  for (const x of [-0.4, -0.1, 0, 0.05, 0.25]) {
    const { fct, dx, dFwhm, dMu } = pseudoVoigtDerivative(x, fwhm, mu);

    expect(fct).toBeCloseTo(pseudoVoigtFct(x, fwhm, mu), 12);

    const numericalDx =
      (pseudoVoigtFct(x + h, fwhm, mu) - pseudoVoigtFct(x - h, fwhm, mu)) /
      (2 * h);

    expect(dx).toBeCloseTo(numericalDx, 6);

    const numericalDFwhm =
      (pseudoVoigtFct(x, fwhm + h, mu) - pseudoVoigtFct(x, fwhm - h, mu)) /
      (2 * h);

    expect(dFwhm).toBeCloseTo(numericalDFwhm, 6);

    const numericalDMu =
      (pseudoVoigtFct(x, fwhm, mu + h) - pseudoVoigtFct(x, fwhm, mu - h)) /
      (2 * h);

    expect(dMu).toBeCloseTo(numericalDMu, 6);
  }
});

test('PseudoVoigt.derivative returns parameters in getParameters() order', () => {
  const pseudoVoigt = new PseudoVoigt({ fwhm, mu });
  const { fct, dx, parameters } = pseudoVoigt.derivative(0.05);
  const expected = pseudoVoigtDerivative(0.05, fwhm, mu);

  expect(pseudoVoigt.getParameters()).toStrictEqual(['fwhm', 'mu']);
  expect(fct).toBeCloseTo(expected.fct, 12);
  expect(dx).toBeCloseTo(expected.dx, 12);
  expect(parameters).toHaveLength(2);
  expect(parameters[0]).toBeCloseTo(expected.dFwhm, 12);
  expect(parameters[1]).toBeCloseTo(expected.dMu, 12);
});
