import { GAUSSIAN } from './util/constants';
import { getKind } from './util/getKind';

/**
 * Calculate the area of a specific shape.
 * @param {number} fwhm - Full width at half maximum.
 * @param {number|string} [kind = 1] - number of points in Full Width at Half Maximum, Standard deviation will be computed as fwhm / 2 / sqrt(2 ln(2))
 * @param {*} [options = {}] - options.
 * @param {number} [options.height = 1] - Maximum y value of the shape.
 * @param {number} [options.mu = 0.5] - ratio of gaussian contribution. It is used if the kind = 3 or pseudovoigt.
 * @returns {number} - returns the area of the specific shape and parameters.
 */

export function getArea(fwhm, kind = GAUSSIAN, options = {}) {
  let { height = 1, mu = 0.5 } = options;

  kind = getKind(kind);
  switch (kind) {
    case 1:
      return (height * Math.sqrt(Math.PI / Math.LN2) * fwhm) / 2;
    case 2:
      return (height * Math.PI * fwhm) / 2;
    case 3:
      return (
        (fwhm *
          height *
          (mu * Math.sqrt(Math.PI / Math.LN2) + (1 - mu) * Math.PI)) /
        2
      );
    default:
      throw new Error(`Unknown kind: ${kind}`);
  }
}
