import { expect, test } from 'vitest';

import { ROOT_PI_OVER_LN2 } from '../../../../util/constants.ts';
import {
  SplitGaussian,
  calculateSplitGaussianHeight,
  getSplitGaussianArea,
} from '../SplitGaussian.ts';

test('height 1, apex at the center', () => {
  const shape = new SplitGaussian({ fwhmLow: 10, fwhmHigh: 30 });
  const data = shape.getData({ height: 1 });

  const center = (data.length - 1) / 2;

  expect(data[center]).toBe(1);
  // higher-x half is wider, so it decays slower than the lower-x half
  expect(data[center + 5]).toBeGreaterThan(data[center - 5]);

  const area = data.reduce((a, b) => a + b, 0);

  expect(area).toBeCloseTo((ROOT_PI_OVER_LN2 * (10 + 30)) / 4, 2);
  expect(shape.getParameters()).toStrictEqual(['fwhmLow', 'fwhmHigh']);
});

test('normalized area is close to 1', () => {
  const shape = new SplitGaussian({ fwhmLow: 40, fwhmHigh: 60 });
  const data = shape.getData();

  const area = data.reduce((a, b) => a + b, 0);

  expect(area).toBeCloseTo(0.9999, 2);
  expect(shape.getArea()).toBeCloseTo(1, 2);
});

test('equal halves reduce to a symmetric gaussian area', () => {
  const shape = new SplitGaussian({ fwhmLow: 50, fwhmHigh: 50 });

  expect(shape.fwhm).toBe(50);
  expect(getSplitGaussianArea({ fwhmLow: 50, fwhmHigh: 50 })).toBeCloseTo(
    (ROOT_PI_OVER_LN2 * 50) / 2,
    6,
  );
});

test('height calculation is consistent with the area', () => {
  const shape = new SplitGaussian({ fwhmLow: 100, fwhmHigh: 300 });
  const height = shape.calculateHeight();
  const expected = calculateSplitGaussianHeight({
    fwhmLow: 100,
    fwhmHigh: 300,
    area: 1,
  });

  expect(height).toBeCloseTo(expected, 6);
  expect(
    getSplitGaussianArea({ fwhmLow: 100, fwhmHigh: 300, height }),
  ).toBeCloseTo(1, 6);
});

test('change height should change area proportionally', () => {
  const shape = new SplitGaussian({ fwhmLow: 100, fwhmHigh: 200 });
  const area = shape.getArea(1);

  expect(shape.getArea(2)).toBeCloseTo(2 * area, 4);
});
