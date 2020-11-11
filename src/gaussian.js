import { gaussianFct } from './shapes/gaussianFct';
/**
 * Calculate a normalized gaussian shape
 * @param {object} [options = {}]
 * @param {Number} [options.height = 1] - maximum value of the curve.
 * @param {Number} [options.normalized = false] - If it's true the area under the curve will be equal to one, ignoring height option.
 * @param {number} [options.fwhm = 500] - number of points in Full Width at Half Maximum, Standard deviation will be computed as fwhm / 2 / sqrt(2 ln(2))
 * @param {number} [options.sd] - Standard deviation, if it's defined fwhm parameter will be ignored.
 * @param {number} [options.factor = 4] - Number of time to take fwhm to calculate length. Default covers 99.99 % of area.
 * @param {number} [options.length = fwhm * factor + 1] - total number of points to calculate
 * @return {object} - {fwhm, data<Float64Array>}
 */

export function gaussian(options = {}) {
  let {
    height = 1,
    length,
    factor = 4,
    fwhm = 500,
    sd,
    normalized = false,
  } = options;

  if (sd) {
    fwhm = 2 * Math.sqrt(2 * Math.LN2) * sd;
  }

  if (!length) {
    length = Math.ceil(fwhm * factor);
    if (length % 2 === 0) length++;
  }

  const center = (length - 1) / 2;

  const data = new Float64Array(length);
  let intensity = normalized
    ? Math.sqrt((4 * Math.LN2) / Math.PI) / fwhm
    : height;
  for (let i = 0; i <= center; i++) {
    data[i] = gaussianFct(center, intensity, fwhm, i);
    data[length - 1 - i] = data[i];
  }
  return { data, fwhm };
}
