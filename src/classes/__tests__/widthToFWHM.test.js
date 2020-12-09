import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { GAUSSIAN, LORENTZIAN, PSEUDO_VOIGT } from '../constants';
import { widthToFWHM } from '../widthToFWHM';

expect.extend({ toBeDeepCloseTo });

const width = 20;
describe('getShape', () => {
  it('get inflection point width from fwhm of a gaussian', () => {
    let fwhm = widthToFWHM(width, GAUSSIAN);
    expect(fwhm).toBeDeepCloseTo(width * 1.1774, 2);
  });
  it('get inflection point width from fwhm of a lorenztian', () => {
    let fwhm = widthToFWHM(width, LORENTZIAN);
    expect(fwhm).toBeDeepCloseTo(width * Math.sqrt(3), 2);
  });
  it('get inflection point width from fwhm of a pseudo voigt', () => {
    let mu = 0.5;
    let fwhm = widthToFWHM(width, PSEUDO_VOIGT, {
      mu,
    });
    expect(fwhm).toBeDeepCloseTo(width * (mu * 0.1774 + 1), 2);
  });
  it('throw error', () => {
    expect(() => {
      widthToFWHM(2, 4);
    }).toThrow('Unknown kind: 4');
  });
});
