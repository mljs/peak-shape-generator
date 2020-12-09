import { GAUSSIAN_EXP_FACTOR } from '../util/constants';
/**
 * Return a parameterized function of a gaussian shape (see README for equation).
 * @param {Number} x - center of the lorentzian function.
 * @param {Number} y - height of the lorentzian shape curve.
 * @param {Number} width - full width at half maximum (FWHM) of the lorentzian function.
 * @param {Number} t - x value to calculate.
 * @returns {Number} - the y value of gaussian with the current parameters.
 */

export function gaussianFct(x, y, width, t) {
  return y * Math.exp(GAUSSIAN_EXP_FACTOR * Math.pow((t - x) / width, 2));
}
