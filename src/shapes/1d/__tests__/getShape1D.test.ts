import { expect, expectTypeOf, test } from 'vitest';

import type { Shape1D } from '../Shape1D.ts';
import type { Shape1DInstance } from '../Shape1DInstance.ts';
import { Gaussian } from '../gaussian/Gaussian.ts';
import { getShape1D } from '../getShape1D.ts';
import { SplitGaussian } from '../splitGaussian/SplitGaussian.ts';

test('returns a Gaussian instance for gaussian input', () => {
  const shape = getShape1D({ kind: 'gaussian', fwhm: 10 });

  expectTypeOf(shape).toEqualTypeOf<Gaussian>();

  expect(shape).toBeInstanceOf(Gaussian);
});

test('returns a SplitGaussian instance for splitGaussian input', () => {
  const shape = getShape1D({
    kind: 'splitGaussian',
    fwhmLow: 10,
    fwhmHigh: 30,
  });

  expectTypeOf(shape).toEqualTypeOf<SplitGaussian>();

  expect(shape).toBeInstanceOf(SplitGaussian);
  expect(shape.fwhm).toBe(20);
});

test('returns the broad union for widened Shape1D input', () => {
  const useGaussian = true as boolean;
  const shape: Shape1D = useGaussian
    ? { kind: 'gaussian', fwhm: 10 }
    : { kind: 'lorentzian', fwhm: 10 };

  const instance = getShape1D(shape);
  const broadInstance = instance;

  expectTypeOf(broadInstance).toExtend<Shape1DInstance>();

  expect(instance.fwhm).toBe(10);
});
