/**
 * Calculate a lorentzian shape
 * @param {object} [options = {}]
 * @param {number} [options.fwhm = 500] - number of points in Full Width at Half Maximum.
 * @param {number} [options.factor = 3] - Number of time to take fwhm to calculate length
 * @param {number} [options.length = fwhm * factor + 1] - total number of points to calculate
 * @return {object} - {fwhm, data<Float64Array>}
 */

export function lorentzian(options = {}) {
  let { length, fwhm } = lorentzianOptions(options);

  const halfWidth = fwhm / 2;
  const center = (length - 1) / 2;
  const normalConstant = 1 / Math.PI;
  const data = new Float64Array(length);
  for (let i = 0; i <= center; i++) {
    data[i] =
      (normalConstant * halfWidth) /
      (Math.pow(i - center, 2) + Math.pow(halfWidth, 2));
    data[length - 1 - i] = data[i];
  }
  return { data, fwhm };
}

export function lorentzianOptions(options = {}) {
  let { length, factor = 3, fwhm = 1000 } = options;

  if (!length) {
    length = fwhm * factor;
    if (length % 2 === 0) length++;
  }
  return { length, factor, fwhm };
}
