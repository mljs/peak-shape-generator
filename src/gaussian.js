/**
 * Calculate a normalized gaussian shape
 * @param {object} [options = {}]
 * @param {number} [options.FWHM = 500] - number of points in Full Width at Half Maximum, Standard deviation will be computed as FWHM / 2 / sqrt(2 ln(2))
 * @param {number} [options.SD] - Standard deviation, if it's defined FWHM parameter will be ignored.
 * @param {number} [options.factor = 3] - factor of standard deviation to increase the window size, the vector size is 2 * factor * SD
 * @return {Float64Array} - array of Y points
 */

export function gaussian(options = {}) {
  let { factor = 3, FWHM = 500, SD } = options;

  let sigma;
  if (SD) {
    sigma = SD;
  } else {
    sigma = FWHM / 2 / Math.sqrt(2 * Math.log(2));
  }

  const lenGaussian = 2 * parseInt(sigma, 10) * factor;

  const center = lenGaussian / 2;
  const normalConstant = 1 / Math.sqrt(2 * Math.PI) / sigma;
  const vector = new Float64Array(lenGaussian);
  for (let i = 0; i < lenGaussian; i++) {
    vector[i] =
      normalConstant * Math.exp(-(1 / 2) * Math.pow((i - center) / sigma, 2));
  }
  return vector;
}
