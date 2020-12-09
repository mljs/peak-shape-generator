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
 * Compute the value of Full Width at Half Maximum (FWHM) of a specific shape from the width between the inflection points.
 * @param {number} width - Width between the inflection points
 * @param {number|string} [kind = 1] kind may be 'gaussian', 'lorentzian' or 'pseudovoigt' or their corresponding number
 * @param {object} options - options
 * @param {number} [options.mu = 0.5] - ratio of gaussian contribution. It is used if the kind = 3 or pseudovoigt.
 */

export function inflectionPointsWidthToFWHM(
  width,
  kind = GAUSSIAN,
  options = {},
) {
  let { mu = 0.5 } = options;

  kind = getKind(kind);
  switch (kind) {
    case GAUSSIAN:
      //https://mathworld.wolfram.com/GaussianFunction.html
      return width * ROOT_2LN2;
    case LORENTZIAN:
      //https://mathworld.wolfram.com/LorentzianFunction.html
      return width * ROOT_THREE;
    case PSEUDO_VOIGT:
      return width * (mu * ROOT_2LN2_MINUS_ONE + 1);
    default:
      throw new Error(`Unknown kind: ${kind}`);
  }
}
