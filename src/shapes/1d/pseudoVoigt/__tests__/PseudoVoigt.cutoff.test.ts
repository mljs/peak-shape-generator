import { expect, test } from 'vitest';

import { GAUSSIAN_EXP_FACTOR } from '../../../../util/constants.ts';
import { gaussianFct } from '../../gaussian/Gaussian.ts';
import { lorentzianFct } from '../../lorentzian/Lorentzian.ts';
import { pseudoVoigtDerivative, pseudoVoigtFct } from '../PseudoVoigt.ts';

/**
 * The shape with its gaussian half always evaluated, which is what the guarded
 * implementation has to agree with.
 * @param x - distance from the centre.
 * @param fwhm - full width at half maximum.
 * @param mu - ratio of gaussian contribution.
 * @returns the value of the shape.
 */
function unguarded(x: number, fwhm: number, mu: number): number {
  return (
    (1 - mu) * lorentzianFct(x, fwhm) +
    mu * Math.exp(GAUSSIAN_EXP_FACTOR * (x / fwhm) ** 2)
  );
}

const MU_VALUES = [0, 0.1, 0.25, 0.5, 0.75, 0.9, 0.99, 1];

test('dropping the underflowed gaussian half is below double precision', () => {
  const fwhm = 0.3;
  let largest = 0;
  for (const mu of MU_VALUES) {
    for (let z = 0; z <= 60; z += 0.01) {
      const x = z * fwhm;
      const difference = Math.abs(
        pseudoVoigtFct(x, fwhm, mu) - unguarded(x, fwhm, mu),
      );
      if (difference > largest) largest = difference;
    }
  }

  // the shape is one at its centre, so this is a relative bound too
  expect(largest).toBeLessThan(1.5e-17);
});

test('the shape is unchanged where the gaussian half still matters', () => {
  const fwhm = 0.3;
  for (const mu of MU_VALUES) {
    for (let z = 0; z <= 3.7; z += 0.01) {
      const x = z * fwhm;

      expect(pseudoVoigtFct(x, fwhm, mu)).toBe(unguarded(x, fwhm, mu));
    }
  }
});

test('the cutoff is symmetric', () => {
  const fwhm = 0.3;
  for (const mu of MU_VALUES) {
    for (const z of [3.6, 3.75, 4, 10, 50]) {
      expect(pseudoVoigtFct(z * fwhm, fwhm, mu)).toBe(
        pseudoVoigtFct(-z * fwhm, fwhm, mu),
      );
    }
  }
});

test('the derivative agrees with the shape past the cutoff', () => {
  const fwhm = 0.3;
  for (const mu of MU_VALUES) {
    for (const z of [3.8, 5, 20, 100]) {
      const x = z * fwhm;
      const { fct, dMu } = pseudoVoigtDerivative(x, fwhm, mu);
      // with no gaussian left, trading lorentzian for gaussian costs -lorentz;
      // the pure gaussian is exempt from the cutoff, so its half is still there
      const expectedDMu =
        (mu === 1 ? gaussianFct(x, fwhm) : 0) - lorentzianFct(x, fwhm);

      expect(fct).toBe(pseudoVoigtFct(x, fwhm, mu));
      expect(dMu).toBe(expectedDMu);
    }
  }
});

test('the derivative still matches finite differences past the cutoff', () => {
  const fwhm = 0.3;
  const mu = 0.4;
  const h = 1e-6;
  for (const z of [4, 6, 12]) {
    const x = z * fwhm;
    const { dx, dFwhm } = pseudoVoigtDerivative(x, fwhm, mu);
    const numericalDx =
      (pseudoVoigtFct(x + h, fwhm, mu) - pseudoVoigtFct(x - h, fwhm, mu)) /
      (2 * h);
    const numericalDFwhm =
      (pseudoVoigtFct(x, fwhm + h, mu) - pseudoVoigtFct(x, fwhm - h, mu)) /
      (2 * h);

    expect(dx).toBeCloseTo(numericalDx, 10);
    expect(dFwhm).toBeCloseTo(numericalDFwhm, 10);
  }
});

test('a pure gaussian is never cut off', () => {
  const fwhm = 0.3;
  for (const z of [0, 1, 3.7, 3.8, 5, 20]) {
    const x = z * fwhm;

    expect(pseudoVoigtFct(x, fwhm, 1)).toBe(gaussianFct(x, fwhm));
  }

  // it is the only mixing at which the tail survives past the cutoff
  expect(pseudoVoigtFct(5 * fwhm, fwhm, 1)).toBeGreaterThan(0);
  expect(pseudoVoigtFct(5 * fwhm, fwhm, 0.99)).toBe(
    (1 - 0.99) * lorentzianFct(5 * fwhm, fwhm),
  );
});
