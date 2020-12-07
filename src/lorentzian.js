import { lorentzianFct } from './shapes/lorentzianFct';
/**
 * Calculate a lorentzian shape
 * @param {object} [options = {}]
 * @param {Number} [options.height] - maximum value of the curve.
 * @param {Number} [options.normalized] - If it's true the area under the curve will be equal to one, ignoring height option.
 * @param {Number} [options.interval = 1] - Step size to calculate the shape values.
 * @param {number} [options.fwhm = 500] - Full Width at Half Maximum, if options.interval is equal to 1, it will be the number of points in FWHM.
 * @param {number} [options.factor = Math.tan(Math.PI * (0.9999 - 0.5))] - Number of time to take fwhm to calculate length. Default covers 99.99 % of area.
 * @param {number} [options.length = fwhm * factor + 1] - total number of points to calculate
 * @return {object} - {fwhm, data<Float64Array>} - An object with the number of points at half maximum and the array of y values covering the 99.99 % of the area.
 */

export function lorentzian(options = {}) {
  let {
    height = 1,
    interval = 1,
    length,
    factor = Math.ceil(2 * Math.tan(Math.PI * (0.9999 - 0.5))),
    fwhm = 500,
    normalized = false,
  } = options;

  if (!length) {
    length = Math.min(
      Math.ceil((fwhm * factor) / interval),
      Math.pow(2, 25) - 1,
    );
    if (length % 2 === 0) length++;
  }

  const center = (length - 1) / 2;
  const mean = center * interval;
  const data = new Float64Array(length);
  const intensity = normalized ? 2 / Math.PI / fwhm : height;
  for (let i = 0; i <= center; i++) {
    data[i] = lorentzianFct(mean, intensity, fwhm, i * interval);
    data[length - 1 - i] = data[i];
  }
  return { data, fwhm, interval };
}
