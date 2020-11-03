import { lorentzianFct } from './shapes/lorentzianFct';
/**
 * Calculate a lorentzian shape
 * @param {object} [options = {}]
 * @param {Number} [options.height] - maximum value of the curve.
 * @param {Number} [options.normalized] - If it's true the area under the curve will be equal to one, ignoring height option.
 * @param {number} [options.fwhm = 500] - number of points in Full Width at Half Maximum.
 * @param {number} [options.factor = Math.tan(Math.PI * (0.9999 - 0.5))] - Number of time to take fwhm to calculate length. Default covers 99.99 % of area.
 * @param {number} [options.length = fwhm * factor + 1] - total number of points to calculate
 * @return {object} - {fwhm, data<Float64Array>}
 */

export function lorentzian(options = {}) {
  let {
    height = 1,
    length,
    factor = Math.ceil(2 * Math.tan(Math.PI * (0.9999 - 0.5))),
    fwhm = 500,
    normalized = false,
  } = options;

  if (!length) {
    length = Math.ceil(fwhm * factor);
    if (length % 2 === 0) length++;
  }

  const center = (length - 1) / 2;

  const func = lorentzianFct({
    x: center,
    width: fwhm,
    y: normalized ? 2 / Math.PI / fwhm : height,
  });

  const data = new Float64Array(length);
  for (let i = 0; i <= center; i++) {
    data[i] = func(i);
    data[length - 1 - i] = data[i];
  }
  return { data, fwhm };
}
