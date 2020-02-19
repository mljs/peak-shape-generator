/**
 * Calculate a lorentzian shape
 * @param {object} [options = {}]
 * @param {number} [options.FWHM = 500] - number of points in Full Width at Half Maximum.
 * @param {number} [options.factor = 3] - factor of HWHM to increase the window size, the vector size is 2 * factor * HMHM
 * @return {Float64Array} - array of Y points.
 */

export function lorentzian(options = {}) {
  const { factor = 8, FWHM = 1000 } = options;
  const halfWidth = FWHM / 2;
  const lenLorentzian = 2 * parseInt(factor * halfWidth, 10);
  const center = lenLorentzian / 2;
  const normalConstant = 1 / Math.PI;
  const vector = new Float64Array(lenLorentzian);
  for (let i = 0; i < lenLorentzian; i++) {
    vector[i] =
      (normalConstant * halfWidth) /
      (Math.pow(i - center, 2) + Math.pow(halfWidth, 2));
  }
  return vector;
}
