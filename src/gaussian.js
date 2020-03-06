/**
 * Calculate a normalized gaussian shape
 * @param {object} [options = {}]
 * @param {number} [options.fwhm = 500] - number of points in Full Width at Half Maximum, Standard deviation will be computed as fwhm / 2 / sqrt(2 ln(2))
 * @param {number} [options.sd] - Standard deviation, if it's defined fwhm parameter will be ignored.
 * @param {number} [options.factor = 3] - Number of time to take fwhm to calculate length
 * @param {number} [options.length = fwhm * factor] - total number of points to calculate
 * @return {object} - {fwhm, data<Float64Array>}
 */

export function gaussian(options = {}) {
  let { length, factor = 3, fwhm = 500, sd } = options;

  if (sd) {
    fwhm = Math.round(2 * Math.sqrt(2 * Math.log(2)) * sd);
  } else {
    sd = fwhm / 2 / Math.sqrt(2 * Math.log(2));
  }

  if (!length) length = fwhm * factor;

  const center = (length - 1) / 2;

  const data = new Float64Array(length);
  const normalConstant = 1 / Math.sqrt(2 * Math.PI) / sd;
  for (let i = 0; i <= center; i++) {
    data[i] =
      normalConstant * Math.exp(-(1 / 2) * Math.pow((i - center) / sd, 2));
    data[length - 1 - i] = data[i];
  }
  return { data, fwhm };
}
