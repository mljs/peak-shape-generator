import { expect, test } from 'vitest';

import {
  SplitGaussian,
  splitGaussianDerivative,
  splitGaussianFct,
} from '../SplitGaussian.ts';

const fwhmLeft = 0.2;
const fwhmRight = 0.4;
const h = 1e-6;

test('splitGaussianDerivative matches numerical derivatives on each side', () => {
  for (const x of [-0.4, -0.1, 0.05, 0.25]) {
    const { fct, dx, dFwhmLeft, dFwhmRight } = splitGaussianDerivative(
      x,
      fwhmLeft,
      fwhmRight,
    );

    expect(fct).toBeCloseTo(splitGaussianFct(x, fwhmLeft, fwhmRight), 12);

    const numericalDx =
      (splitGaussianFct(x + h, fwhmLeft, fwhmRight) -
        splitGaussianFct(x - h, fwhmLeft, fwhmRight)) /
      (2 * h);

    expect(dx).toBeCloseTo(numericalDx, 6);

    const numericalDFwhmLeft =
      (splitGaussianFct(x, fwhmLeft + h, fwhmRight) -
        splitGaussianFct(x, fwhmLeft - h, fwhmRight)) /
      (2 * h);

    expect(dFwhmLeft).toBeCloseTo(numericalDFwhmLeft, 6);

    const numericalDFwhmRight =
      (splitGaussianFct(x, fwhmLeft, fwhmRight + h) -
        splitGaussianFct(x, fwhmLeft, fwhmRight - h)) /
      (2 * h);

    expect(dFwhmRight).toBeCloseTo(numericalDFwhmRight, 6);
  }
});

test('SplitGaussian.derivative returns parameters in getParameters() order', () => {
  const shape = new SplitGaussian({ fwhmLeft, fwhmRight });
  const { fct, dx, parameters } = shape.derivative(0.05);
  const expected = splitGaussianDerivative(0.05, fwhmLeft, fwhmRight);

  expect(shape.getParameters()).toStrictEqual(['fwhmLeft', 'fwhmRight']);
  expect(fct).toBeCloseTo(expected.fct, 12);
  expect(dx).toBeCloseTo(expected.dx, 12);
  expect(parameters).toHaveLength(2);
  expect(parameters[0]).toBeCloseTo(expected.dFwhmLeft, 12);
  expect(parameters[1]).toBeCloseTo(expected.dFwhmRight, 12);
});
