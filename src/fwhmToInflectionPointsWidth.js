import { getKind, GAUSSIAN } from './util/getKind';

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

  if (typeof kind === 'string') kind = getKind(kind);
  switch (kind) {
    case 1:
      return fwhm / Math.sqrt(2 * Math.LN2);
    case 2:
      return fwhm;
    case 3:
      return fwhm / (mu * (Math.sqrt(2 * Math.LN2) - 1) + 1);
    default:
      throw new Error(`Unknown shape kind: ${kind}`);
  }
}
