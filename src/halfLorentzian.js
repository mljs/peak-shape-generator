/**
 * Calculate a half lorentzian shape
 * @param {object} [options = {}]
 * @param {number} [options.FWHM = 500] - number of points in Full Width at Half Maximum.
 * @param {number} [options.factor = 3] - factor of HWHM to increase the window size, the vector size is 2 * factor * HMHM
 * @param {boolean} [options.ascending = false] - if it is true the vector will contain the left side of the Gaussian shape
 * @return {Float64Array} - array of Y points.
 */

export function halfLorentzian(options = {}) {
  const { factor = 8, FWHM = 1000, ascending = false } = options;
  const halfWidth = FWHM / 2;
  const lenLorentzian = parseInt(factor * halfWidth, 10);
  let center = ascending ? lenLorentzian : 0;
  const normalConstant = 1 / Math.PI;
  const vector = new Float64Array(lenLorentzian);
  for (let i = 0; i < lenLorentzian; i++) {
    vector[i] =
      (normalConstant * halfWidth) /
      (Math.pow(i - center, 2) + Math.pow(halfWidth, 2));
  }
  return vector;
}
