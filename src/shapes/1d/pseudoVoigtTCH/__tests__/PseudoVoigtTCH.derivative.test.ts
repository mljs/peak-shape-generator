import { expect, test } from 'vitest';

import { PseudoVoigtTCH, pseudoVoigtTCHDerivative } from '../PseudoVoigtTCH.ts';

const fwhmG = 0.3;
const fwhmL = 0.4;
const h = 1e-6;

/**
 * Effective fct(x) of a TCH pseudo-Voigt built from independent component widths.
 * @param x
 * @param g
 * @param l
 */
function tchFct(x: number, g: number, l: number): number {
  return new PseudoVoigtTCH({ fwhmG: g, fwhmL: l }).fct(x);
}

test('pseudoVoigtTCHDerivative matches numerical derivatives', () => {
  for (const x of [-0.4, -0.1, 0, 0.05, 0.25]) {
    const { fct, dx, dFwhmG, dFwhmL } = pseudoVoigtTCHDerivative(
      x,
      fwhmG,
      fwhmL,
    );

    expect(fct).toBeCloseTo(tchFct(x, fwhmG, fwhmL), 12);

    const numericalDx =
      (tchFct(x + h, fwhmG, fwhmL) - tchFct(x - h, fwhmG, fwhmL)) / (2 * h);

    expect(dx).toBeCloseTo(numericalDx, 6);

    const numericalDFwhmG =
      (tchFct(x, fwhmG + h, fwhmL) - tchFct(x, fwhmG - h, fwhmL)) / (2 * h);

    expect(dFwhmG).toBeCloseTo(numericalDFwhmG, 5);

    const numericalDFwhmL =
      (tchFct(x, fwhmG, fwhmL + h) - tchFct(x, fwhmG, fwhmL - h)) / (2 * h);

    expect(dFwhmL).toBeCloseTo(numericalDFwhmL, 5);
  }
});

test('PseudoVoigtTCH.derivative returns parameters in getParameters() order', () => {
  const shape = new PseudoVoigtTCH({ fwhmG, fwhmL });
  const { fct, dx, parameters } = shape.derivative(0.05);
  const expected = pseudoVoigtTCHDerivative(0.05, fwhmG, fwhmL);

  expect(shape.getParameters()).toStrictEqual(['fwhmG', 'fwhmL']);
  expect(fct).toBeCloseTo(expected.fct, 12);
  expect(dx).toBeCloseTo(expected.dx, 12);
  expect(parameters).toHaveLength(2);
  expect(parameters[0]).toBeCloseTo(expected.dFwhmG, 12);
  expect(parameters[1]).toBeCloseTo(expected.dFwhmL, 12);
});
