import { expect, test } from 'vitest';

import { gaussianDerivative } from '../../gaussian/Gaussian.ts';
import {
  SplitGaussian,
  splitGaussianDerivative,
  splitGaussianFct,
} from '../SplitGaussian.ts';

const fwhmLow = 0.2;
const fwhmHigh = 0.4;
const h = 1e-6;

test('splitGaussianDerivative matches numerical derivatives on each side', () => {
  for (const x of [-0.4, -0.1, 0.05, 0.25]) {
    const { fct, dx, dFwhmLow, dFwhmHigh } = splitGaussianDerivative(
      x,
      fwhmLow,
      fwhmHigh,
    );

    expect(fct).toBeCloseTo(splitGaussianFct(x, fwhmLow, fwhmHigh), 12);

    const numericalDx =
      (splitGaussianFct(x + h, fwhmLow, fwhmHigh) -
        splitGaussianFct(x - h, fwhmLow, fwhmHigh)) /
      (2 * h);

    expect(dx).toBeCloseTo(numericalDx, 6);

    const numericalDFwhmLow =
      (splitGaussianFct(x, fwhmLow + h, fwhmHigh) -
        splitGaussianFct(x, fwhmLow - h, fwhmHigh)) /
      (2 * h);

    expect(dFwhmLow).toBeCloseTo(numericalDFwhmLow, 6);

    const numericalDFwhmHigh =
      (splitGaussianFct(x, fwhmLow, fwhmHigh + h) -
        splitGaussianFct(x, fwhmLow, fwhmHigh - h)) /
      (2 * h);

    expect(dFwhmHigh).toBeCloseTo(numericalDFwhmHigh, 6);
  }
});

test('each side is the gaussian of its own half', () => {
  const lower = splitGaussianDerivative(-0.1, fwhmLow, fwhmHigh);
  const higher = splitGaussianDerivative(0.1, fwhmLow, fwhmHigh);

  expect(lower.dFwhmLow).toBe(gaussianDerivative(-0.1, fwhmLow).dFwhm);
  expect(lower.dFwhmHigh).toBe(0);
  expect(higher.dFwhmHigh).toBe(gaussianDerivative(0.1, fwhmHigh).dFwhm);
  expect(higher.dFwhmLow).toBe(0);
});

test('the apex is a smooth maximum', () => {
  const { fct, dx, dFwhmLow, dFwhmHigh } = splitGaussianDerivative(
    0,
    fwhmLow,
    fwhmHigh,
  );

  expect(fct).toBe(1);
  expect(dx).toBeCloseTo(0, 12);
  expect(dFwhmLow).toBeCloseTo(0, 12);
  expect(dFwhmHigh).toBeCloseTo(0, 12);
});

test('SplitGaussian.derivative returns parameters in getParameters() order', () => {
  const shape = new SplitGaussian({ fwhmLow, fwhmHigh });
  const { fct, dx, parameters } = shape.derivative(0.05);
  const expected = splitGaussianDerivative(0.05, fwhmLow, fwhmHigh);

  expect(shape.getParameters()).toStrictEqual(['fwhmLow', 'fwhmHigh']);
  expect(fct).toBeCloseTo(expected.fct, 12);
  expect(dx).toBeCloseTo(expected.dx, 12);
  expect(parameters).toHaveLength(2);
  expect(parameters[0]).toBeCloseTo(expected.dFwhmLow, 12);
  expect(parameters[1]).toBeCloseTo(expected.dFwhmHigh, 12);
});
