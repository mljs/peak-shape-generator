import { expect, expectTypeOf, test } from 'vitest';

import type { Shape2D } from '../Shape2D.ts';
import type { Shape2DInstance } from '../Shape2DInstance.ts';
import { getShape2D } from '../getShape2D.ts';

const shapes: Shape2D[] = [
  { kind: 'gaussian', fwhm: { x: 10, y: 30 } },
  { kind: 'gaussian', fwhm: 20 },
  { kind: 'gaussian', sd: { x: 5, y: 15 } },
];

const positions: Array<[number, number]> = [
  [0, 0],
  [-7, 3],
  [1.5, -12],
  [21, 40],
];

/**
 * Serialize a shape and parse it back, the way a consumer storing shapes on
 * disk would. `structuredClone` is not an alternative here: it copies the own
 * properties and ignores `toJSON`, which is exactly what is under test.
 * @param shape - the shape instance to serialize.
 * @returns the parsed descriptor.
 */
function throughJSON<TShape extends Shape2DInstance>(
  shape: TShape,
): ReturnType<TShape['toJSON']> {
  const serialized = JSON.stringify(shape);
  return JSON.parse(serialized);
}

test('every instance carries the kind of its descriptor', () => {
  const kinds = [];
  for (const shape of shapes) {
    kinds.push(getShape2D(shape).kind);
  }

  expect(kinds).toStrictEqual(['gaussian', 'gaussian', 'gaussian']);
});

test('toJSON emits both axes, whichever option built the shape', () => {
  const descriptors = [];
  for (const shape of shapes) {
    descriptors.push(getShape2D(shape).toJSON());
  }

  expect(descriptors).toStrictEqual([
    { kind: 'gaussian', fwhm: { x: 10, y: 30 } },
    { kind: 'gaussian', fwhm: { x: 20, y: 20 } },
    // `sd` is re-assigned to a fwhm of 2·sd·√(2·ln2) on each axis
    {
      kind: 'gaussian',
      fwhm: { x: 11.774100225154747, y: 35.32230067546424 },
    },
  ]);
});

test('a JSON round trip preserves the kind, both widths and the surface', () => {
  for (const shape of shapes) {
    const instance = getShape2D(shape);
    const restored = getShape2D(throughJSON(instance));

    expect(restored.kind).toBe(instance.kind);
    expect(restored.fwhmX).toBe(instance.fwhmX);
    expect(restored.fwhmY).toBe(instance.fwhmY);

    for (const [x, y] of positions) {
      expect(restored.fct(x, y)).toBe(instance.fct(x, y));
    }
  }
});

test('an instance is itself a valid Shape2D descriptor', () => {
  expectTypeOf<Shape2DInstance>().toExtend<Shape2D>();

  for (const shape of shapes) {
    const instance = getShape2D(shape);

    expectTypeOf(instance).toExtend<Shape2D>();

    const copy = getShape2D(instance);

    expect(copy).toBeInstanceOf(instance.constructor);
    expect(copy).not.toBe(instance);
    expect(copy.fwhmX).toBe(instance.fwhmX);
    expect(copy.fwhmY).toBe(instance.fwhmY);
  }
});

test('a copy keeps the asymmetry between both axes', () => {
  const instance = getShape2D({ kind: 'gaussian', fwhm: { x: 10, y: 30 } });
  const copy = getShape2D(instance);

  expect(copy.fwhmX).toBe(10);
  expect(copy.fwhmY).toBe(30);
  expect(copy.fwhm).toStrictEqual({ x: 10, y: 30 });
});
