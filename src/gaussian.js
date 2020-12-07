import { inflectionPointsWidthToFWHM } from './inflectionPointsWidthToFWHM';
import { gaussianFct } from './shapes/gaussianFct';

/**
 * Calculate a normalized gaussian shape
 * @param {object} [options = {}]
 * @param {Number} [options.height = 1] - maximum value of the curve.
 * @param {Number} [options.normalized = false] - If it's true the area under the curve will be equal to one, ignoring height option.
 * @param {Number} [options.interval = 1] - Step size to calculate the shape values.
 * @param {number} [options.fwhm = 500] - Full Width at Half Maximum, if options.interval is equal to 1, it will be the number of points in FWHM.
 * @param {number} [options.sd] - Standard deviation, if it's defined options.fwhm will be ignored and the value will be computed sd * Math.sqrt(8 * Math.LN2);
 * @param {number} [options.factor = 4] - Number of time to take fwhm to calculate length. Default covers 99.99 % of area.
 * @param {number} [options.length = fwhm * factor + 1] - total number of points to calculate
 * @return {object} - {fwhm, data<Float64Array>} - An object with the number of points at half maximum and the array of y values covering the 99.99 % of the area.
 */

export function gaussian(options = {}) {
  let {
    interval = 1,
    height = 1,
    length,
    factor = 4,
    fwhm = 500,
    sd,
    normalized = false,
  } = options;

  if (sd) {
    fwhm = inflectionPointsWidthToFWHM(2 * sd);
  }

  if (!length) {
    length = Math.min(
      Math.ceil((fwhm * factor) / interval),
      Math.pow(2, 20) - 1,
    );
    if (length % 2 === 0) length++;
  }

  const center = (length - 1) / 2;
  const mean = center * interval;

  let intensity = normalized
    ? Math.sqrt((4 * Math.LN2) / Math.PI) / fwhm
    : height;

  const data = new Float64Array(length);
  for (let i = 0; i <= center; i++) {
    data[i] = gaussianFct(mean, intensity, fwhm, i * interval);
    data[length - 1 - i] = data[i];
  }
  return { data, fwhm, interval };
}
