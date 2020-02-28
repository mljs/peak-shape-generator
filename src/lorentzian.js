/**
 * Calculate a lorentzian shape
 * @param {object} [options = {}]
 * @param {number} [options.fwhm = 500] - number of points in Full Width at Half Maximum.
 * @param {number} [options.factor = 3] - factor of HWHM to increase the window size, the vector size is 2 * factor * HMHM
 * @return {Float64Array} - array of Y points.
 */

export function lorentzian(options = {}) {
  const { factor = 8, fwhm = 1000 } = options;
  const halfWidth = fwhm / 2;
  const lenLorentzian = 2 * parseInt(halfWidth, 10) * factor + (fwhm % 2);
  const center = (lenLorentzian - 1) / 2;
  const normalConstant = 1 / Math.PI;
  const vector = new Float64Array(lenLorentzian);
  for (let i = 0; i <= center; i++) {
    vector[i] =
      (normalConstant * halfWidth) /
      (Math.pow(i - center, 2) + Math.pow(halfWidth, 2));
  }
  let limit = fwhm % 2 ? center : center + 1;
  vector.set(
    vector.slice(0, parseInt(limit, 10)).reverse(),
    parseInt(center + 1, 10),
  );
  return vector;
}
