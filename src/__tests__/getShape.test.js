import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { getShape } from '..';
import { GAUSSIAN, LORENTZIAN, PSEUDO_VOIGT } from '../util/getKind';

expect.extend({ toBeDeepCloseTo });

describe('area calculation', () => {
  it('calculate area of a gaussian', () => {
    let shape = getShape(GAUSSIAN, { fwhm: 20, normalized: true });
    expect(shape.fwhm).toBe(20);
    let area = shape.data.reduce((a, b) => a + b, 0);
    expect(area).toBeDeepCloseTo(1, 2);
  });
  it('calculate area of a lorentzian', () => {
    let shape = getShape(LORENTZIAN, { fwhm: 20, normalized: true });
    expect(shape.fwhm).toBe(20);
    let area = shape.data.reduce((a, b) => a + b, 0);
    expect(area).toBeDeepCloseTo(1, 2);
  });
  it('calculate area of a pseudo voigt', () => {
    let shape = getShape(PSEUDO_VOIGT, { fwhm: 20, normalized: true });
    expect(shape.fwhm).toBe(20);
    let area = shape.data.reduce((a, b) => a + b, 0);
    expect(area).toBeDeepCloseTo(1, 2);
  });
  it('throw error', () => {
    expect(() => {
      getShape(4);
    }).toThrow('Unknown shape kind: 4');
  });
});
