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

test('the derivative stays consistent with the shape past the gaussian cutoff', () => {
  const fwhmG = 0.2;
  const fwhmL = 0.3;
  const shape = new PseudoVoigtTCH({ fwhmG, fwhmL });
  const h = 1e-7;
  for (const z of [4, 6, 12, 40]) {
    const x = z * shape.fwhm;
    const { fct, dx } = pseudoVoigtTCHDerivative(x, fwhmG, fwhmL);

    // the value keeps agreeing with `fct`, which drops the same underflowed half
    expect(fct).toBe(shape.fct(x));

    const numericalDx =
      (pseudoVoigtTCHDerivative(x + h, fwhmG, fwhmL).fct -
        pseudoVoigtTCHDerivative(x - h, fwhmG, fwhmL).fct) /
      (2 * h);

    expect(dx).toBeCloseTo(numericalDx, 10);
  }
});

test('a shape with no lorentzian width keeps its gaussian half past the cutoff', () => {
  const shape = new PseudoVoigtTCH({ fwhm: 0.2 });
  shape.mu = 1;

  expect(shape.fwhmL).toBe(0);

  for (const z of [4, 6, 12]) {
    const x = z * shape.fwhm;
    const { fct } = pseudoVoigtTCHDerivative(x, shape.fwhmG, shape.fwhmL);

    expect(fct).toBeGreaterThan(0);
    // the derivative rebuilds the effective fwhm, so it agrees to rounding only
    expect(fct / shape.fct(x)).toBeCloseTo(1, 10);
  }
});
