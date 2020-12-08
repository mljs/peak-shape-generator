import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { PeakShapeGenerator } from '..';
import { GAUSSIAN } from '../util/constants';

expect.extend({ toBeDeepCloseTo });

describe('PeakShapeGenerator', () => {
  const peakShapeGenerator = new PeakShapeGenerator();

  it('fwhm fixed', () => {
    let shape = peakShapeGenerator.getShape(GAUSSIAN, { fwhm: 500 });
    expect(shape.fwhm).toBe(500);
    let shape2 = peakShapeGenerator.getShape(GAUSSIAN, { fwhm: 500 });
    expect(shape).toStrictEqual(shape2);
    let shape3 = peakShapeGenerator.getShape(GAUSSIAN, { fwhm: 100 });
    expect(shape !== shape3).toBe(true);
    let shape4 = peakShapeGenerator.getShape(GAUSSIAN, { fwhm: 100 });
    expect(shape3).toStrictEqual(shape4);
  });
});
