import {
  GAUSSIAN,
  LORENTZIAN,
  PSEUDO_VOIGT,
  ROOT_THREE,
  ROOT_2LN2,
  ROOT_2LN2_MINUS_ONE,
} from './util/constants';
import { getKind } from './util/getKind';

/**
 * Compute the value of width between the inflection points of a specific shape from Full Width at Half Maximum (FWHM).
 * @param {number} fwhm - Full Width at Half Maximum.
 * @param {number|string} [kind = 1] kind may be 'gaussian', 'lorentzian' or 'pseudovoigt' or their corresponding number
 * @param {*} options - options
 * @param {number} [options.mu = 0.5] - ratio of gaussian contribution. It is used if the kind = 3 or pseudovoigt.
 */

export function fwhmToInflectionPointsWidth(
  fwhm,
  kind = GAUSSIAN,
  options = {},
) {
  let { mu = 0.5 } = options;

  kind = getKind(kind);
  switch (kind) {
    case GAUSSIAN:
      return fwhm / ROOT_2LN2;
    case LORENTZIAN:
      return fwhm / ROOT_THREE;
    case PSEUDO_VOIGT:
      return fwhm / (mu * ROOT_2LN2_MINUS_ONE + 1);
    default:
      throw new Error(`Unknown kind: ${kind}`);
  }
}
