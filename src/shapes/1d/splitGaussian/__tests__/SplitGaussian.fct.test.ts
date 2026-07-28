import { expect, test } from 'vitest';

import { SplitGaussian, splitGaussianFct } from '../SplitGaussian.ts';

test('SplitGaussian.fct is asymmetric around the apex', () => {
  const shape = new SplitGaussian({ fwhmLow: 0.2, fwhmHigh: 0.4 });

  expect(shape.fct(0)).toBeCloseTo(1);
  // lower-x half reaches half-max at -fwhmLow/2
  expect(shape.fct(-0.1)).toBeCloseTo(0.5);
  // higher-x half reaches half-max at +fwhmHigh/2
  expect(shape.fct(0.2)).toBeCloseTo(0.5);
  // same distance, different intensity -> asymmetry
  expect(shape.fct(-0.1)).toBeLessThan(shape.fct(0.1));
});

test('splitGaussianFct with equal halves matches a symmetric gaussian', () => {
  expect(splitGaussianFct(-0.1, 0.2, 0.2)).toBeCloseTo(0.5);
  expect(splitGaussianFct(0.1, 0.2, 0.2)).toBeCloseTo(0.5);
});

test('fwhm is the distance between both half-maximum crossings', () => {
  const shape = new SplitGaussian({ fwhmLow: 200, fwhmHigh: 600 });

  expect(shape.fct(-100)).toBeCloseTo(0.5, 12);
  expect(shape.fct(300)).toBeCloseTo(0.5, 12);
  expect(shape.fwhm).toBe(400);
});

test('both halves default to 500', () => {
  const shape = new SplitGaussian();

  expect(shape.fwhmLow).toBe(500);
  expect(shape.fwhmHigh).toBe(500);
  expect(shape.fwhm).toBe(500);
});
