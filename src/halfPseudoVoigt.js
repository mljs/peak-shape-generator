/**
 * Calculate the half of a linear combination of gaussian and lorentzian function width an same full width at half maximum
 * @param {object} [options = {}]
 * @param {number} [options.fwhm = 500] - number of points in Full Width at Half Maximum, Standard deviation for gaussian contribution will be computed as fwhm / 2 / sqrt(2 ln(2))
 * @param {number} [options.mu = 0.5] - fraction of lorentzian contribution.
 * @param {number} [options.factor] - factor of HWHM to increase the window size, the vector size is 2 * factor * HMHM.
 * @param {boolean} [options.ascending = false] - if it is true the vector will contain the left side of the Gaussian shape.
 * @return {number}
 */

export function halfPseudoVoigt(options = {}) {
  const { factor = 8, fwhm = 500, mu = 0.5, ascending = false } = options;

  const halfWidth = fwhm / 2;
  const lenPVoigt = parseInt(factor * halfWidth, 10);
  const center = ascending ? lenPVoigt : 0;
  const sigma = fwhm / 2 / Math.sqrt(2 * Math.log(2));

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
