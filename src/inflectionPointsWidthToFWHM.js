import { getKind, GAUSSIAN } from './util/getKind';

/**
 * Compute the value of Full Width at Half Maximum (FWHM) of a specific shape from the width between the inflection points.
 * @param {number} width - Width between the inflection points
 * @param {number|string} [kind = 1] kind may be 'gaussian', 'lorentzian' or 'pseudovoigt' or their corresponding number
 * @param {*} options - options
 * @param {number|object} [options.mu = 0.5] - ratio of gaussian contribution. It is used if the kind = 3 or pseudovoigt.
 */

export function inflectionPointsWidthToFWHM(
  width,
  kind = GAUSSIAN,
  options = {},
) {
  let { mu = 0.5 } = options;

  if (typeof kind === 'string') kind = getKind(kind);
  switch (kind) {
    case 1:
      //https://mathworld.wolfram.com/GaussianFunction.html
      return width * Math.sqrt(2 * Math.LN2);
    case 2:
      //https://mathworld.wolfram.com/LorentzianFunction.html
      return width * Math.sqrt(3);
    case 3:
      return width * (mu * (Math.sqrt(2 * Math.LN2) - 1) + 1);
    default:
      throw new Error(`Unknown shape kind: ${kind}`);
  }
}
