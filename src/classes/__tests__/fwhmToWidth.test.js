import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { Gaussian } from '../Gaussian';
import { Lorentzian } from '../Lorentzian';
import { PseudoVoigt } from '../PseudoVoigt';

expect.extend({ toBeDeepCloseTo });

const fwhm = 20;
describe('fwhmToWidth', () => {
  it('Gaussian', () => {
    const inflectionPointsWidth = Gaussian.fwhmToWidth(fwhm);
    expect(inflectionPointsWidth).toBeDeepCloseTo(fwhm / 1.1774, 2);
  });
  it('get inflection point width from fwhm of a lorenztian', () => {
    let inflectionPointsWidth = Lorentzian.fwhmToWidth(fwhm);
    expect(inflectionPointsWidth).toBeDeepCloseTo(fwhm / Math.sqrt(3), 2);
  });
  it('get inflection point width from fwhm of a pseudo voigt', () => {
    let mu = 0.5;
    let inflectionPointsWidth = PseudoVoigt.fwhmToWidth(fwhm, mu);
    expect(inflectionPointsWidth).toBeDeepCloseTo(fwhm / (mu * 0.1774 + 1), 2);
  });
});
