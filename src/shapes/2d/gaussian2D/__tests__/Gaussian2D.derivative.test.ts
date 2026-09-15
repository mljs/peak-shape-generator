import { expect, test } from 'vitest';

import {
  Gaussian2D,
  gaussian2DDerivative,
  gaussian2DFct,
} from '../Gaussian2D.ts';

const xFWHM = 0.3;
const yFWHM = 0.4;
const h = 1e-6;

test('gaussian2DDerivative matches numerical derivatives', () => {
  for (const [x, y] of [
    [-0.4, 0.2],
    [-0.1, -0.3],
    [0, 0],
    [0.05, 0.1],
    [0.25, -0.2],
  ]) {
    const { fct, dx, dy, dFwhmX, dFwhmY } = gaussian2DDerivative(
      x,
      y,
      xFWHM,
      yFWHM,
    );

    expect(fct).toBeCloseTo(gaussian2DFct(x, y, xFWHM, yFWHM), 12);

    const numericalDx =
      (gaussian2DFct(x + h, y, xFWHM, yFWHM) -
        gaussian2DFct(x - h, y, xFWHM, yFWHM)) /
      (2 * h);
    const numericalDy =
      (gaussian2DFct(x, y + h, xFWHM, yFWHM) -
        gaussian2DFct(x, y - h, xFWHM, yFWHM)) /
      (2 * h);
    const numericalDFwhmX =
      (gaussian2DFct(x, y, xFWHM + h, yFWHM) -
        gaussian2DFct(x, y, xFWHM - h, yFWHM)) /
      (2 * h);
    const numericalDFwhmY =
      (gaussian2DFct(x, y, xFWHM, yFWHM + h) -
        gaussian2DFct(x, y, xFWHM, yFWHM - h)) /
      (2 * h);

    expect(dx).toBeCloseTo(numericalDx, 6);
    expect(dy).toBeCloseTo(numericalDy, 6);
    expect(dFwhmX).toBeCloseTo(numericalDFwhmX, 6);
    expect(dFwhmY).toBeCloseTo(numericalDFwhmY, 6);
  }
});

test('Gaussian2D.derivative returns both dimensions and parameters in order', () => {
  const gaussian = new Gaussian2D({ fwhm: { x: xFWHM, y: yFWHM } });
  const result = gaussian.derivative(0.05, -0.1);
  const expected = gaussian2DDerivative(0.05, -0.1, xFWHM, yFWHM);

  expect(result.fct).toBeCloseTo(expected.fct, 12);
  expect(result.dx).toBeCloseTo(expected.dx, 12);
  expect(result.dy).toBeCloseTo(expected.dy, 12);
  expect(result.parameters).toHaveLength(2);
  expect(result.parameters[0]).toBeCloseTo(expected.dFwhmX, 12);
  expect(result.parameters[1]).toBeCloseTo(expected.dFwhmY, 12);
});
