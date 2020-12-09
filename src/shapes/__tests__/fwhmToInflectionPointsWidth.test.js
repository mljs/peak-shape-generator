import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { GAUSSIAN, LORENTZIAN, PSEUDO_VOIGT } from '../../util/constants';
import { fwhmToInflectionPointsWidth } from '../fwhmToInflectionPointsWidth';

expect.extend({ toBeDeepCloseTo });

const fwhm = 20;
describe('getShape', () => {
  it('get inflection point width from fwhm of a gaussian', () => {
    let inflectionPointsWidth = fwhmToInflectionPointsWidth(fwhm, GAUSSIAN);
    expect(inflectionPointsWidth).toBeDeepCloseTo(fwhm / 1.1774, 2);
  });
  it('get inflection point width from fwhm of a lorenztian', () => {
    let inflectionPointsWidth = fwhmToInflectionPointsWidth(fwhm, LORENTZIAN);
    expect(inflectionPointsWidth).toBeDeepCloseTo(fwhm / Math.sqrt(3), 2);
  });
  it('get inflection point width from fwhm of a pseudo voigt', () => {
    let mu = 0.5;
    let inflectionPointsWidth = fwhmToInflectionPointsWidth(
      fwhm,
      PSEUDO_VOIGT,
      {
        mu,
      },
    );
    expect(inflectionPointsWidth).toBeDeepCloseTo(fwhm / (mu * 0.1774 + 1), 2);
  });
  it('throw error', () => {
    expect(() => {
      fwhmToInflectionPointsWidth(2, 4);
    }).toThrow('Unknown kind: 4');
  });
});
