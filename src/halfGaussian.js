/**
 * Calculate a half gaussian shape
 * @param {object} [options = {}]
 * @param {number} [options.FWHM = 500] - number of points in Full Width at Half Maximum, Standard deviation will be computed as FWHM / 2 / sqrt(2 ln(2))
 * @param {number} [options.SD] - Standard deviation, if it's defined FWHM parameter will be ignored.
 * @param {number} [options.factor = 3] - factor of standard deviation to increase the window size, the vector size is 2 * factor * SD
 * @param {boolean} [options.ascending = false] - if it is true the vector will contain the left side of the Gaussian shape
 * @return {Float64Array} - array of Y points
 */

export function halfGaussian(options = {}) {
  let { factor = 3, FWHM = 500, SD, ascending } = options;

  let sigma;
  if (SD) {
    sigma = SD;
  } else {
    sigma = FWHM / 2 / Math.sqrt(2 * Math.log(2));
  }

  const lenGaussian = parseInt(sigma, 10) * factor;

  let center = ascending ? lenGaussian : 0;
  const vector = new Float64Array(lenGaussian);
  const normalConstant = 1 / Math.sqrt(2 * Math.PI) / sigma;
  for (let i = 0; i < lenGaussian; i++) {
    vector[i] =
      normalConstant * Math.exp(-(1 / 2) * Math.pow((i - center) / sigma, 2));
  }
  return vector;
}
