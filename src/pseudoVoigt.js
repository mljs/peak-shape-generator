/**
 * Calculate a linear combination of gaussian and lorentzian function width an same full width at half maximum
 * @param {object} [options = {}]
 * @param {number} [options.fwhm = 500] - number of points in Full Width at Half Maximum, Standard deviation for gaussian contribution will be computed as fwhm / 2 / sqrt(2 ln(2))
 * @param {number} [options.mu = 0.5] - fraction of lorentzian contribution.
 * @param {number} [options.factor] - factor of HWHM to increase the window size, the vector size is 2 * factor * HMHM
 * @return {number}
 */

export function pseudoVoigt(options = {}) {
  const { factor = 2, fwhm = 500, mu = 0.5 } = options;

  const halfWidth = fwhm / 2;
  const lenPVoigt = 2 * parseInt(halfWidth, 10) * factor + (fwhm % 2);
  const center = (lenPVoigt - 1) / 2;
  const sigma = fwhm / 2 / Math.sqrt(2 * Math.log(2));

  const rootHalfWidth = Math.pow(halfWidth, 2);
  const lFactor = (mu * halfWidth * 2) / Math.PI;
  const gFactor = (1 - mu) * (1 / Math.sqrt(Math.PI) / sigma);
  const vector = new Float64Array(lenPVoigt);
  for (let i = 0; i <= center; i++) {
    vector[i] =
      lFactor / (4 * Math.pow(i - center, 2) + rootHalfWidth) +
      gFactor * Math.exp(-1 * Math.pow((i - center) / sigma, 2));
  }
  let limit = fwhm % 2 ? center : center + 1;
  vector.set(
    vector.slice(0, parseInt(limit, 10)).reverse(),
    parseInt(center + 1, 10),
  );
  return vector;
}
