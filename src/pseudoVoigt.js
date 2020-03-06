/**
 * Calculate a linear combination of gaussian and lorentzian function width an same full width at half maximum
 * @param {object} [options = {}]
 * @param {number} [options.fwhm = 500] - number of points in Full Width at Half Maximum, Standard deviation for gaussian contribution will be computed as fwhm / 2 / sqrt(2 ln(2))
 * @param {number} [options.mu = 0.5] - fraction of lorentzian contribution.
 * @param {number} [options.factor = 3] - Number of time to take fwhm to calculate length
 * @param {number} [options.length = fwhm * 3] - total number of points to calculate
 * @return {object} - {fwhm, data<Float64Array>}
 */

export function pseudoVoigt(options = {}) {
  let { length, factor = 3, fwhm = 1000, mu = 0.5 } = options;
  if (length === undefined) length = fwhm * factor;
  const halfWidth = fwhm / 2;
  const center = (length - 1) / 2;
  const sigma = fwhm / 2 / Math.sqrt(2 * Math.log(2));

  const rootHalfWidth = Math.pow(halfWidth, 2);
  const lFactor = (mu * halfWidth * 2) / Math.PI;
  const gFactor = (1 - mu) * (1 / Math.sqrt(Math.PI) / sigma);
  const data = new Float64Array(length);
  for (let i = 0; i <= center; i++) {
    data[i] =
      lFactor / (4 * Math.pow(i - center, 2) + rootHalfWidth) +
      gFactor * Math.exp(-1 * Math.pow((i - center) / sigma, 2));
    data[length - 1 - i] = data[i];
  }
  return { data, fwhm };
}
