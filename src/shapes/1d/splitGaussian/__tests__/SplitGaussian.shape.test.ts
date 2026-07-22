import { expect, test } from 'vitest';

import { ROOT_PI_OVER_LN2 } from '../../../../util/constants.ts';
import {
  SplitGaussian,
  calculateSplitGaussianHeight,
  getSplitGaussianArea,
} from '../SplitGaussian.ts';

test('height 1, apex at the center', () => {
  const shape = new SplitGaussian({ fwhmLeft: 10, fwhmRight: 30 });
  const data = shape.getData({ height: 1 });

  const center = (data.length - 1) / 2;

  expect(data[center]).toBe(1);
  // right half is wider, so it decays slower than the left half
  expect(data[center + 5]).toBeGreaterThan(data[center - 5]);

  const area = data.reduce((a, b) => a + b, 0);

  expect(area).toBeCloseTo((ROOT_PI_OVER_LN2 * (10 + 30)) / 4, 2);
  expect(shape.getParameters()).toStrictEqual(['fwhmLeft', 'fwhmRight']);
});

test('normalized area is close to 1', () => {
  const shape = new SplitGaussian({ fwhmLeft: 40, fwhmRight: 60 });
  const data = shape.getData();

  const area = data.reduce((a, b) => a + b, 0);

  expect(area).toBeCloseTo(0.9999, 2);
  expect(shape.getArea()).toBeCloseTo(1, 2);
});

test('equal halves reduce to a symmetric gaussian area', () => {
  const shape = new SplitGaussian({ fwhmLeft: 50, fwhmRight: 50 });

  expect(shape.fwhm).toBe(50);
  expect(getSplitGaussianArea({ fwhmLeft: 50, fwhmRight: 50 })).toBeCloseTo(
    (ROOT_PI_OVER_LN2 * 50) / 2,
    6,
  );
});

test('height calculation is consistent with the area', () => {
  const shape = new SplitGaussian({ fwhmLeft: 100, fwhmRight: 300 });
  const height = shape.calculateHeight();
  const expected = calculateSplitGaussianHeight({
    fwhmLeft: 100,
    fwhmRight: 300,
    area: 1,
  });

  expect(height).toBeCloseTo(expected, 6);
  expect(
    getSplitGaussianArea({ fwhmLeft: 100, fwhmRight: 300, height }),
  ).toBeCloseTo(1, 6);
});

test('change height should change area proportionally', () => {
  const shape = new SplitGaussian({ fwhmLeft: 100, fwhmRight: 200 });
  const area = shape.getArea(1);

  expect(shape.getArea(2)).toBeCloseTo(2 * area, 4);
});
