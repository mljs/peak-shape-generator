import { expect, test } from 'vitest';

import { Pap, papDerivative, papFct } from '../Pap.ts';

const fwhm = 0.3;
const a = 1;
const h = 1e-6;

test('papDerivative matches numerical derivatives', () => {
  for (const x of [-0.4, -0.1, 0, 0.05, 0.25, 0.6]) {
    const { fct, dx, dD, da } = papDerivative(x, fwhm, a);

    expect(fct).toBeCloseTo(papFct(x, fwhm, a), 12);

    const numericalDx =
      (papFct(x + h, fwhm, a) - papFct(x - h, fwhm, a)) / (2 * h);

    expect(dx).toBeCloseTo(numericalDx, 6);

    const numericalDD =
      (papFct(x, fwhm + h, a) - papFct(x, fwhm - h, a)) / (2 * h);

    expect(dD).toBeCloseTo(numericalDD, 6);

    const numericalDa =
      (papFct(x, fwhm, a + h) - papFct(x, fwhm, a - h)) / (2 * h);

    expect(da).toBeCloseTo(numericalDa, 6);
  }
});

test('papDerivative is zero below the support threshold', () => {
  const threshold = (-fwhm * (4 - a * a)) / (2 * a);
  const { fct, dx, dD, da } = papDerivative(threshold - 0.1, fwhm, a);

  expect(fct).toBe(0);
  expect(dx).toBe(0);
  expect(dD).toBe(0);
  expect(da).toBe(0);
});

test('Pap.derivative returns parameters in getParameters() order', () => {
  const pap = new Pap({ fwhm, a });
  const { fct, dx, parameters } = pap.derivative(0.05);
  const expected = papDerivative(0.05, fwhm, a);

  expect(pap.getParameters()).toStrictEqual(['fwhm', 'a']);
  expect(fct).toBeCloseTo(expected.fct, 12);
  expect(dx).toBeCloseTo(expected.dx, 12);
  expect(parameters).toHaveLength(2);
  expect(parameters[0]).toBeCloseTo(expected.dD, 12);
  expect(parameters[1]).toBeCloseTo(expected.da, 12);
});
