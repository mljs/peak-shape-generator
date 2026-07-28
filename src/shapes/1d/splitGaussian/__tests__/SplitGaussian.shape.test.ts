import { expect, test } from 'vitest';

import { ROOT_PI_OVER_LN2 } from '../../../../util/constants.ts';
import { getGaussianData } from '../../gaussian/Gaussian.ts';
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

  expect(data).toHaveLength(199);

  const area = data.reduce((a, b) => a + b, 0);

  // the window is sized on the wider half, so the narrower half is over-covered
  // and the sum slightly exceeds the 0.9999 area the factor targets
  expect(area).toBeCloseTo(0.9999, 4);
  expect(shape.getArea()).toBeCloseTo(1, 12);
});

test('equal halves reduce to a symmetric gaussian area', () => {
  const shape = new SplitGaussian({ fwhmLow: 50, fwhmHigh: 50 });

  expect(shape.fwhm).toBe(50);
  expect(getSplitGaussianArea({ fwhmLow: 50, fwhmHigh: 50 })).toBeCloseTo(
    (ROOT_PI_OVER_LN2 * 50) / 2,
    6,
  );
});

test('equal halves produce the same data as a gaussian', () => {
  const data = new SplitGaussian({ fwhmLow: 50, fwhmHigh: 50 }).getData();

  expect(data).toStrictEqual(getGaussianData({ fwhm: 50 }));
});

test('length option is honored, apex stays at the center', () => {
  const shape = new SplitGaussian({ fwhmLow: 10, fwhmHigh: 30 });
  const data = shape.getData({ length: 101, height: 1 });

  expect(data).toHaveLength(101);
  expect(data[50]).toBe(1);
  expect(data[40]).toBe(shape.fct(-10));
  expect(data[60]).toBe(shape.fct(10));
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
