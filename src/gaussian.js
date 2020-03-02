/**
 * Calculate a normalized gaussian shape
 * @param {object} [options = {}]
 * @param {number} [options.fwhm = 500] - number of points in Full Width at Half Maximum, Standard deviation will be computed as fwhm / 2 / sqrt(2 ln(2))
 * @param {number} [options.sd] - Standard deviation, if it's defined fwhm parameter will be ignored.
 * @param {number} [options.factor = 3] - factor to increase window size: nbPoints = fwhm * factor
 * @return {Float64Array} - array of Y points
 */

export function gaussian(options = {}) {
  let { factor = 3, fwhm = 500, sd } = options;

  if (sd) {
    fwhm = Math.round(2 * Math.sqrt(2 * Math.log(2)) * sd);
  } else {
    sd = fwhm / 2 / Math.sqrt(2 * Math.log(2));
  }

  const halfWidth = fwhm / 2;
  const lenGaussian = 2 * parseInt(halfWidth, 10) * factor + (fwhm % 2);
  const center = (lenGaussian - 1) / 2;

  const vector = new Float64Array(lenGaussian);
  const normalConstant = 1 / Math.sqrt(2 * Math.PI) / sd;
  for (let i = 0; i <= center; i++) {
    vector[i] =
      normalConstant * Math.exp(-(1 / 2) * Math.pow((i - center) / sd, 2));
  }
  let limit = fwhm % 2 ? center : center + 1;
  vector.set(
    vector.slice(0, parseInt(limit, 10)).reverse(),
    parseInt(center + 1, 10),
  );
  return vector;
}
