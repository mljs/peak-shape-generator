import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { GAUSSIAN, LORENTZIAN, PSEUDO_VOIGT } from '../constants';
import { inflectionPointsWidthToFWHM } from '../inflectionPointsWidthToFWHM';

expect.extend({ toBeDeepCloseTo });

const width = 20;
describe('getShape', () => {
  it('get inflection point width from fwhm of a gaussian', () => {
    let fwhm = inflectionPointsWidthToFWHM(width, GAUSSIAN);
    expect(fwhm).toBeDeepCloseTo(width * 1.1774, 2);
  });
  it('get inflection point width from fwhm of a lorenztian', () => {
    let fwhm = inflectionPointsWidthToFWHM(width, LORENTZIAN);
    expect(fwhm).toBeDeepCloseTo(width * Math.sqrt(3), 2);
  });
  it('get inflection point width from fwhm of a pseudo voigt', () => {
    let mu = 0.5;
    let fwhm = inflectionPointsWidthToFWHM(width, PSEUDO_VOIGT, {
      mu,
    });
    expect(fwhm).toBeDeepCloseTo(width * (mu * 0.1774 + 1), 2);
  });
  it('throw error', () => {
    expect(() => {
      inflectionPointsWidthToFWHM(2, 4);
    }).toThrow('Unknown kind: 4');
  });
});
