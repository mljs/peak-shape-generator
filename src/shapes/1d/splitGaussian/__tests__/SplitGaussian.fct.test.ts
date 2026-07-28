import { expect, test } from 'vitest';

import type { Shape1DInstance } from '../../Shape1DInstance.ts';
import { getShape1D } from '../../getShape1D.ts';
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

test('setting fwhm scales both halves and keeps the asymmetry', () => {
  const shape = new SplitGaussian({ fwhmLow: 200, fwhmHigh: 600 });

  shape.fwhm = 100;

  expect(shape.fwhmLow).toBe(50);
  expect(shape.fwhmHigh).toBe(150);
  expect(shape.fwhm).toBe(100);
  // the half-maximum crossings follow the new halves
  expect(shape.fct(-25)).toBeCloseTo(0.5, 12);
  expect(shape.fct(75)).toBeCloseTo(0.5, 12);
});

test('setting fwhm on a peak with no width makes it symmetric', () => {
  const shape = new SplitGaussian({ fwhmLow: 0, fwhmHigh: 0 });

  shape.fwhm = 300;

  expect(shape.fwhmLow).toBe(300);
  expect(shape.fwhmHigh).toBe(300);
});

test('a shape taken from the union accepts a new fwhm', () => {
  const shape: Shape1DInstance = getShape1D({
    kind: 'splitGaussian',
    fwhmLow: 200,
    fwhmHigh: 600,
  });

  shape.fwhm = 100;

  expect(shape.fwhm).toBe(100);
});

test('both halves default to 500', () => {
  const shape = new SplitGaussian();

  expect(shape.fwhmLow).toBe(500);
  expect(shape.fwhmHigh).toBe(500);
  expect(shape.fwhm).toBe(500);
});
