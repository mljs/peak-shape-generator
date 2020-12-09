import { lorentzianFct } from './shapes/lorentzianFct';
import { LORENTZIAN } from './util/constants';
import { getFactor } from './util/getFactor';
/**
 * Calculate a lorentzian shape
 * @param {object} [options = {}]
 * @param {number} [options.height] - maximum value of the curve.
 * @param {number} [options.normalized] - If it's true the area under the curve will be equal to one, ignoring height option.
 * @param {number} [options.fwhm = 500] - Full Width at Half Maximum in number of points.
 * @param {number} [options.factor = Math.tan(Math.PI * (0.9999 - 0.5))] - Number of time to take fwhm to calculate length. Default covers 99.99 % of area.
 * @param {number} [options.length = fwhm * factor + 1] - total number of points to calculate
 * @return {object} - {fwhm, data<Float64Array>} - An object with the number of points at half maximum and the array of y values covering the 99.99 % of the area.
 */

export function lorentzian(options = {}) {
  let {
    height = 1,
    length,
    factor = getFactor(LORENTZIAN),
    fwhm = 500,
    normalized = false,
  } = options;

  if (!length) {
    length = Math.min(Math.ceil(fwhm * factor), Math.pow(2, 25) - 1);
    if (length % 2 === 0) length++;
  }

  const center = (length - 1) / 2;
  const data = new Float64Array(length);
  const intensity = normalized ? 2 / Math.PI / fwhm : height;
  for (let i = 0; i <= center; i++) {
    data[i] = lorentzianFct(center, intensity, fwhm, i);
    data[length - 1 - i] = data[i];
  }
  return { data, fwhm };
}
