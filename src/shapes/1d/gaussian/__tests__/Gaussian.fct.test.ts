import { expect, test } from 'vitest';

import { Gaussian, getGaussianFactor } from '../Gaussian.ts';

test('Gaussian.fct', () => {
  const gaussian = new Gaussian({ fwhm: 0.2 });

  expect(gaussian.fct(0)).toBeCloseTo(1);
  expect(gaussian.fct(0.1)).toBeCloseTo(0.5);
});

test('new Gaussian() gaussian.fct', () => {
  const gaussian = new Gaussian({ fwhm: 0.2 });

  expect(gaussian.fct(0)).toBeCloseTo(1);
  expect(gaussian.fct(0.1)).toBeCloseTo(0.5);
});

test('Guassian functions', () => {
  expect(getGaussianFactor()).toBeCloseTo(3.8833175701198104);
});
