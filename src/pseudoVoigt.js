/**
 * Calculate a linear combination of gaussian and lorentzian function width an same full width at half maximum
 * @param {number} [options.FWHM = 500] - number of points in Full Width at Half Maximum, Standard deviation for gaussian contribution will be computed as FWHM / 2 / sqrt(2 ln(2))
 * @param {number} [options.mu = 0.5] - fraction of lorentzian contribution.
 * @param {number} [options.factor] - factor of HWHM to increase the window size, the vector size is 2 * factor * HMHM
 * @return {number}
 */

export function pseudoVoigt(options = {}) {
  const { factor = 8, FWHM = 500, mu = 0.5 } = options;

  const halfWidth = FWHM / 2;
  const lenPVoigt = 2 * parseInt(factor * halfWidth, 10);
  const center = lenPVoigt / 2;
  const sigma = FWHM / 2 / Math.sqrt(2 * Math.log(2));

  const rootHalfWidth = Math.pow(halfWidth, 2);
  const lFactor = (mu * halfWidth * 2) / Math.PI;
  const gFactor = (1 - mu) * (1 / Math.sqrt(Math.PI) / sigma);
  const vector = new Float64Array(lenPVoigt);
  for (let i = 0; i < lenPVoigt; i++) {
    vector[i] =
      lFactor / (4 * Math.pow(i - center, 2) + rootHalfWidth) +
      gFactor * Math.exp(-1 * Math.pow((i - center) / sigma, 2));
  }
  return vector;
}
