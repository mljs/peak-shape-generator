import { expect, expectTypeOf, test } from 'vitest';

import type { Shape1D } from '../Shape1D.ts';
import type { Shape1DInstance } from '../Shape1DInstance.ts';
import { getShape1D } from '../getShape1D.ts';
import { PseudoVoigtTCH } from '../pseudoVoigtTCH/PseudoVoigtTCH.ts';

interface ShapeCase {
  shape: Shape1D;
  /** The values `getParameters()` reports, which a round trip has to preserve. */
  parameters: Record<string, number>;
}

const cases: ShapeCase[] = [
  { shape: { kind: 'gaussian', fwhm: 10 }, parameters: { fwhm: 10 } },
  { shape: { kind: 'lorentzian', fwhm: 10 }, parameters: { fwhm: 10 } },
  {
    shape: { kind: 'lorentzianDispersive', fwhm: 10 },
    parameters: { fwhm: 10 },
  },
  {
    shape: { kind: 'pseudoVoigt', fwhm: 10, mu: 0.3 },
    parameters: { fwhm: 10, mu: 0.3 },
  },
  {
    shape: { kind: 'pseudoVoigtTCH', fwhmG: 10, fwhmL: 5 },
    parameters: { fwhmG: 10, fwhmL: 5 },
  },
  {
    shape: { kind: 'generalizedLorentzian', fwhm: 10, gamma: 0.7 },
    parameters: { fwhm: 10, gamma: 0.7 },
  },
  {
    shape: { kind: 'splitGaussian', fwhmLow: 10, fwhmHigh: 30 },
    parameters: { fwhmLow: 10, fwhmHigh: 30 },
  },
];

const positions = [-7, -1.5, 0, 1.5, 7];

/**
 * Serialize a shape and parse it back, the way a consumer storing shapes on
 * disk would. `structuredClone` is not an alternative here: it copies the own
 * properties and ignores `toJSON`, which is exactly what is under test.
 * @param shape - the shape instance to serialize.
 * @returns the parsed descriptor.
 */
function throughJSON<TShape extends Shape1DInstance>(
  shape: TShape,
): ReturnType<TShape['toJSON']> {
  const serialized = JSON.stringify(shape);
  return JSON.parse(serialized);
}

/**
 * Read the values of the parameters a shape is characterized by.
 * @param shape - the shape instance to read.
 * @returns the parameter values, keyed by parameter name.
 */
function parameterValues(shape: Shape1DInstance): Record<string, number> {
  const source = shape as unknown as Record<string, number>;
  const values: Record<string, number> = {};
  for (const parameter of shape.getParameters()) {
    const value = source[parameter];
    if (value === undefined) {
      throw new Error(`${shape.kind} does not expose ${parameter}`);
    }
    values[parameter] = value;
  }
  return values;
}

test('every instance carries the kind of its descriptor', () => {
  const kinds = [];
  for (const { shape } of cases) {
    kinds.push(getShape1D(shape).kind);
  }

  expect(kinds).toStrictEqual([
    'gaussian',
    'lorentzian',
    'lorentzianDispersive',
    'pseudoVoigt',
    'pseudoVoigtTCH',
    'generalizedLorentzian',
    'splitGaussian',
  ]);
});

test('toJSON emits the descriptor the shape was built from', () => {
  const descriptors = [];
  for (const { shape } of cases) {
    descriptors.push(getShape1D(shape).toJSON());
  }

  expect(descriptors).toStrictEqual([
    { kind: 'gaussian', fwhm: 10 },
    { kind: 'lorentzian', fwhm: 10 },
    { kind: 'lorentzianDispersive', fwhm: 10 },
    { kind: 'pseudoVoigt', fwhm: 10, mu: 0.3 },
    { kind: 'pseudoVoigtTCH', fwhmG: 10, fwhmL: 5 },
    { kind: 'generalizedLorentzian', fwhm: 10, gamma: 0.7 },
    { kind: 'splitGaussian', fwhmLow: 10, fwhmHigh: 30 },
  ]);
});

test('a JSON round trip preserves the kind, every parameter and the curve', () => {
  for (const { shape, parameters } of cases) {
    const instance = getShape1D(shape);
    const restored = getShape1D(throughJSON(instance));

    expect(restored.kind).toBe(instance.kind);
    expect(parameterValues(instance)).toStrictEqual(parameters);
    expect(parameterValues(restored)).toStrictEqual(parameters);

    for (const x of positions) {
      expect(restored.fct(x)).toBe(instance.fct(x));
    }
  }
});

test('a TCH shape built from its effective width also round-trips', () => {
  const instance = new PseudoVoigtTCH({ fwhm: 10, mu: 0.25 });
  const restored = getShape1D(throughJSON(instance));

  // fwhmG and fwhmL are the serialized state, so they come back untouched
  expect(restored.fwhmG).toBe(instance.fwhmG);
  expect(restored.fwhmL).toBe(instance.fwhmL);
  // fwhm and mu are recomputed from them, to within the rounding of `x ** 0.2`
  expect(restored.fwhm).toBeCloseTo(10, 12);
  expect(restored.mu).toBeCloseTo(0.25, 12);
});

test('an instance is itself a valid Shape1D descriptor', () => {
  expectTypeOf<Shape1DInstance>().toExtend<Shape1D>();

  for (const { shape, parameters } of cases) {
    const instance = getShape1D(shape);

    expectTypeOf(instance).toExtend<Shape1D>();

    const copy = getShape1D(instance);

    expect(copy).toBeInstanceOf(instance.constructor);
    expect(copy).not.toBe(instance);
    expect(parameterValues(copy)).toStrictEqual(parameters);

    for (const x of positions) {
      expect(copy.fct(x)).toBe(instance.fct(x));
    }
  }
});

test('a split gaussian keeps its asymmetry through a copy', () => {
  const instance = getShape1D({
    kind: 'splitGaussian',
    fwhmLow: 10,
    fwhmHigh: 30,
  });
  const copy = getShape1D(instance);

  expect(copy.fwhmLow).toBe(10);
  expect(copy.fwhmHigh).toBe(30);
  expect(copy.fwhm).toBe(20);
});
