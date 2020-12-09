import { gaussian } from './gaussian';
import { lorentzian } from './lorentzian';
import { pseudoVoigt } from './pseudoVoigt';
import { GAUSSIAN, LORENTZIAN, PSEUDO_VOIGT } from './util/constants';
import { getKind } from './util/getKind';

/**
 * Generate a shape of the specified kind
 * @param {number|string} [kind = 1] kind may be 'gaussian', 'lorentzian' or 'pseudovoigt' or their corresponding number
 * @param {object} [options = {}]
 * @param {number} [options.fwhm = 500] - number of points in Full Width at Half Maximum, Standard deviation will be computed as fwhm / 2 / sqrt(2 ln(2))
 * @param {number} [options.factor] - factor of the width, the default depends of the kind of shape.
 * @param {number} [options.length = fwhm * factor + 1] - total number of points to calculate
 * @return {object} - {fwhm, data<Float64Array>} - An object with the number of points at half maximum and the array of y values covering the 99.99 % of the area.
 */

export function getShape(kind = GAUSSIAN, options = {}) {
  kind = getKind(kind);
  switch (kind) {
    case GAUSSIAN:
      return gaussian(options);
    case LORENTZIAN:
      return lorentzian(options);
    case PSEUDO_VOIGT:
      return pseudoVoigt(options);
    default:
      throw new Error(`Unknown shape kind: ${kind}`);
  }
}
