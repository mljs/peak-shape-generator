/**
 * Calculate a lorentzian shape
 * @param {object} [options = {}]
 * @param {number} [options.fwhm = 500] - number of points in Full Width at Half Maximum.
 * @param {number} [options.factor = 3] - Number of time to take fwhm to calculate length
 * @param {number} [options.length = fwhm * factor] - total number of points to calculate
 * @return {Float64Array} - array of Y points.
 */

export function lorentzian(options = {}) {
  let { length, factor = 3, fwhm = 1000 } = options;
  if (length === undefined) length = fwhm * factor;

  const halfWidth = fwhm / 2;
  const center = (length - 1) / 2;
  const normalConstant = 1 / Math.PI;
  const vector = new Float64Array(length);
  for (let i = 0; i <= center; i++) {
    vector[i] =
      (normalConstant * halfWidth) /
      (Math.pow(i - center, 2) + Math.pow(halfWidth, 2));
    vector[length - 1 - i] = vector[i];
  }
  return vector;
}
