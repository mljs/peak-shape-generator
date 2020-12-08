import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { getArea } from '..';
import { GAUSSIAN, LORENTZIAN, PSEUDO_VOIGT } from '../util/constants';

expect.extend({ toBeDeepCloseTo });

const fwhm = 20;
describe('getShape', () => {
  it('get Area of normalized gaussian', () => {
    let area = getArea(20, GAUSSIAN, {
      height: Math.sqrt((4 * Math.LN2) / Math.PI) / fwhm,
    });
    expect(area).toBeDeepCloseTo(1, 2);
  });
  it('get Area of normalized lorenztian', () => {
    let area = getArea(20, LORENTZIAN, { height: 2 / Math.PI / fwhm });
    expect(area).toBeDeepCloseTo(1, 2);
  });
  it('get Area of normalized pseudo voigt', () => {
    let mu = 0.5;
    let area = getArea(20, PSEUDO_VOIGT, {
      height:
        1 /
        ((mu / Math.sqrt((4 * Math.LN2) / Math.PI)) * fwhm +
          ((1 - mu) * fwhm * Math.PI) / 2),
      mu,
    });
    expect(area).toBeDeepCloseTo(1, 2);
  });
  it('throw error', () => {
    expect(() => {
      getArea(2, 4);
    }).toThrow('Unknown kind: 4');
  });
});
