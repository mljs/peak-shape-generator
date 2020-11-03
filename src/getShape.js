import { gaussian } from './gaussian';
import { lorentzian } from './lorentzian';
import { pseudoVoigt } from './pseudoVoigt';

export const GAUSSIAN = 1;
export const LORENTZIAN = 2;
export const PSEUDO_VOIGT = 3;

/**
 * Generate a shape of the specified kind
 * @param {number|string} [kind = 1] kind may be 'gaussian', 'lorentzian' or 'pseudovoigt' or their corresponding number
 * @param {object} [options = {}]
 * @param {number} [options.fwhm = 500] - number of points in Full Width at Half Maximum, Standard deviation will be computed as fwhm / 2 / sqrt(2 ln(2))
 * @param {number} [options.factor = 3] - factor of standard deviation to increase the window size, the vector size is 2 * factor * sd
 * @param {number} [options.length = fwhm * factor + 1] - total number of points to calculate
 * @return {object} - {fwhm, data<Float64Array>}
 */

export function getShape(kind = GAUSSIAN, options = {}) {
  if (typeof kind === 'string') kind = getKind(kind);
  switch (kind) {
    case 1:
      return gaussian(options);
    case 2:
      return lorentzian(options);
    case 3:
      return pseudoVoigt(options);
    default:
      throw new Error(`Unknown shape kind: ${kind}`);
  }
}

function getKind(kind) {
  switch (kind.toLowerCase().replace(/[^a-z]/g, '')) {
    case 'gaussian':
      return GAUSSIAN;
    case 'lorentzian':
      return LORENTZIAN;
    case 'pseudovoigt':
      return PSEUDO_VOIGT;
    default:
      throw new Error(`Unknown kind: ${kind}`);
  }
}
